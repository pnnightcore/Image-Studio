/**
 * Platform-neutral (Fetch API) implementation of the public HTTP API.
 * Used by the Cloudflare Worker; mirrors api/*.ts (Vercel) and netlify/functions/*.ts.
 *
 *   POST /api/generate
 *   GET|POST /api/animation/frame  (alias: /api/animated/frame)
 *   GET /api/stats
 */
import type { AnyGenerateRequest } from "../lib/types.js";
import { dispatchGenerate } from "../lib/animated-generator.js";
import { PRESETS, getPresetById, DEFAULT_TEMPLATE_VARIABLES } from "../lib/animation-presets.js";
import { UnsupportedOnRuntimeError } from "../lib/runtime.js";

/* In-memory stats: per isolate (resets on cold start / redeploy), like the serverless targets. */
const stats = { totalGenerated: 0, lastGeneratedAt: null as string | null };

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Expose-Headers": "X-Total-Generated, X-Image-Height",
};

function json(data: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS, ...extra },
  });
}

class HttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

async function readJsonBody(request: Request): Promise<any> {
  try {
    return await request.json();
  } catch {
    throw new HttpError(400, "Invalid payload: request body must be valid JSON.");
  }
}

async function imageResponse(body: AnyGenerateRequest): Promise<Response> {
  const { buffer, height, mime, filename } = await dispatchGenerate(body);
  stats.totalGenerated += 1;
  stats.lastGeneratedAt = new Date().toISOString();

  const payload = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) as unknown as BodyInit;

  return new Response(payload, {
    status: 200,
    headers: {
      "Content-Type": mime,
      "Content-Length": buffer.length.toString(),
      "X-Image-Height": height.toString(),
      "X-Total-Generated": stats.totalGenerated.toString(),
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
      ...CORS_HEADERS,
    },
  });
}

async function handleGenerate(request: Request, url: URL): Promise<Response> {
  if (request.method !== "POST") {
    return json({ error: "Method Not Allowed. Use POST." }, 405, { Allow: "POST" });
  }

  const body = (await readJsonBody(request)) as AnyGenerateRequest;
  if (!body) throw new HttpError(400, "Invalid payload: request body is required.");

  // Single PNG frame of an animation via query string
  if ((body as any).type === "animated" && (body as any).data) {
    const data = (body as any).data;
    const q = url.searchParams;
    const qFrame = q.get("frame") ?? q.get("frameIndex");
    const qTime = q.get("time") ?? q.get("frameTime");
    if (qFrame !== null) {
      data.frameIndex = parseInt(qFrame, 10);
      data.format = "png";
    }
    if (qTime !== null) {
      data.frameTime = parseFloat(qTime);
      data.format = "png";
    }
    if (q.get("format") === "png") data.format = "png";
  }

  return imageResponse(body);
}

async function handleFrame(request: Request, url: URL): Promise<Response> {
  const q = url.searchParams;
  let body: AnyGenerateRequest;

  if (request.method === "GET") {
    const preset = getPresetById(q.get("preset") || "welcome") || PRESETS[0];
    const time = q.get("time") ? parseFloat(q.get("time")!) : q.get("frameTime") ? parseFloat(q.get("frameTime")!) : 350;
    const frameParam = q.get("frame") ?? q.get("frameIndex");
    const frameIndex = frameParam !== null ? parseInt(frameParam, 10) : undefined;

    const templateVariables: Record<string, string> = { ...DEFAULT_TEMPLATE_VARIABLES };
    const reserved = new Set(["preset", "time", "frameTime", "frame", "frameIndex"]);
    for (const [k, v] of q.entries()) if (!reserved.has(k)) templateVariables[k] = v;

    body = {
      type: "animated",
      data: {
        title: preset.canvas.title,
        format: "png",
        frameTime: frameIndex !== undefined ? undefined : time,
        frameIndex,
        canvas: preset.canvas,
        tracks: preset.tracks,
        templateVariables,
      },
    };
  } else if (request.method === "POST") {
    const reqBody = (await request.json().catch(() => ({}))) || {};
    const animData: any = reqBody.type === "animated" && reqBody.data ? reqBody.data : reqBody;

    const qFrame = q.get("frame") ?? q.get("frameIndex");
    const qTime = q.get("time") ?? q.get("frameTime");

    let frameTime = animData.frameTime ?? (qTime !== null ? parseFloat(qTime) : undefined);
    const frameIndex = animData.frameIndex ?? (qFrame !== null ? parseInt(qFrame, 10) : undefined);
    if (frameTime === undefined && frameIndex === undefined) frameTime = 0;

    body = { type: "animated", data: { ...animData, format: "png", frameTime, frameIndex } };
  } else {
    return json({ error: "Method Not Allowed. Use GET or POST." }, 405, { Allow: "GET, POST" });
  }

  return imageResponse(body);
}

/** Handles any `/api/*` request. */
export async function handleApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { ...CORS_HEADERS, "Access-Control-Max-Age": "86400" } });
  }

  try {
    if (path === "/api/stats") {
      return json({ ...stats }, 200, { "Cache-Control": "no-cache, no-store, must-revalidate" });
    }
    if (path === "/api/generate") return await handleGenerate(request, url);
    if (path === "/api/animation/frame" || path === "/api/animated/frame") return await handleFrame(request, url);
    return json({ error: `Not found: ${path}` }, 404);
  } catch (error) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status);
    if (error instanceof UnsupportedOnRuntimeError) return json({ error: error.message }, error.statusCode);
    console.error("[worker/api] Generation error:", error);
    return json({ error: error instanceof Error ? error.message : "Internal Server Error" }, 500);
  }
}
