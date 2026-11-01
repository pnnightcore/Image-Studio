/**
 * Node runtime (Vercel, Netlify Functions, Express/VPS): satori + sharp.
 * Importing this module registers it as the active runtime.
 */
import satori from "satori";
import sharp, { type Metadata } from "sharp";
import { setRuntime, sanitizeSatoriElement, type RuntimeAdapter } from "./runtime.js";

const metadataCache = new WeakMap<object, Promise<Metadata>>();

function getMetadata(source: Buffer) {
  let metadata = metadataCache.get(source);
  if (!metadata) {
    metadata = sharp(source, { animated: true }).metadata();
    metadataCache.set(source, metadata);
  }
  return metadata;
}

export const nodeRuntime: RuntimeAdapter = {
  name: "node",
  preferEmbeddedFonts: false,
  imageAccept:
    "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",

  async renderSvg(element, options) {
    return satori(sanitizeSatoriElement(element) as any, options as any);
  },

  async svgToPng(svg) {
    return sharp(typeof svg === "string" ? Buffer.from(svg) : Buffer.from(svg)).png().toBuffer();
  },

  async optimizeAvatar(source, size) {
    const buffer = await sharp(source)
      .resize(size, size, { fit: "cover" })
      .jpeg({ quality: 85 })
      .toBuffer();
    return { buffer, mime: "image/jpeg" };
  },

  async getBackgroundFrame(source, timeMs, width, height) {
    const metadata = await getMetadata(source);
    const pages = Math.max(1, metadata.pages ?? 1);
    let page = 0;
    const delays = metadata.delay ?? [];
    if (pages > 1 && delays.length) {
      const total = delays.reduce((sum: number, value: number) => sum + value, 0) || pages * 100;
      let cursor = ((timeMs % total) + total) % total;
      for (let i = 0; i < pages; i++) {
        const delay = delays[i] ?? 100;
        if (cursor < delay) {
          page = i;
          break;
        }
        cursor -= delay;
        page = i;
      }
    } else if (pages > 1) {
      page = Math.min(pages - 1, Math.floor(Math.max(0, timeMs) / 100) % pages);
    }
    const buffer = await sharp(source, { page })
      .resize(width, height, { fit: "cover" })
      .png()
      .toBuffer();
    return { buffer, mime: "image/png" };
  },

  async encodeAnimation(svgFrames, { format, delays, loop }) {
    const animated = sharp(svgFrames.map((f) => Buffer.from(f)), { join: { animated: true } });
    if (format === "gif") {
      return animated.gif({ delay: delays, loop, keepDuplicateFrames: true, reuse: true }).toBuffer();
    }
    return animated.webp({ delay: delays, loop, effort: 4, quality: 90 }).toBuffer();
  },
};

setRuntime(nodeRuntime);
