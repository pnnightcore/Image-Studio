import { ImageStudioError } from "./errors.js";
import { GeneratedImage, parseContentDispositionFilename, readImageSize, toImageSource, type ImageInput } from "./image.js";
import { Transport, type CallOptions, type TransportOptions } from "./transport.js";
import {
  BUILTIN_PRESET_IDS,
  type AnimatedData,
  type CustomCanvasData,
  type GenerateRequest,
  type LeaderboardData,
  type LeaderboardItem,
  type PresetId,
  type ProfileData,
  type QuoteData,
  type ServerStats,
  type SongRequest,
  type SongResult,
} from "./types.js";

/** Server-side limits (also published by `GET /api/stats` → `limits`). Used to fail fast. */
export const DEFAULT_LIMITS = { maxFrames: 60, maxDurationMs: 10_000, maxLoop: 65_535 } as const;

export interface ImageStudioOptions {
  /**
   * API origin. Pass an array for fail-over: the first host is tried first, the next ones only when
   * the failure is host specific (5xx, 429, timeout, Cloudflare 1102, network error).
   * Defaults to the `IMAGE_STUDIO_URL` environment variable.
   */
  baseUrl?: string | string[];
  /** Custom `fetch` (tests, proxies, `undici` agents…). */
  fetch?: typeof fetch;
  /** Extra headers sent with every request. */
  headers?: Record<string, string>;
  /** Per-attempt timeout in ms (headers + body). Default 30 000. */
  timeoutMs?: number;
  /** Extra attempts per host for transient errors (network, 429, 502, 503, 504). Default 2. */
  retries?: number;
  /** Base delay of the exponential back-off. Default 300 ms. */
  retryDelayMs?: number;
  onRetry?: TransportOptions["onRetry"];
  onFailover?: TransportOptions["onFailover"];
}

/* ------------------------------------------------------------- friendly inputs */
export type SongItemInput = Omit<SongResult, "index" | "avatar"> & { index?: number; avatar?: ImageInput };
export interface SongInput extends Omit<SongRequest, "type" | "items"> { items: SongItemInput[] }
export type ProfileInput = Omit<ProfileData, "avatar"> & { avatar?: ImageInput };
export type QuoteInput = Omit<QuoteData, "avatar"> & { avatar?: ImageInput };
export type LeaderboardItemInput = Omit<LeaderboardItem, "avatar"> & { avatar?: ImageInput };
export interface LeaderboardInput extends Omit<LeaderboardData, "guildIcon" | "items"> { guildIcon?: ImageInput; items: LeaderboardItemInput[] }

export interface PresetFrameOptions {
  /** Time in ms (default 350). Ignored when `frame` is set. */
  time?: number;
  /** 0-based frame index (uses the preset's fps). */
  frame?: number;
  /** Template variables, e.g. `{ userName: "Alex", guildName: "Legends", userAVTurl: "https://…" }`. */
  variables?: Record<string, string>;
}
export interface PresetAnimationOptions {
  format?: "gif" | "webp";
  fps?: number;
  duration?: number;
  loop?: number;
  variables?: Record<string, string>;
}

const RESERVED_VARIABLES = new Set(["preset", "time", "frameTime", "frame", "frameIndex", "format", "fps", "duration", "loop"]);

function invalid(message: string, details?: unknown): ImageStudioError {
  return new ImageStudioError("INVALID_REQUEST", message, { details });
}

function checkVariables(variables: Record<string, string> | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(variables ?? {})) {
    if (RESERVED_VARIABLES.has(k)) throw invalid(`Template variable "${k}" is reserved. Reserved: ${[...RESERVED_VARIABLES].join(", ")}.`, { field: k });
    out[k] = String(v);
  }
  return out;
}

function assertPreset(preset: string): void {
  if (!(BUILTIN_PRESET_IDS as readonly string[]).includes(preset)) {
    throw invalid(`Unknown preset "${preset}". Available: ${BUILTIN_PRESET_IDS.join(", ")}.`, { field: "preset", available: BUILTIN_PRESET_IDS });
  }
}

