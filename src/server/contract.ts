/**
 * Single source of truth for the HTTP contract shared by every host
 * (Vercel, Netlify, Express, Cloudflare Worker) and by the `image-studio-client` SDK.
 *
 * Success  -> 200, binary body (`image/png | image/gif | image/webp`) + metadata headers.
 * Failure  -> 4xx/5xx, JSON `{ error: string, code: ApiErrorCode, details?: unknown }`.
 *             (`error` is kept for backward compatibility; clients should branch on `code`.)
 */
import type { AnyGenerateRequest } from "../lib/types.js";
import { dispatchGenerate, MAX_FRAMES, MAX_TOTAL_DURATION } from "../lib/animated-generator.js";
import { getRuntime, UnsupportedOnRuntimeError } from "../lib/runtime.js";
import { PRESETS, getPresetById, DEFAULT_TEMPLATE_VARIABLES } from "../lib/animation-presets.js";

export { ApiError } from "../lib/errors.js";
export type { ApiErrorCode } from "../lib/errors.js";
import { ApiError, type ApiErrorCode } from "../lib/errors.js";

export interface ApiErrorBody {
  error: string;
  code: ApiErrorCode;
  details?: unknown;
}

export function errorToPayload(error: unknown): { status: number; body: ApiErrorBody } {
  if (error instanceof ApiError) {
    return { status: error.status, body: { error: error.message, code: error.code, ...(error.details !== undefined ? { details: error.details } : {}) } };
  }
  if (error instanceof UnsupportedOnRuntimeError) {
    return { status: error.statusCode, body: { error: error.message, code: "UNSUPPORTED" } };
  }
  const message = error instanceof Error ? error.message : "Internal Server Error";
  return { status: 500, body: { error: message, code: "RENDER_FAILED" } };
}

/* ------------------------------------------------------------------------------------------------
   Request validation (structural only: enough to turn client mistakes into 400 instead of 500)
   ---------------------------------------------------------------------------------------------- */

export const GENERATE_TYPES = ["song", "profile", "leaderboard", "quote", "custom", "animated"] as const;

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

export function validateGenerateRequest(body: unknown): asserts body is AnyGenerateRequest {
  if (!isObject(body)) {
    throw new ApiError(400, "INVALID_REQUEST", "Invalid payload: request body must be a JSON object.");
  }
  const type = body.type;
  if (type === undefined || type === "song") {
    if (!Array.isArray(body.items)) {
      throw new ApiError(400, "INVALID_REQUEST", 'Invalid payload: song requests need an "items" array.', { field: "items" });
    }
    return;
  }
  if (typeof type !== "string" || !(GENERATE_TYPES as readonly string[]).includes(type)) {
    throw new ApiError(400, "INVALID_REQUEST", `Unknown type "${String(type)}". Expected one of: ${GENERATE_TYPES.join(", ")}.`, { field: "type" });
  }
  const data = body.data;
  if (!isObject(data)) {
    throw new ApiError(400, "INVALID_REQUEST", `Invalid payload: "${type}" requests need a "data" object.`, { field: "data" });
  }
  if (type === "leaderboard" && !Array.isArray(data.items)) {
    throw new ApiError(400, "INVALID_REQUEST", 'Invalid payload: leaderboard "data.items" must be an array.', { field: "data.items" });
  }
  if (type === "custom" && !Array.isArray(data.elements)) {
    throw new ApiError(400, "INVALID_REQUEST", 'Invalid payload: custom "data.elements" must be an array.', { field: "data.elements" });
  }
  if (type === "animated") {
    const hasFrames = Array.isArray(data.frames) && data.frames.length > 0;
    const hasTimeline = isObject(data.canvas) && Array.isArray(data.tracks);
    if (!hasFrames && !hasTimeline) {
      throw new ApiError(400, "INVALID_REQUEST", 'Invalid payload: animated "data" needs either "frames" or "canvas" + "tracks".', { field: "data" });
    }
    if (data.format !== undefined && !["gif", "webp", "png"].includes(String(data.format))) {
      throw new ApiError(400, "INVALID_REQUEST", 'Invalid payload: animated "data.format" must be "gif", "webp" or "png".', { field: "data.format" });
    }
  }
}

