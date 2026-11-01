/**
 * Runtime abstraction for the image pipeline.
 *
 * The generators (image-generator / animated-*) are platform neutral: they build
 * a Satori element tree and then ask the active runtime to
 *   1. turn the tree into an SVG string            (satori)
 *   2. rasterise SVG -> PNG                        (sharp on Node, resvg-wasm on Cloudflare)
 *   3. optimise avatars / pick animated bg frames   (sharp on Node, light JS on Cloudflare)
 *   4. encode animated GIF / WebP                   (sharp on Node, gifenc on Cloudflare)
 *
 * Node targets (Vercel, Netlify, Express) register `runtime-node.ts`;
 * Cloudflare Workers registers `src/worker/runtime-worker.ts`.
 */

export interface EncodedImage {
  buffer: Buffer;
  mime: string;
}

export interface AnimationEncodeOptions {
  format: "gif" | "webp";
  delays: number[];
  loop: number;
  width: number;
  height: number;
}

export class UnsupportedOnRuntimeError extends Error {
  readonly statusCode = 501;
  constructor(message: string) {
    super(message);
    this.name = "UnsupportedOnRuntimeError";
  }
}

export interface RuntimeAdapter {
  readonly name: "node" | "cloudflare";
  /** Use the base64 embedded Roboto fonts instead of reading public/fonts from disk. */
  readonly preferEmbeddedFonts: boolean;
  /** `Accept` header used when downloading avatars / backgrounds. */
  readonly imageAccept: string;

  renderSvg(element: unknown, options: Record<string, unknown>): Promise<string>;
  svgToPng(svg: string | Uint8Array): Promise<Buffer>;
  /** Normalise a downloaded avatar. Must throw if the image cannot be used. */
  optimizeAvatar(source: Buffer, size: number): Promise<EncodedImage>;
  /** Pick the frame of a (possibly animated) background that matches `timeMs`. */
  getBackgroundFrame(source: Buffer, timeMs: number, width: number, height: number): Promise<EncodedImage>;
  encodeAnimation(svgFrames: Uint8Array[], options: AnimationEncodeOptions): Promise<Buffer>;
}

let current: RuntimeAdapter | null = null;

export function setRuntime(adapter: RuntimeAdapter): void {
  current = adapter;
}

export function getRuntime(): RuntimeAdapter {
  if (!current) {
    throw new Error(
      "No image runtime registered. Import 'src/lib/runtime-node' (Node/Vercel/Netlify) or 'src/worker/runtime-worker' (Cloudflare) in your entry file."
    );
  }
  return current;
}

/**
 * Recursively strip properties unsupported by Satori (e.g. zIndex, z-index)
 * from VNode style objects so Satori does not emit console warnings.
 */
export function sanitizeSatoriElement(element: any): any {
  if (!element || typeof element !== "object") return element;
  if (Array.isArray(element)) {
    for (let i = 0; i < element.length; i++) {
      element[i] = sanitizeSatoriElement(element[i]);
    }
    return element;
  }
  if (element.props) {
    if (element.props.style && typeof element.props.style === "object") {
      if ("zIndex" in element.props.style) {
        delete element.props.style.zIndex;
      }
      if ("z-index" in element.props.style) {
        delete element.props.style["z-index"];
      }
    }
    if (element.props.children) {
      element.props.children = sanitizeSatoriElement(element.props.children);
    }
  }
  return element;
}

