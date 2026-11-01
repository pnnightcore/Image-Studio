/**
 * Tiny, dependency-light image helpers for the Cloudflare runtime (no native code):
 *  - format sniffing
 *  - GIF frame extraction (omggif)
 *  - RGBA -> PNG encoding (fflate zlib)
 */
import { GifReader } from "omggif";
import { zlibSync } from "fflate";

export type ImageKind = "png" | "jpeg" | "gif" | "webp" | "svg" | "unknown";

export function sniffImage(bytes: Uint8Array): ImageKind {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (bytes.length >= 6 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return "gif";
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return "webp";
  }
  const head = new TextDecoder().decode(bytes.subarray(0, 256)).trimStart().toLowerCase();
  if (head.startsWith("<svg") || (head.startsWith("<?xml") && head.includes("<svg"))) return "svg";
  return "unknown";
}

export const MIME_BY_KIND: Record<ImageKind, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  unknown: "application/octet-stream",
};

/* ----------------------------------------------------------------------------
   PNG encoder
   -------------------------------------------------------------------------- */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  view.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

/** Encode straight (non-premultiplied) RGBA pixels as a PNG. */
export function encodePngRgba(rgba: Uint8Array | Uint8ClampedArray, width: number, height: number): Uint8Array {
  const stride = width * 4;
  const raw = new Uint8Array((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    raw.set(rgba.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  }
  const ihdr = new Uint8Array(13);
  const view = new DataView(ihdr.buffer);
  view.setUint32(0, width);
  view.setUint32(4, height);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const parts = [
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlibSync(raw, { level: 3 })),
    pngChunk("IEND", new Uint8Array(0)),
  ];
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

/* ----------------------------------------------------------------------------
   GIF frame extraction
   -------------------------------------------------------------------------- */

const MAX_GIF_PIXELS = 4_000_000;
const MAX_GIF_FRAMES = 300;

/** Returns the composited RGBA canvas of the GIF at `timeMs` (looping). */
export function decodeGifFrameAt(bytes: Uint8Array, timeMs: number): { rgba: Uint8ClampedArray; width: number; height: number } {
  const reader = new GifReader(bytes as any);
  const { width, height } = reader;
  const frameCount = reader.numFrames();
  if (width * height > MAX_GIF_PIXELS) throw new Error("Background GIF is too large for the Cloudflare runtime.");
  if (frameCount > MAX_GIF_FRAMES) throw new Error("Background GIF has too many frames for the Cloudflare runtime.");

  const delays: number[] = [];
  for (let i = 0; i < frameCount; i++) delays.push(Math.max(1, reader.frameInfo(i).delay) * 10);

  let target = 0;
  if (frameCount > 1) {
    const total = delays.reduce((a, b) => a + b, 0) || frameCount * 100;
    let cursor = ((timeMs % total) + total) % total;
    for (let i = 0; i < frameCount; i++) {
      target = i;
      if (cursor < delays[i]) break;
      cursor -= delays[i];
    }
  }

  const canvas = new Uint8ClampedArray(width * height * 4);
  let prev: { x: number; y: number; width: number; height: number; disposal: number; snapshot: Uint8ClampedArray | null } | null = null;
  for (let i = 0; i <= target; i++) {
    if (prev) {
      if (prev.disposal === 2) {
        for (let y = prev.y; y < Math.min(height, prev.y + prev.height); y++) {
          canvas.fill(0, (y * width + prev.x) * 4, (y * width + Math.min(width, prev.x + prev.width)) * 4);
        }
      } else if (prev.disposal === 3 && prev.snapshot) {
        canvas.set(prev.snapshot);
      }
    }
    const info = reader.frameInfo(i);
    const snapshot = info.disposal === 3 ? canvas.slice() : null;
    reader.decodeAndBlitFrameRGBA(i, canvas as any);
    prev = { x: info.x, y: info.y, width: info.width, height: info.height, disposal: info.disposal, snapshot };
  }
  return { rgba: canvas, width, height };
}
