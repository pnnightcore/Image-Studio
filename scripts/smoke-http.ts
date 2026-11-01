/**
 * HTTP smoke test against a running deployment / `wrangler dev`.
 *   npx tsx scripts/smoke-http.ts http://127.0.0.1:8787 [outDir]
 */
import fs from "node:fs";
import { smokeCases } from "./smoke-cases.js";

const base = (process.argv[2] || "http://127.0.0.1:8787").replace(/\/+$/, "");
const outDir = process.argv[3] || "/tmp/out-http";
fs.mkdirSync(outDir, { recursive: true });

let failed = 0;
for (const c of smokeCases) {
  const t = Date.now();
  const res = await fetch(`${base}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(c.body),
    signal: AbortSignal.timeout(45000),
  });
  const buf = Buffer.from(await res.arrayBuffer());
  if (!res.ok) {
    failed++;
    console.log(`FAIL ${c.name.padEnd(16)} HTTP ${res.status} ${buf.toString().slice(0, 300)}`);
    continue;
  }
  fs.writeFileSync(`${outDir}/${c.name}.${c.ext}`, buf);
  console.log(`OK   ${c.name.padEnd(16)} ${res.headers.get("content-type")} ${buf.length}B ${Date.now() - t}ms total=${res.headers.get("x-total-generated")}`);
}

const frame = await fetch(`${base}/api/animation/frame?preset=welcome&time=350`);
console.log(`${frame.ok ? "OK  " : "FAIL"} frame GET        ${frame.status} ${frame.headers.get("content-type")} ${(await frame.arrayBuffer()).byteLength}B`);
const stats = await fetch(`${base}/api/stats`);
console.log("stats", await stats.text());
const spa = await fetch(`${base}/profile`);
console.log("SPA /profile", spa.status, spa.headers.get("content-type"));
process.exit(failed ? 1 : 0);
