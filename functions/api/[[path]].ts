export interface EventContext<Env, P extends string, Data> {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Env;
  params: Record<P, string | string[]>;
  data: Data;
}

export type PagesFunction<Env = unknown, Params extends string = any, Data = unknown> = (
  context: EventContext<Env, Params, Data>
) => Response | Promise<Response>;

interface Env {
  BACKEND_API_URL?: string;
  VITE_API_URL?: string;
  [key: string]: unknown;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  const targetHost = env.BACKEND_API_URL || env.VITE_API_URL;

  // If a backend server URL is configured, proxy the request to that backend
  if (targetHost && typeof targetHost === "string" && targetHost.trim().length > 0) {
    const cleanHost = targetHost.trim().replace(/\/+$/, "");
    const targetUrl = new URL(`${cleanHost}${url.pathname}${url.search}`);

    const forwardHeaders = new Headers(request.headers);
    forwardHeaders.set("X-Forwarded-Host", url.host);
    forwardHeaders.set("X-Forwarded-Proto", url.protocol.replace(":", ""));

    const init: RequestInit = {
      method: request.method,
      headers: forwardHeaders,
      redirect: "follow",
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = request.body;
      // @ts-expect-error duplex required for streaming body in fetch
      init.duplex = "half";
    }

    try {
      return await fetch(targetUrl.toString(), init);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return new Response(
        JSON.stringify({
          error: `Failed to proxy request to backend: ${errorMessage}`,
          targetUrl: targetUrl.toString(),
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // Fallback for /api/stats when backend is not attached
  if (url.pathname === "/api/stats") {
    return new Response(JSON.stringify({ totalGenerated: 0, lastGeneratedAt: null }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }

  // Fallback for generation endpoints when Sharp backend is not yet attached
  return new Response(
    JSON.stringify({
      error:
        "Cloudflare Pages runs in a V8 edge isolate without native Node.js Sharp support. To enable image generation on Cloudflare Pages, set the BACKEND_API_URL environment variable in your Cloudflare Pages dashboard pointing to your Vercel or Netlify or Node.js deployment, or configure public/_redirects.",
      platform: "cloudflare-pages",
      recommendation:
        "Deploy backend to Vercel/Netlify/VPS, then add environment variable: BACKEND_API_URL=https://your-api.vercel.app in Cloudflare Pages Settings.",
    }),
    {
      status: 503,
      headers: { "Content-Type": "application/json" },
    }
  );
};
