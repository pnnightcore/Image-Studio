import type { Handler, HandlerResponse } from "@netlify/functions";
import "../../src/lib/runtime-node.js";
import type { AnyGenerateRequest } from "../../src/lib/types.js";
import { dispatchGenerate } from "../../src/lib/animated-generator.js";
import { incrementGeneratedCount } from "../../src/server/stats.js";
import { PRESETS, getPresetById, DEFAULT_TEMPLATE_VARIABLES } from "../../src/lib/animation-presets.js";

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  try {
    let body: AnyGenerateRequest;

    if (event.httpMethod === "GET") {
      const q = event.queryStringParameters || {};
      const presetId = q.preset || "welcome";
      const preset = getPresetById(presetId) || PRESETS[0];
      const time = q.time
        ? parseFloat(q.time)
        : q.frameTime
        ? parseFloat(q.frameTime)
        : 350;
      const frameIndex = q.frame !== undefined
        ? parseInt(q.frame, 10)
        : q.frameIndex !== undefined
        ? parseInt(q.frameIndex, 10)
        : undefined;

      const templateVariables: Record<string, string> = {
        ...DEFAULT_TEMPLATE_VARIABLES,
      };
      for (const [k, v] of Object.entries(q)) {
        if (typeof v === "string" && k !== "preset" && k !== "time" && k !== "frameTime" && k !== "frame" && k !== "frameIndex") {
          templateVariables[k] = v;
        }
      }

      body = {
        type: "animated",
        data: {
          title: preset.canvas.title,
          format: "png",
          frameTime: frameIndex !== undefined ? undefined : time,
          frameIndex,
          canvas: preset.canvas,
          tracks: preset.tracks,
          templateVariables,
        },
      };
    } else if (event.httpMethod === "POST") {
      const q = event.queryStringParameters || {};
      const reqBody = event.body ? JSON.parse(event.body) : {};
      let animData: any = reqBody.type === "animated" && reqBody.data ? reqBody.data : reqBody;

      const qFrame = q.frame ?? q.frameIndex;
      const qTime = q.time ?? q.frameTime;

      let frameTime = animData.frameTime ?? (qTime !== undefined ? parseFloat(qTime as string) : undefined);
      let frameIndex = animData.frameIndex ?? (qFrame !== undefined ? parseInt(qFrame as string, 10) : undefined);

      if (frameTime === undefined && frameIndex === undefined) {
        frameTime = 0;
      }

      body = {
        type: "animated",
        data: {
          ...animData,
          format: "png",
          frameTime,
          frameIndex,
        },
      };
    } else {
      const notAllowedHeaders: Record<string, string> = {
        Allow: "GET, POST",
        "Content-Type": "application/json",
      };
      return {
        statusCode: 405,
        headers: notAllowedHeaders,
        body: JSON.stringify({ error: "Method Not Allowed. Use GET or POST." }),
      };
    }

    const { buffer, height, mime, filename } = await dispatchGenerate(body);
    const totalCount = incrementGeneratedCount();

    const okHeaders: Record<string, string> = {
      "Content-Type": mime,
      "Content-Length": buffer.length.toString(),
      "X-Image-Height": height.toString(),
      "X-Total-Generated": totalCount.toString(),
      "Access-Control-Expose-Headers": "X-Total-Generated, X-Image-Height",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
    };

    return {
      statusCode: 200,
      headers: okHeaders,
      body: buffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("[netlify/frame] Generation error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    const failHeaders: Record<string, string> = { "Content-Type": "application/json" };
    return {
      statusCode: 500,
      headers: failHeaders,
      body: JSON.stringify({ error: message }),
    };
  }
};
