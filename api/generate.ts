import type { VercelRequest, VercelResponse } from "@vercel/node";
import "../src/lib/runtime-node.js";
import { incrementGeneratedCount } from "../src/server/stats.js";
import {
  ApiError,
  CORS_HEADERS,
  applyAnimatedQuery,
  errorToPayload,
  imageHeaders,
  renderRequest,
  validateGenerateRequest,
} from "../src/server/contract.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST, OPTIONS");
      throw new ApiError(405, "METHOD_NOT_ALLOWED", "Method Not Allowed. Use POST.");
    }

    const body = req.body;
    validateGenerateRequest(body);
    applyAnimatedQuery(body, req.query);

    const result = await renderRequest(body);
    const headers = imageHeaders(result, incrementGeneratedCount());
    for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
    return res.status(200).send(result.buffer);
  } catch (error) {
    if (!(error instanceof ApiError)) console.error("[api/generate] Generation error:", error);
    const { status, body } = errorToPayload(error);
    return res.status(status).json(body);
  }
}
