/**
 * Platform-neutral (Fetch API) implementation of the public HTTP API, used by the Cloudflare Worker.
 * Mirrors api/*.ts (Vercel), netlify/functions/*.ts and server.ts through `src/server/contract.ts`.
 *
 *   POST /api/generate
 *   GET|POST /api/animation/frame  (alias: /api/animated/frame)
 *   GET /api/stats
 */
import {
  ApiError,
  CORS_HEADERS,
  applyAnimatedQuery,
  buildFrameRequest,
  describeServer,
  errorToPayload,
  imageHeaders,
  parseJsonText,
  renderRequest,
  validateGenerateRequest,
  type RenderOutcome,
} from "./contract.js";

/* In-memory stats: per isolate (resets on cold start / redeploy). */
const stats = { totalGenerated: 0, lastGeneratedAt: null as string | null };

function json(data: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS, ...extra },
  });
}

function imageResponse(result: RenderOutcome): Response {
  stats.totalGenerated += 1;
  stats.lastGeneratedAt = new Date().toISOString();
  const { buffer } = result;
  const payload = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) as unknown as BodyInit;
  return new Response(payload, { status: 200, headers: imageHeaders(result, stats.totalGenerated) });
}

async function handleGenerate(request: Request, url: URL): Promise<Response> {
  if (request.method !== "POST") throw new ApiError(405, "METHOD_NOT_ALLOWED", "Method Not Allowed. Use POST.");
  const body = parseJsonText(await request.text());
  validateGenerateRequest(body);
  applyAnimatedQuery(body, url.searchParams);
  return imageResponse(await renderRequest(body));
}

async function handleFrame(request: Request, url: URL): Promise<Response> {
  let rawBody: unknown;
  if (request.method === "POST") {
    const text = await request.text();
    rawBody = text ? parseJsonText(text) : {};
  }
  const body = buildFrameRequest(request.method, url.searchParams, rawBody);
  return imageResponse(await renderRequest(body));
}

/** Handles any `/api/*` request. */
export async function handleApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { ...CORS_HEADERS, "Access-Control-Max-Age": "86400" } });
  }

  try {
    if (path === "/api/stats") return json({ ...stats, ...describeServer("cloudflare") }, 200, { "Cache-Control": "no-cache, no-store, must-revalidate" });
    if (path === "/api/generate") return await handleGenerate(request, url);
    if (path === "/api/animation/frame" || path === "/api/animated/frame") return await handleFrame(request, url);
    throw new ApiError(404, "NOT_FOUND", `Not found: ${path}`);
  } catch (error) {
    if (!(error instanceof ApiError)) console.error("[worker/api] Generation error:", error);
    const { status, body } = errorToPayload(error);
    const allow: Record<string, string> = status === 405 ? { Allow: path === "/api/generate" ? "POST, OPTIONS" : "GET, POST, OPTIONS" } : {};
    return json(body, status, allow);
  }
}