/** Mirrors the server's animation limits so obviously invalid requests never leave the process. */
export function assertAnimationLimits(data: AnimatedData, limits: { maxFrames: number; maxDurationMs: number; maxLoop: number } = DEFAULT_LIMITS): void {
  const format = data.format ?? "gif";
  if (format === "png" || data.frameIndex !== undefined || data.frameTime !== undefined) return;

  if (data.loop !== undefined && (!Number.isInteger(data.loop) || data.loop < 0 || data.loop > limits.maxLoop)) {
    throw invalid(`"loop" must be an integer between 0 and ${limits.maxLoop}.`, { field: "loop" });
  }
  if (data.frames?.length) {
    if (data.frames.length > limits.maxFrames) throw invalid(`Animations support at most ${limits.maxFrames} frames (got ${data.frames.length}).`, { field: "frames" });
    const delays = Array.isArray(data.delay) ? data.delay : data.frames.map(() => (typeof data.delay === "number" ? data.delay : 120));
    const total = delays.reduce((a, b) => a + b, 0);
    if (total > limits.maxDurationMs) throw invalid(`Animation duration cannot exceed ${limits.maxDurationMs} ms (got ${total} ms).`, { field: "delay" });
    return;
  }
  if (data.canvas && data.duration !== undefined && data.fps !== undefined) {
    if (data.duration > limits.maxDurationMs) throw invalid(`"duration" cannot exceed ${limits.maxDurationMs} ms.`, { field: "duration" });
    const frames = Math.ceil((data.duration / 1000) * data.fps);
    if (frames > limits.maxFrames) {
      throw invalid(`duration × fps produces ${frames} frames, the limit is ${limits.maxFrames}. Lower "fps" or "duration".`, { field: "fps" });
    }
  }
}

export class ImageStudio {
  readonly baseUrls: string[];
  private readonly transport: Transport;
  private statsCache?: Promise<ServerStats>;

