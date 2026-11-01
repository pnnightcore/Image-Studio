/** Invokes the Vercel and Netlify handlers in-process (no network) and checks the shared contract. */
import assert from "node:assert/strict";
import vercelGenerate from "../api/generate.js";
import vercelFrame from "../api/animation/frame.js";
import vercelStats from "../api/stats.js";
import { handler as netlifyGenerate } from "../netlify/functions/generate.js";
import { handler as netlifyFrame } from "../netlify/functions/frame.js";
import { handler as netlifyStats } from "../netlify/functions/stats.js";

function vres() {
  const r: any = { headers: {} as Record<string, string>, statusCode: 200, body: undefined };
  r.setHeader = (k: string, v: string) => ((r.headers[k.toLowerCase()] = v), r);
  r.status = (c: number) => ((r.statusCode = c), r);
  r.json = (b: unknown) => ((r.body = b), r);
  r.send = (b: unknown) => ((r.body = b), r);
  r.end = () => r;
  return r;
}
const call = async (h: any, req: any) => { const res = vres(); await h({ query: {}, ...req }, res); return res; };
const quote = { type: "quote", data: { quote: "hi", author: "a", handle: "@a", tag: "#t", avatar: "" } };

// ---- Vercel
let r = await call(vercelGenerate, { method: "POST", body: quote });
assert.equal(r.statusCode, 200); assert.equal(r.headers["content-type"], "image/png");
assert.ok(Number(r.headers["x-image-width"]) > 0 && r.headers["x-render-runtime"] === "node" && r.headers["access-control-expose-headers"].includes("Content-Disposition"));
r = await call(vercelGenerate, { method: "POST", body: { type: "nope" } });
assert.deepEqual([r.statusCode, r.body.code], [400, "INVALID_REQUEST"]);
r = await call(vercelGenerate, { method: "GET" });
assert.deepEqual([r.statusCode, r.body.code, r.headers.allow], [405, "METHOD_NOT_ALLOWED", "POST, OPTIONS"]);
r = await call(vercelGenerate, { method: "OPTIONS" });
assert.equal(r.statusCode, 204);
r = await call(vercelFrame, { method: "GET", query: { preset: "welcome", time: "350" } });
assert.deepEqual([r.statusCode, r.headers["content-type"]], [200, "image/png"]);
r = await call(vercelFrame, { method: "GET", query: { preset: "welcome", format: "gif", fps: "6", duration: "800" } });
assert.deepEqual([r.statusCode, r.headers["content-type"]], [200, "image/gif"]);
r = await call(vercelFrame, { method: "GET", query: { preset: "zzz" } });
assert.equal(r.statusCode, 400);
r = await call(vercelStats, { method: "GET" });
assert.equal(r.body.runtime, "node");

// ---- Netlify
const ev = (httpMethod: string, extra: any = {}) => ({ httpMethod, headers: {}, queryStringParameters: {}, ...extra });
let n: any = await netlifyGenerate(ev("POST", { body: JSON.stringify(quote) }) as any, {} as any);
assert.equal(n.statusCode, 200); assert.equal(n.isBase64Encoded, true); assert.equal(n.headers["Content-Type"], "image/png");
assert.ok(Buffer.from(n.body, "base64")[0] === 0x89);
n = await netlifyGenerate(ev("POST", { body: "{bad" }) as any, {} as any);
assert.deepEqual([n.statusCode, JSON.parse(n.body).code], [400, "INVALID_REQUEST"]);
n = await netlifyGenerate(ev("POST", { body: Buffer.from(JSON.stringify(quote)).toString("base64"), isBase64Encoded: true }) as any, {} as any);
assert.equal(n.statusCode, 200);
n = await netlifyGenerate(ev("GET") as any, {} as any);
assert.deepEqual([n.statusCode, JSON.parse(n.body).code], [405, "METHOD_NOT_ALLOWED"]);
n = await netlifyFrame(ev("GET", { queryStringParameters: { preset: "welcome", time: "350" } }) as any, {} as any);
assert.equal(n.statusCode, 200);
n = await netlifyFrame(ev("GET", { queryStringParameters: { preset: "zzz" } }) as any, {} as any);
assert.equal(n.statusCode, 400);
n = await netlifyStats(ev("GET") as any, {} as any);
assert.equal(JSON.parse(n.body).runtime, "node");

console.log("Vercel + Netlify handlers: OK");
