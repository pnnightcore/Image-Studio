import type { VercelRequest, VercelResponse } from "@vercel/node";
import { CORS_HEADERS, ApiError, errorToPayload } from "../src/server/contract.js";
import { savePatternToSdkPackage, generatePatternTypeScript, generatePatternSdkUsage } from "../src/server/pattern-storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST, OPTIONS");
      throw new ApiError(405, "METHOD_NOT_ALLOWED", "Method Not Allowed. Use POST.");
    }

    const pattern = req.body?.pattern || req.body;
    if (!pattern || typeof pattern !== "object" || !pattern.id || !pattern.canvas) {
      throw new ApiError(400, "INVALID_REQUEST", "Missing or invalid pattern: 'id' and 'canvas' are required.");
    }

    try {
      const result = await savePatternToSdkPackage(pattern);
      return res.status(200).json(result);
    } catch (saveErr: any) {
      // Graceful fallback for serverless read-only filesystems
      const tsCode = generatePatternTypeScript(pattern);
      const sdkUsage = generatePatternSdkUsage(pattern);
      return res.status(200).json({
        success: true,
        savedToFile: false,
        readOnly: true,
        patternId: pattern.id,
        message: "Serverless environment is read-only. File not saved directly to disk, but TypeScript code is ready.",
        tsCode,
        sdkUsage,
      });
    }
  } catch (error) {
    if (!(error instanceof ApiError)) console.error("[api/export-pattern] Error:", error);
    const { status, body } = errorToPayload(error);
    return res.status(status).json(body);
  }
}