  constructor(options: ImageStudioOptions = {}) {
    const env = (globalThis as any).process?.env?.IMAGE_STUDIO_URL as string | undefined;
    const defaultsURL = ["https://image-studio-green.vercel.app","https://image--studios.vercel.app"]
    const raw = options.baseUrl ?? env ?? defaultsURL;
    const baseUrls = (Array.isArray(raw) ? raw : raw ? [raw] : []).map((u) => u.trim().replace(/\/+$/, "")).filter(Boolean);
    if (!baseUrls.length) throw new ImageStudioError("INVALID_REQUEST", "ImageStudio needs a `baseUrl` (or the IMAGE_STUDIO_URL environment variable).");
    for (const u of baseUrls) if (!/^https?:\/\//i.test(u)) throw new ImageStudioError("INVALID_REQUEST", `Invalid baseUrl "${u}": it must start with http:// or https://`);

    const fetchImpl = options.fetch ?? (globalThis.fetch ? globalThis.fetch.bind(globalThis) : undefined);
    if (!fetchImpl) throw new ImageStudioError("INVALID_REQUEST", "No global fetch available: pass `fetch` in the options (Node 18+ has one built in).");

    this.baseUrls = baseUrls;
    this.transport = new Transport({
      baseUrls,
      fetch: fetchImpl,
      headers: options.headers ?? {},
      timeoutMs: options.timeoutMs ?? 30_000,
      retries: options.retries ?? 2,
      retryDelayMs: options.retryDelayMs ?? 300,
      onRetry: options.onRetry,
      onFailover: options.onFailover,
    });
  }

  /* ------------------------------------------------------------------ rendering */

  /** Low level: `POST /api/generate` with any wire request. */
  async generate(request: GenerateRequest, call: CallOptions = {}): Promise<GeneratedImage> {
    if (request.type === "animated") assertAnimationLimits(request.data);
    return this.image({ method: "POST", path: "/api/generate", json: request, accept: "image/png,image/gif,image/webp" }, call);
  }

  async song(input: SongInput, call?: CallOptions): Promise<GeneratedImage> {
    const items: SongResult[] = await Promise.all(
      input.items.map(async (item, i) => ({ ...item, index: item.index ?? i + 1, avatar: await toImageSource(item.avatar) }))
    );
    return this.generate({ type: "song", title: input.title, items, layout: input.layout, particleConfig: input.particleConfig }, call);
  }

  async profile(input: ProfileInput, call?: CallOptions): Promise<GeneratedImage> {
    return this.generate({ type: "profile", data: { ...input, avatar: await toImageSource(input.avatar) } }, call);
  }

  async quote(input: QuoteInput, call?: CallOptions): Promise<GeneratedImage> {
    return this.generate({ type: "quote", data: { ...input, avatar: await toImageSource(input.avatar) } }, call);
  }

  async leaderboard(input: LeaderboardInput, call?: CallOptions): Promise<GeneratedImage> {
    const [guildIcon, items] = await Promise.all([
      toImageSource(input.guildIcon),
      Promise.all(input.items.map(async (item) => ({ ...item, avatar: await toImageSource(item.avatar) }))),
    ]);
    return this.generate({ type: "leaderboard", data: { ...input, guildIcon, items } }, call);
  }

  /** Free-form canvas → PNG. */
  async custom(canvas: CustomCanvasData, call?: CallOptions): Promise<GeneratedImage> {
    return this.generate({ type: "custom", data: canvas }, call);
  }

  /** Full animation (compact timeline `canvas` + `tracks`, or baked `frames`) → GIF (default) or WebP. */
  async animate(data: AnimatedData, call?: CallOptions): Promise<GeneratedImage> {
    const format = data.format ?? "gif";
    if (format === "png") throw invalid('Use `frame()` to render a single PNG frame; `animate()` produces "gif" or "webp".', { field: "format" });
    return this.generate({ type: "animated", data: { ...data, format } }, call);
  }

  /** One PNG frame of a custom timeline (`POST /api/animation/frame`). */
  async frame(data: AnimatedData, at: { time?: number; index?: number } = {}, call: CallOptions = {}): Promise<GeneratedImage> {
    const payload: AnimatedData = { ...data, format: "png" };
    if (at.time !== undefined) payload.frameTime = at.time;
    if (at.index !== undefined) payload.frameIndex = at.index;
    return this.image({ method: "POST", path: "/api/animation/frame", json: { type: "animated", data: payload }, accept: "image/png" }, call);
  }

  /** One PNG frame of a built-in preset (`GET /api/animation/frame`). */
  async presetFrame(preset: PresetId, options: PresetFrameOptions = {}, call: CallOptions = {}): Promise<GeneratedImage> {
    assertPreset(preset);
    return this.image(
      {
        method: "GET",
        path: "/api/animation/frame",
        query: { preset, time: options.frame === undefined ? options.time : undefined, frame: options.frame, ...checkVariables(options.variables) },
        accept: "image/png",
      },
      call
    );
  }

  /** A whole built-in preset as GIF/WebP (`GET /api/animation/frame?format=gif`). */
  async presetAnimation(preset: PresetId, options: PresetAnimationOptions = {}, call: CallOptions = {}): Promise<GeneratedImage> {
    assertPreset(preset);
    const format = options.format ?? "gif";
    return this.image(
      {
        method: "GET",
        path: "/api/animation/frame",
        query: { preset, format, fps: options.fps, duration: options.duration, loop: options.loop, ...checkVariables(options.variables) },
        accept: format === "webp" ? "image/webp" : "image/gif",
      },
      call
    );
  }

  /* --------------------------------------------------------------------- server */

  /** `GET /api/stats`: counter + capabilities (runtime, formats, limits, presets). */
  async stats(call: CallOptions = {}): Promise<ServerStats> {
    return this.transport.execute({ method: "GET", path: "/api/stats", accept: "application/json" }, call, async (res) => {
      try {
        return (await res.json()) as ServerStats;
      } catch (cause) {
        throw new ImageStudioError("BAD_RESPONSE", "The server did not return valid JSON for /api/stats.", { cause });
      }
    });
  }

  /** Cached `stats()` (capabilities rarely change). Failures are not cached. */
  capabilities(call?: CallOptions): Promise<ServerStats> {
    if (!this.statsCache) {
      this.statsCache = this.stats(call).catch((error) => {
        this.statsCache = undefined;
        throw error;
      });
    }
    return this.statsCache;
  }

  /* ------------------------------------------------------------------- internals */

  private image(spec: Parameters<Transport["execute"]>[0], call: CallOptions): Promise<GeneratedImage> {
    return this.transport.execute(spec, call, async (res, baseUrl) => {
      const mime = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
      if (!mime.startsWith("image/")) {
        throw new ImageStudioError("BAD_RESPONSE", `Expected an image but the server returned "${mime || "no content-type"}".`, { status: res.status, url: baseUrl });
      }
      const bytes = new Uint8Array(await res.arrayBuffer());
      if (!bytes.byteLength) throw new ImageStudioError("BAD_RESPONSE", "The server returned an empty image.", { status: res.status, url: baseUrl });

      const size = readImageSize(bytes);
      const num = (name: string) => {
        const raw = res.headers.get(name);
        const n = raw === null ? NaN : Number(raw);
        return Number.isFinite(n) ? n : undefined;
      };
      return new GeneratedImage(bytes, {
        mime,
        width: num("x-image-width") || size?.width || 0,
        height: num("x-image-height") || size?.height || 0,
        filename: parseContentDispositionFilename(res.headers.get("content-disposition")) ?? `image.${mime.split("/")[1] ?? "bin"}`,
        totalGenerated: num("x-total-generated"),
        renderMs: num("x-render-ms"),
        runtime: res.headers.get("x-render-runtime") ?? undefined,
        baseUrl,
      });
    });
  }
}

export function createClient(options?: ImageStudioOptions): ImageStudio {
  return new ImageStudio(options);
}
