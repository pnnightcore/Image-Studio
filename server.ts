import express from "express";
import "./src/lib/runtime-node";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { getStats, incrementGeneratedCount } from "./src/server/stats";
import {
  ApiError,
  CORS_HEADERS,
  describeServer,
  applyAnimatedQuery,
  buildFrameRequest,
  errorToPayload,
  imageHeaders,
  renderRequest,
  validateGenerateRequest,
} from "./src/server/contract";
import { savePatternToSdkPackage } from "./src/server/pattern-storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: "15mb" }));

  // Stats Route
  app.get("/api/stats", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
    return res.status(200).json({ ...getStats(), ...describeServer("node") });
  });

  // Shared contract (validation, errors, headers): src/server/contract.ts
  app.options("/api/*", (_req, res) => {
    for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
    res.status(204).end();
  });

  const sendImage = (res: express.Response, result: Awaited<ReturnType<typeof renderRequest>>) => {
    for (const [k, v] of Object.entries(imageHeaders(result, incrementGeneratedCount()))) res.setHeader(k, v);
    return res.status(200).send(result.buffer);
  };
  const sendError = (res: express.Response, scope: string, error: unknown) => {
    if (!(error instanceof ApiError)) console.error(`[server] ${scope} error:`, error);
    const { status, body } = errorToPayload(error);
    for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
    return res.status(status).json(body);
  };

  // API Route for static and animated image generation.
  app.post("/api/generate", async (req, res) => {
    try {
      const body = req.body;
      validateGenerateRequest(body);
      applyAnimatedQuery(body, req.query as Record<string, string | string[] | undefined>);
      return sendImage(res, await renderRequest(body));
    } catch (error) {
      return sendError(res, "Generation", error);
    }
  });
  app.all("/api/generate", (_req, res) => {
    res.setHeader("Allow", "POST, OPTIONS");
    return sendError(res, "Generation", new ApiError(405, "METHOD_NOT_ALLOWED", "Method Not Allowed. Use POST."));
  });

  // Dedicated API endpoint for extracting a single PNG frame from animation (POST or GET)
  app.all(["/api/animation/frame", "/api/animated/frame"], async (req, res) => {
    try {
      const body = buildFrameRequest(req.method, req.query as Record<string, string | string[] | undefined>, req.body);
      return sendImage(res, await renderRequest(body));
    } catch (error) {
      if (error instanceof ApiError && error.status === 405) res.setHeader("Allow", "GET, POST, OPTIONS");
      return sendError(res, "Frame generation", error);
    }
  });

  // Dedicated API endpoint to export pattern straight into packages/image-studio
  app.post(["/api/dev/export-sdk-pattern", "/api/export-pattern"], async (req, res) => {
    try {
      const pattern = req.body?.pattern || req.body;
      if (!pattern || typeof pattern !== "object" || !pattern.id || !pattern.canvas) {
        return sendError(
          res,
          "Pattern export",
          new ApiError(400, "INVALID_REQUEST", "Invalid pattern: 'id' and 'canvas' are required.")
        );
      }
      const result = await savePatternToSdkPackage(pattern, __dirname);
      for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
      return res.status(200).json(result);
    } catch (error) {
      return sendError(res, "Pattern export", error);
    }
  });

  // Malformed JSON bodies etc. -> JSON error instead of Express' HTML page
  app.use("/api", (err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) return next(err);
    const status = typeof err?.status === "number" && err.status >= 400 && err.status < 500 ? err.status : 500;
    return sendError(res, "Request", status === 500 ? err : new ApiError(status, "INVALID_REQUEST", status === 413 ? "Payload too large." : "Invalid payload: request body must be valid JSON."));
  });

  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Image Studio server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