/* ------------------------------------------------------------------------------------------------
   Query handling (identical on every host)
   ---------------------------------------------------------------------------------------------- */

export type QueryInput = Record<string, string | string[] | undefined | null>;

export function flattenQuery(query: QueryInput | URLSearchParams | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!query) return out;
  if (query instanceof URLSearchParams) {
    for (const [k, v] of query.entries()) out[k] = v;
    return out;
  }
  for (const [k, v] of Object.entries(query)) {
    const value = Array.isArray(v) ? v[0] : v;
    if (typeof value === "string") out[k] = value;
  }
  return out;
}

function parseFiniteNumber(raw: string | undefined, name: string, integer: boolean): number | undefined {
  if (raw === undefined) return undefined;
  const n = integer ? parseInt(raw, 10) : parseFloat(raw);
  if (!Number.isFinite(n)) throw new ApiError(400, "INVALID_REQUEST", `Invalid query parameter "${name}": expected a number.`, { field: name });
  return n;
}

/** `POST /api/generate?frame=…|time=…|format=png` turns an animated request into a single PNG frame. */
export function applyAnimatedQuery(body: AnyGenerateRequest, rawQuery: QueryInput | URLSearchParams | undefined): void {
  if (body.type !== "animated" || !body.data) return;
  const q = flattenQuery(rawQuery);
  const frame = parseFiniteNumber(q.frame ?? q.frameIndex, "frame", true);
  const time = parseFiniteNumber(q.time ?? q.frameTime, "time", false);
  if (frame !== undefined) {
    body.data.frameIndex = frame;
    body.data.format = "png";
  }
  if (time !== undefined) {
    body.data.frameTime = time;
    body.data.format = "png";
  }
  if (q.format === "png") body.data.format = "png";
}

const RESERVED_FRAME_QUERY = new Set(["preset", "time", "frameTime", "frame", "frameIndex", "format", "fps", "duration", "loop"]);

/** Builds the render request for `/api/animation/frame` (GET = built-in preset, POST = custom timeline). */
export function buildFrameRequest(method: string, rawQuery: QueryInput | URLSearchParams | undefined, rawBody: unknown): AnyGenerateRequest {
  const q = flattenQuery(rawQuery);

  if (method === "GET") {
    const presetId = q.preset || "welcome";
    const preset = getPresetById(presetId);
    if (!preset) {
      throw new ApiError(400, "INVALID_REQUEST", `Unknown preset "${presetId}". Available: ${PRESETS.map((p) => p.id).join(", ")}.`, {
        field: "preset",
        available: PRESETS.map((p) => p.id),
      });
    }
    const format = q.format ?? "png";
    if (!["png", "gif", "webp"].includes(format)) {
      throw new ApiError(400, "INVALID_REQUEST", 'Invalid query parameter "format": expected png, gif or webp.', { field: "format" });
    }
    const frameIndex = parseFiniteNumber(q.frame ?? q.frameIndex, "frame", true);
    const time = parseFiniteNumber(q.time ?? q.frameTime, "time", false) ?? 350;

    const templateVariables: Record<string, string> = { ...DEFAULT_TEMPLATE_VARIABLES };
    for (const [k, v] of Object.entries(q)) if (!RESERVED_FRAME_QUERY.has(k)) templateVariables[k] = v;

    // format=gif|webp renders the whole preset animation instead of a single frame
    const animated = format !== "png";
    return {
      type: "animated",
      data: {
        title: preset.canvas.title,
        format: format as "png" | "gif" | "webp",
        frameTime: animated || frameIndex !== undefined ? undefined : time,
        frameIndex: animated ? undefined : frameIndex,
        ...(animated
          ? {
              fps: parseFiniteNumber(q.fps, "fps", true) ?? preset.fps,
              duration: parseFiniteNumber(q.duration, "duration", true) ?? preset.duration,
              loop: parseFiniteNumber(q.loop, "loop", true),
            }
          : {}),
        canvas: preset.canvas,
        tracks: preset.tracks,
        templateVariables,
      },
    };
  }

  if (method === "POST") {
    const parsed = isObject(rawBody) ? rawBody : {};
    const animData: any = parsed.type === "animated" && isObject(parsed.data) ? parsed.data : parsed;

    let frameTime = animData.frameTime ?? parseFiniteNumber(q.time ?? q.frameTime, "time", false);
    const frameIndex = animData.frameIndex ?? parseFiniteNumber(q.frame ?? q.frameIndex, "frame", true);
    if (frameTime === undefined && frameIndex === undefined) frameTime = 0;

    const request = { type: "animated", data: { ...animData, format: "png", frameTime, frameIndex } } as AnyGenerateRequest;
    validateGenerateRequest(request);
    return request;
  }

  throw new ApiError(405, "METHOD_NOT_ALLOWED", "Method Not Allowed. Use GET or POST.");
}

