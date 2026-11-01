import type { VercelRequest, VercelResponse } from "@vercel/node";
import "../../src/lib/runtime-node.js";
import { incrementGeneratedCount } from "../../src/server/stats.js";
import { ApiError, CORS_HEADERS, buildFrameRequest, errorToPayload, imageHeaders, renderRequest } from "../../src/server/contract.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    if (req.method !== "GET" && req.method !== "POST") res.setHeader("Allow", "GET, POST, OPTIONS");
    const body = buildFrameRequest(req.method || "GET", req.query, req.body);

    const result = await renderRequest(body);
    const headers = imageHeaders(result, incrementGeneratedCount());
    for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
    return res.status(200).send(result.buffer);
  } catch (error) {
    if (!(error instanceof ApiError)) console.error("[api/animation/frame] Generation error:", error);
    const { status, body } = errorToPayload(error);
    return res.status(status).json(body);
  }
}
