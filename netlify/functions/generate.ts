import type { Handler, HandlerResponse } from "@netlify/functions";
import "../../src/lib/runtime-node.js";
import type { AnyGenerateRequest } from "../../src/lib/types.js";
import { dispatchGenerate } from "../../src/lib/animated-generator.js";
import { incrementGeneratedCount } from "../../src/server/stats.js";

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  if (event.httpMethod !== "POST") {
    const errorHeaders: Record<string, string> = {
      Allow: "POST",
      "Content-Type": "application/json",
    };
    return {
      statusCode: 405,
      headers: errorHeaders,
      body: JSON.stringify({ error: "Method Not Allowed. Use POST." }),
    };
  }

  try {
    if (!event.body) {
      const errHeaders: Record<string, string> = { "Content-Type": "application/json" };
      return {
        statusCode: 400,
        headers: errHeaders,
        body: JSON.stringify({ error: "Invalid payload: request body is required." }),
      };
    }

    const body: AnyGenerateRequest = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    // Support extracting single PNG frame from animation via query or body
    if (body.type === "animated" && body.data) {
      const qFrame = event.queryStringParameters?.frame ?? event.queryStringParameters?.frameIndex;
      const qTime = event.queryStringParameters?.time ?? event.queryStringParameters?.frameTime;
      const qFormat = event.queryStringParameters?.format;

      if (qFrame !== undefined) {
        body.data.frameIndex = parseInt(qFrame as string, 10);
        body.data.format = "png";
      }
      if (qTime !== undefined) {
        body.data.frameTime = parseFloat(qTime as string);
        body.data.format = "png";
      }
      if (qFormat === "png") {
        body.data.format = "png";
      }
    }

    const { buffer, height, mime, filename } = await dispatchGenerate(body);
    const totalCount = incrementGeneratedCount();

    const successHeaders: Record<string, string> = {
      "Content-Type": mime,
      "Content-Length": buffer.length.toString(),
      "X-Image-Height": height.toString(),
      "X-Total-Generated": totalCount.toString(),
      "Access-Control-Expose-Headers": "X-Total-Generated, X-Image-Height",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
    };

    return {
      statusCode: 200,
      headers: successHeaders,
      body: buffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("[netlify/generate] Generation error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    const failHeaders: Record<string, string> = { "Content-Type": "application/json" };
    return {
      statusCode: 500,
      headers: failHeaders,
      body: JSON.stringify({ error: message }),
    };
  }
};
