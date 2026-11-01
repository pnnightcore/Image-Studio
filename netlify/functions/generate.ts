import type { Handler, HandlerResponse } from "@netlify/functions";
import "../../src/lib/runtime-node.js";
import { incrementGeneratedCount } from "../../src/server/stats.js";
import {
  ApiError,
  CORS_HEADERS,
  applyAnimatedQuery,
  errorToPayload,
  imageHeaders,
  parseJsonText,
  renderRequest,
  validateGenerateRequest,
} from "../../src/server/contract.js";

const jsonHeaders = { "Content-Type": "application/json", ...CORS_HEADERS };

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS_HEADERS, body: "" };

  try {
    if (event.httpMethod !== "POST") throw new ApiError(405, "METHOD_NOT_ALLOWED", "Method Not Allowed. Use POST.");

    const text = event.isBase64Encoded && event.body ? Buffer.from(event.body, "base64").toString("utf-8") : event.body;
    const body = parseJsonText(text);
    validateGenerateRequest(body);
    applyAnimatedQuery(body, event.queryStringParameters as Record<string, string | undefined> | undefined);

    const result = await renderRequest(body);
    return {
      statusCode: 200,
      headers: imageHeaders(result, incrementGeneratedCount()),
      body: result.buffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    if (!(error instanceof ApiError)) console.error("[netlify/generate] Generation error:", error);
    const { status, body } = errorToPayload(error);
    return {
      statusCode: status,
      headers: { ...jsonHeaders, ...(status === 405 ? { Allow: "POST, OPTIONS" } : {}) },
      body: JSON.stringify(body),
    };
  }
};
