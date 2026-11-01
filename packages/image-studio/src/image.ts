import { ImageStudioError } from "./errors.js";

/** Anything the SDK can turn into an image the server understands (URL, data URI, or raw bytes). */
export type ImageInput = string | Uint8Array | ArrayBuffer | Blob;

export type ImageMime = "image/png" | "image/gif" | "image/webp";

const nodeBuffer = (): any => (globalThis as any).Buffer;

export function bytesToBase64(bytes: Uint8Array): string {
  const B = nodeBuffer();
  if (B) return B.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("base64");
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

export function sniffMime(b: Uint8Array): string | undefined {
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.length > 6 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return "image/gif";
  if (b.length > 12 && b[0] === 0x52 && b[1] === 0x49 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  return undefined;
}

/**
 * Normalises an avatar / icon value for the request body.
 * Strings (http(s) URLs or `data:` URIs) pass through; bytes/Blobs become base64 data URIs.
 */
export async function toImageSource(input: ImageInput | undefined | null): Promise<string> {
  if (input === undefined || input === null) return "";
  if (typeof input === "string") return input;
  let bytes: Uint8Array;
  let mime: string | undefined;
  if (typeof Blob !== "undefined" && input instanceof Blob) {
    bytes = new Uint8Array(await input.arrayBuffer());
    mime = input.type || undefined;
  } else if (input instanceof ArrayBuffer) {
    bytes = new Uint8Array(input);
  } else {
    bytes = input as Uint8Array;
  }
  mime = mime || sniffMime(bytes);
  if (!mime) throw new ImageStudioError("INVALID_REQUEST", "Unrecognised image bytes (expected PNG, JPEG, GIF or WebP).");
  return `data:${mime};base64,${bytesToBase64(bytes)}`;
}

/** Pixel size of a PNG / GIF / WebP (VP8X, VP8, VP8L) without decoding it. */
export function readImageSize(b: Uint8Array): { width: number; height: number } | undefined {
  const mime = sniffMime(b);
  if (mime === "image/png" && b.length >= 24) {
    const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
    return { width: v.getUint32(16), height: v.getUint32(20) };
  }
  if (mime === "image/gif" && b.length >= 10) return { width: b[6] | (b[7] << 8), height: b[8] | (b[9] << 8) };
  if (mime === "image/webp" && b.length >= 30) {
    const tag = String.fromCharCode(b[12], b[13], b[14], b[15]);
    if (tag === "VP8X") return { width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)), height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)) };
    if (tag === "VP8 ") return { width: (b[26] | (b[27] << 8)) & 0x3fff, height: (b[28] | (b[29] << 8)) & 0x3fff };
    if (tag === "VP8L") {
      const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }
  return undefined;
}

export interface GeneratedImageMeta {
  mime: string;
  width: number;
  height: number;
  filename: string;
  totalGenerated?: number;
  renderMs?: number;
  runtime?: string;
  /** Host that actually served the image (useful with fail-over). */
  baseUrl: string;
}

const EXTENSIONS: Record<string, string> = { "image/png": "png", "image/gif": "gif", "image/webp": "webp" };

/** The result of every render call: bytes + the metadata the server sends in response headers. */
export class GeneratedImage {
  readonly mime: string;
  readonly width: number;
  readonly height: number;
  readonly filename: string;
  readonly totalGenerated?: number;
  readonly renderMs?: number;
  readonly runtime?: string;
  readonly baseUrl: string;

  constructor(readonly bytes: Uint8Array, meta: GeneratedImageMeta) {
    this.mime = meta.mime;
    this.width = meta.width;
    this.height = meta.height;
    this.filename = meta.filename;
    this.totalGenerated = meta.totalGenerated;
    this.renderMs = meta.renderMs;
    this.runtime = meta.runtime;
    this.baseUrl = meta.baseUrl;
  }

  get size(): number {
    return this.bytes.byteLength;
  }
  get extension(): string {
    return EXTENSIONS[this.mime] ?? "bin";
  }
  get animated(): boolean {
    return this.mime === "image/gif" || this.mime === "image/webp";
  }

  /** `Buffer` on Node/Bun (zero-copy), plain `Uint8Array` elsewhere. */
  toBuffer(): Uint8Array {
    const B = nodeBuffer();
    return B ? B.from(this.bytes.buffer, this.bytes.byteOffset, this.bytes.byteLength) : this.bytes;
  }
  toArrayBuffer(): ArrayBuffer {
    return this.bytes.buffer.slice(this.bytes.byteOffset, this.bytes.byteOffset + this.bytes.byteLength) as ArrayBuffer;
  }
  toBlob(): Blob {
    return new Blob([this.toArrayBuffer()], { type: this.mime });
  }
  toBase64(): string {
    return bytesToBase64(this.bytes);
  }
  toDataURL(): string {
    return `data:${this.mime};base64,${this.toBase64()}`;
  }
  /** A fetch `Response`, handy to return the image from a Worker / Next.js / Hono route. */
  toResponse(init: ResponseInit = {}): Response {
    const headers = new Headers(init.headers);
    if (!headers.has("Content-Type")) headers.set("Content-Type", this.mime);
    return new Response(this.toArrayBuffer(), { ...init, headers });
  }
  /** discord.js: `message.reply({ files: [image.toAttachment()] })` */
  toAttachment(name = this.filename): { attachment: Uint8Array; name: string } {
    return { attachment: this.toBuffer(), name };
  }
  /** Node/Bun only. Writes the file and returns its path (default: `./<filename>`). */
  async save(path: string = this.filename): Promise<string> {
    const fs = await import("node:fs/promises");
    await fs.writeFile(path, this.bytes);
    return path;
  }
}

export function parseContentDispositionFilename(header: string | null): string | undefined {
  if (!header) return undefined;
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(header);
  if (!match) return undefined;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}