/* ------------------------------------------------------------------------------------------------
   Rendering + response metadata
   ---------------------------------------------------------------------------------------------- */

export interface RenderOutcome {
  buffer: Buffer;
  mime: string;
  width: number;
  height: number;
  filename: string;
  renderMs: number;
  runtime: string;
}

/** Width is not reported by the static generators (0): read it from the encoded image instead. */
export function readImageWidth(buffer: Uint8Array): number {
  const b = buffer;
  if (b.length > 24 && b[0] === 0x89 && b[1] === 0x50) return ((b[16] << 24) | (b[17] << 16) | (b[18] << 8) | b[19]) >>> 0; // PNG IHDR
  if (b.length > 10 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return b[6] | (b[7] << 8); // GIF logical screen
  return 0;
}

export async function renderRequest(body: AnyGenerateRequest): Promise<RenderOutcome> {
  const started = Date.now();
  const result = await dispatchGenerate(body);
  return {
    buffer: result.buffer,
    mime: result.mime,
    width: result.width || readImageWidth(result.buffer),
    height: result.height,
    filename: result.filename,
    renderMs: Date.now() - started,
    runtime: getRuntime().name,
  };
}

export const EXPOSED_HEADERS = [
  "X-Total-Generated",
  "X-Image-Width",
  "X-Image-Height",
  "X-Render-Ms",
  "X-Render-Runtime",
  "Content-Disposition",
].join(", ");

export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Expose-Headers": EXPOSED_HEADERS,
};

export function imageHeaders(result: RenderOutcome, totalGenerated: number): Record<string, string> {
  return {
    "Content-Type": result.mime,
    "Content-Length": result.buffer.length.toString(),
    "X-Image-Width": result.width.toString(),
    "X-Image-Height": result.height.toString(),
    "X-Total-Generated": totalGenerated.toString(),
    "X-Render-Ms": result.renderMs.toString(),
    "X-Render-Runtime": result.runtime,
    "Content-Disposition": `attachment; filename="${encodeURIComponent(result.filename)}"`,
    ...CORS_HEADERS,
  };
}

export function parseJsonText(text: string | null | undefined): unknown {
  if (!text) throw new ApiError(400, "INVALID_REQUEST", "Invalid payload: request body is required.");
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError(400, "INVALID_REQUEST", "Invalid payload: request body must be valid JSON.");
  }
}

/* ------------------------------------------------------------------------------------------------
   Capability discovery (merged into GET /api/stats)
   ---------------------------------------------------------------------------------------------- */

export interface ServerCapabilities {
  runtime: "node" | "cloudflare";
  formats: Array<"png" | "gif" | "webp">;
  limits: { maxFrames: number; maxDurationMs: number; maxLoop: number };
  presets: string[];
}

export function describeServer(runtime: "node" | "cloudflare"): ServerCapabilities {
  return {
    runtime,
    formats: runtime === "cloudflare" ? ["png", "gif"] : ["png", "gif", "webp"],
    limits: { maxFrames: MAX_FRAMES, maxDurationMs: MAX_TOTAL_DURATION, maxLoop: 65_535 },
    presets: PRESETS.map((p) => p.id),
  };
}
