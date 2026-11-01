import type { Handler, HandlerResponse } from "@netlify/functions";
import "../../src/lib/runtime-node.js";
import { incrementGeneratedCount } from "../../src/server/stats.js";
import { ApiError, CORS_HEADERS, buildFrameRequest, errorToPayload, imageHeaders, parseJsonText, renderRequest } from "../../src/server/contract.js";

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS_HEADERS, body: "" };

  try {
    let rawBody: unknown;
    if (event.httpMethod === "POST") {
      const text = event.isBase64Encoded && event.body ? Buffer.from(event.body, "base64").toString("utf-8") : event.body;
      rawBody = text ? parseJsonText(text) : {};
    }
    const body = buildFrameRequest(event.httpMethod, event.queryStringParameters as Record<string, string | undefined> | undefined, rawBody);

    const result = await renderRequest(body);
    return {
      statusCode: 200,
      headers: imageHeaders(result, incrementGeneratedCount()),
      body: result.buffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    if (!(error instanceof ApiError)) console.error("[netlify/frame] Generation error:", error);
    const { status, body } = errorToPayload(error);
    return {
      statusCode: status,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS, ...(status === 405 ? { Allow: "GET, POST, OPTIONS" } : {}) },
      body: JSON.stringify(body),
    };
  }
};
