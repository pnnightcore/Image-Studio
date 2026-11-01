import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getStats } from "../src/server/stats.js";
import { CORS_HEADERS, describeServer } from "../src/server/contract.js";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  return res.status(200).json({ ...getStats(), ...describeServer("node") });
}
