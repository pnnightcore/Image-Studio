import type { Handler } from "@netlify/functions";
import { getStats } from "../../src/server/stats.js";
import { CORS_HEADERS, describeServer } from "../../src/server/contract.js";

export const handler: Handler = async () => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
    body: JSON.stringify({ ...getStats(), ...describeServer("node") }),
  };
};
