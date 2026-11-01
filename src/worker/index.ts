/**
 * Cloudflare Worker entry (Workers + static assets / Pages-compatible module worker).
 *
 *   /api/*  -> native image generation (satori + resvg-wasm), see src/server/web-api.ts
 *   others  -> static assets (Vite build output, SPA fallback handled by `assets` config)
 *
 * Optional escape hatch: set API_MODE=proxy and BACKEND_API_URL=https://your-backend
 * to forward /api/* to another deployment (Vercel / Netlify / VPS) instead.
 */
import "./runtime-worker.js";
import { handleApiRequest } from "../server/web-api.js";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  API_MODE?: string;
  BACKEND_API_URL?: string;
}

async function proxyToBackend(request: Request, backendUrl: string): Promise<Response> {
  const url = new URL(request.url);
  const target = new URL(`${backendUrl.trim().replace(/\/+$/, "")}${url.pathname}${url.search}`);
  const headers = new Headers(request.headers);
  headers.set("X-Forwarded-Host", url.host);
  headers.set("X-Forwarded-Proto", url.protocol.replace(":", ""));
  headers.delete("host");

  const init: RequestInit & { duplex?: "half" } = { method: request.method, headers, redirect: "follow" };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    init.duplex = "half";
  }
  try {
    return await fetch(target.toString(), init);
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Failed to proxy request to backend: ${err instanceof Error ? err.message : String(err)}`, targetUrl: target.toString() }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith("/api/")) {
      if (env.API_MODE === "proxy" && env.BACKEND_API_URL?.trim()) {
        return proxyToBackend(request, env.BACKEND_API_URL);
      }
      return handleApiRequest(request);
    }

    if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
      return env.ASSETS.fetch(request);
    }
    return new Response("Not Found", { status: 404 });
  },
};
