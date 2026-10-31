export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Dynamic routing for /api/* requests
    if (url.pathname.startsWith("/api/")) {
      const backendUrl = env.BACKEND_API_URL || env.VITE_API_URL;

      // If backend URL is configured, forward all methods (GET, POST, OPTIONS) seamlessly
      if (backendUrl && typeof backendUrl === "string" && backendUrl.trim().length > 0) {
        const cleanHost = backendUrl.trim().replace(/\/+$/, "");
        const targetUrl = new URL(`${cleanHost}${url.pathname}${url.search}`);

        const forwardHeaders = new Headers(request.headers);
        forwardHeaders.set("X-Forwarded-Host", url.host);
        forwardHeaders.set("X-Forwarded-Proto", url.protocol.replace(":", ""));

        const init = {
          method: request.method,
          headers: forwardHeaders,
          redirect: "follow",
        };

        if (request.method !== "GET" && request.method !== "HEAD") {
          init.body = request.body;
          // @ts-expect-error duplex required for streaming body
          init.duplex = "half";
        }

        try {
          return await fetch(targetUrl.toString(), init);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return new Response(
            JSON.stringify({
              error: `Failed to proxy request to backend: ${msg}`,
              targetUrl: targetUrl.toString(),
            }),
            {
              status: 502,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      }

      // Handle /api/stats fallback when backend is not yet attached
      if (url.pathname === "/api/stats") {
        return new Response(JSON.stringify({ totalGenerated: 0, lastGeneratedAt: null }), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
      }

      // If generation endpoint requested but backend not yet configured
      return new Response(
        JSON.stringify({
          error:
            "Cloudflare Workers/Pages runs in V8 edge isolates without native Node.js Sharp support. To enable image generation, set the BACKEND_API_URL environment variable in your Cloudflare dashboard (e.g. BACKEND_API_URL=https://image-studio-green.vercel.app) to proxy API requests to your Vercel or Netlify backend.",
          platform: "cloudflare-workers",
          recommendation:
            "Go to Cloudflare Dashboard > Workers & Pages > image-studio > Settings > Variables and add BACKEND_API_URL=https://image-studio-green.vercel.app",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Serve static assets for frontend and client-side SPA routing
    if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not Found", { status: 404 });
  },
};
