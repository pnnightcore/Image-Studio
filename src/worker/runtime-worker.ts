/**
 * Cloudflare Workers runtime: no native modules, everything is WebAssembly / pure JS.
 *
 *   SVG layout   -> satori/standalone + pre-compiled yoga.wasm (+ harfbuzz shim)
 *   SVG -> PNG   -> @resvg/resvg-wasm
 *   GIF encoding -> gifenc (quantised per frame)
 *
 * Importing this module registers it as the active runtime.
 *
 * Requirements: `nodejs_compat` compatibility flag (Buffer) and the Workers *Paid* plan
 * (image rendering needs more than the 10 ms CPU budget of the free plan).
 */
import satori, { init as initSatori } from "satori/standalone";
import yogaWasm from "satori/yoga.wasm";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import resvgWasm from "@resvg/resvg-wasm/index_bg.wasm";
import { GIFEncoder, quantize, applyPalette } from "gifenc";
import { setRuntime, UnsupportedOnRuntimeError, type RuntimeAdapter } from "../lib/runtime.js";
import { MIME_BY_KIND, decodeGifFrameAt, encodePngRgba, sniffImage } from "./image-codecs.js";

const MAX_INLINE_IMAGE_BYTES = 2 * 1024 * 1024;

let ready: Promise<void> | null = null;

function ensureReady(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await initSatori(yogaWasm);
      await initWasm(resvgWasm);
    })();
    ready.catch(() => {
      ready = null; // retry on next request
    });
  }
  return ready;
}

function toUint8(svg: string | Uint8Array): string | Uint8Array {
  return svg;
}

export const workerRuntime: RuntimeAdapter = {
  name: "cloudflare",
  preferEmbeddedFonts: true,
  // No WebP/AVIF decoding on the edge: ask CDNs for PNG/JPEG/GIF only.
  imageAccept: "image/png,image/jpeg,image/gif;q=0.9,image/svg+xml;q=0.8,*/*;q=0.1",

  async renderSvg(element, options) {
    await ensureReady();
    return satori(element as any, options as any);
  },

  async svgToPng(svg) {
    await ensureReady();
    const resvg = new Resvg(toUint8(svg) as any, { fitTo: { mode: "original" } });
    try {
      const rendered = resvg.render();
      try {
        return Buffer.from(rendered.asPng());
      } finally {
        rendered.free();
      }
    } finally {
      resvg.free();
    }
  },

  async optimizeAvatar(source) {
    const kind = sniffImage(source);
    if (kind === "unknown" || kind === "webp") {
      throw new Error(`Unsupported avatar format on Cloudflare runtime: ${kind}`);
    }
    if (source.length > MAX_INLINE_IMAGE_BYTES) {
      throw new Error("Avatar is too large for the Cloudflare runtime.");
    }
    return { buffer: source, mime: MIME_BY_KIND[kind] };
  },

  async getBackgroundFrame(source, timeMs) {
    const kind = sniffImage(source);
    if (kind === "gif") {
      const { rgba, width, height } = decodeGifFrameAt(source, timeMs);
      return { buffer: Buffer.from(encodePngRgba(rgba, width, height)), mime: "image/png" };
    }
    if (kind === "png" || kind === "jpeg" || kind === "svg") {
      if (source.length > 6 * 1024 * 1024) throw new Error("Background image is too large for the Cloudflare runtime.");
      return { buffer: source, mime: MIME_BY_KIND[kind] };
    }
    throw new Error(`Unsupported background image format on Cloudflare runtime: ${kind} (use PNG, JPEG or GIF).`);
  },

  async encodeAnimation(svgFrames, { format, delays, loop, width, height }) {
    if (format !== "gif") {
      throw new UnsupportedOnRuntimeError(
        'Animated WebP is not supported on the Cloudflare runtime. Use format "gif", or deploy to Vercel/Netlify/Node for WebP.'
      );
    }
    await ensureReady();

    const gif = GIFEncoder();
    for (let i = 0; i < svgFrames.length; i++) {
      const resvg = new Resvg(svgFrames[i] as any, { fitTo: { mode: "original" } });
      const rendered = resvg.render();
      const rgba = rendered.pixels;
      const w = rendered.width || width;
      const h = rendered.height || height;
      rendered.free();
      resvg.free();

      let hasAlpha = false;
      for (let p = 3; p < rgba.length; p += 4) {
        if (rgba[p] < 128) {
          hasAlpha = true;
          break;
        }
      }

      const palette = quantize(rgba, 256, hasAlpha ? { format: "rgba4444", oneBitAlpha: true } : { format: "rgb565" });
      const index = applyPalette(rgba, palette, hasAlpha ? "rgba4444" : "rgb565");
      const transparentIndex = hasAlpha ? palette.findIndex((c) => c.length > 3 && c[3] === 0) : -1;

      gif.writeFrame(index, w, h, {
        palette,
        delay: delays[i],
        repeat: i === 0 ? loop : undefined,
        transparent: transparentIndex >= 0,
        transparentIndex: transparentIndex >= 0 ? transparentIndex : 0,
        dispose: hasAlpha ? 2 : -1,
      });
    }
    gif.finish();
    return Buffer.from(gif.bytes());
  },
};

setRuntime(workerRuntime);
