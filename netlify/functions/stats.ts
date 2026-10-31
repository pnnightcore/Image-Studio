import type { Handler } from "@netlify/functions";
import { getStats } from "../../src/server/stats.js";

export const handler: Handler = async () => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
    body: JSON.stringify(getStats()),
  };
};
