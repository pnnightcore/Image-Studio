import { test } from "node:test";
import assert from "node:assert/strict";
import { ImageStudio, ImageStudioError, assertAnimationLimits, toImageSource } from "../src/index.js";

/* ------------------------------------------------------------------ helpers */
function fakePng(width: number, height: number): Uint8Array {
  const b = new Uint8Array(33);
  b.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  const v = new DataView(b.buffer);
  v.setUint32(8, 13);
  b.set([0x49, 0x48, 0x44, 0x52], 12); // IHDR
  v.setUint32(16, width);
  v.setUint32(20, height);
  return b;
}

type Handler = (url: string, init: RequestInit) => Response | Promise<Response>;
function mockFetch(handlers: Handler[]) {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const fetchImpl = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    const handler = handlers[Math.min(calls.length - 1, handlers.length - 1)];
    return handler(url, init);
  }) as unknown as typeof fetch;
  return { fetchImpl, calls };
}

const png = (extra: Record<string, string> = {}, bytes = fakePng(930, 280)) =>
  new Response(bytes as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "X-Image-Width": "930",
      "X-Image-Height": "280",
      "X-Total-Generated": "7",
      "X-Render-Ms": "42",
      "X-Render-Runtime": "node",
      "Content-Disposition": `attachment; filename="${encodeURIComponent("Xin chào.png")}"`,
      ...extra,
    },
  });
const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });
const cf1102 = () =>
  new Response('<!DOCTYPE html><title>Worker exceeded resource limits | x | Cloudflare</title><span class="cf-error-code">1102</span>', {
    status: 503,
    headers: { "Content-Type": "text/html" },
  });

const quote = { quote: "hi", author: "a", handle: "@a", tag: "#t" };

/* -------------------------------------------------------------------- tests */
test("parses image + metadata headers", async () => {
  const { fetchImpl, calls } = mockFetch([() => png()]);
  const studio = new ImageStudio({ baseUrl: "https://api.test/", fetch: fetchImpl });
  const img = await studio.quote(quote);

  assert.equal(calls[0].url, "https://api.test/api/generate");
  assert.equal(calls[0].init.method, "POST");
  const sent = JSON.parse(calls[0].init.body as string);
  assert.equal(sent.type, "quote");
  assert.equal(sent.data.avatar, ""); // optional avatar defaults to ""
  assert.deepEqual([img.mime, img.width, img.height, img.filename], ["image/png", 930, 280, "Xin chào.png"]);
  assert.deepEqual([img.totalGenerated, img.renderMs, img.runtime, img.baseUrl], [7, 42, "node", "https://api.test"]);
  assert.equal(img.toDataURL().startsWith("data:image/png;base64,"), true);
  assert.equal(img.toAttachment().name, "Xin chào.png");
});

test("falls back to reading dimensions from the bytes (older servers)", async () => {
  const { fetchImpl } = mockFetch([() => new Response(fakePng(640, 360) as unknown as BodyInit, { headers: { "Content-Type": "image/png" } })]);
  const img = await new ImageStudio({ baseUrl: "https://api.test", fetch: fetchImpl }).custom({ title: "t", width: 640, height: 360, background: "#000", elements: [] });
  assert.deepEqual([img.width, img.height, img.filename], [640, 360, "image.png"]);
});

test("song(): numbers items automatically and converts bytes to data URIs", async () => {
  const { fetchImpl, calls } = mockFetch([() => png()]);
  const studio = new ImageStudio({ baseUrl: "https://api.test", fetch: fetchImpl });
  await studio.song({
    title: "lofi",
    items: [
      { displayName: "A", time: "3:00", source: "yt", avatar: fakePng(1, 1) },
      { displayName: "B", time: "4:00", source: "sc", avatar: "https://cdn/x.png" },
    ],
  });
  const body = JSON.parse(calls[0].init.body as string);
  assert.deepEqual(body.items.map((i: any) => i.index), [1, 2]);
  assert.match(body.items[0].avatar, /^data:image\/png;base64,/);
  assert.equal(body.items[1].avatar, "https://cdn/x.png");
});

test("400 contract errors are typed and never retried", async () => {
  const { fetchImpl, calls } = mockFetch([() => json(400, { error: 'Unknown type "x".', code: "INVALID_REQUEST", details: { field: "type" } })]);
  const studio = new ImageStudio({ baseUrl: ["https://a.test", "https://b.test"], fetch: fetchImpl, retryDelayMs: 1 });
  await assert.rejects(studio.generate({ type: "nope" } as any), (e: any) => {
    assert.ok(e instanceof ImageStudioError);
    assert.deepEqual([e.code, e.status, e.retryable, e.failoverable, e.details], ["INVALID_REQUEST", 400, false, false, { field: "type" }]);
    return true;
  });
  assert.equal(calls.length, 1); // no retry, no fail-over
});

test("retries transient 503 on the same host, honouring Retry-After", async () => {
  const { fetchImpl, calls } = mockFetch([() => json(503, { error: "busy", code: "RENDER_FAILED" }, { "Retry-After": "0" }), () => png()]);
  const retries: number[] = [];
  const studio = new ImageStudio({ baseUrl: "https://api.test", fetch: fetchImpl, retryDelayMs: 1, onRetry: (i) => retries.push(i.attempt) });
  const img = await studio.quote(quote);
  assert.equal(calls.length, 2);
  assert.deepEqual(retries, [1]);
  assert.equal(img.width, 930);
});

test("Cloudflare 1102 → RESOURCE_LIMIT, fail-over to the next host without retrying", async () => {
  const hosts: string[] = [];
  const { fetchImpl } = mockFetch([(url) => (hosts.push(url), url.startsWith("https://cf.test") ? cf1102() : png())]);
  const failovers: string[] = [];
  const studio = new ImageStudio({ baseUrl: ["https://cf.test", "https://vercel.test"], fetch: fetchImpl, onFailover: (i) => failovers.push(`${i.from}→${i.to}:${i.error.code}`) });
  const img = await studio.quote(quote);
  assert.deepEqual(hosts, ["https://cf.test/api/generate", "https://vercel.test/api/generate"]);
  assert.deepEqual(failovers, ["https://cf.test→https://vercel.test:RESOURCE_LIMIT"]);
  assert.equal(img.baseUrl, "https://vercel.test");
});

test("501 UNSUPPORTED (animated WebP on Cloudflare) fails over", async () => {
  const { fetchImpl } = mockFetch([(url) => (url.startsWith("https://cf.test") ? json(501, { error: "no webp", code: "UNSUPPORTED" }) : png({ "Content-Type": "image/webp" }, new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x58])))]);
  const studio = new ImageStudio({ baseUrl: ["https://cf.test", "https://node.test"], fetch: fetchImpl, retries: 0 });
  const img = await studio.animate({ title: "t", format: "webp", canvas: { title: "t", width: 10, height: 10, background: "#000", elements: [] }, tracks: [], duration: 1000, fps: 10 });
  assert.equal(img.mime, "image/webp");
  assert.equal(img.baseUrl, "https://node.test");
});

test("when every host fails, the error lists all attempts", async () => {
  const { fetchImpl } = mockFetch([cf1102]);
  const studio = new ImageStudio({ baseUrl: ["https://a.test", "https://b.test"], fetch: fetchImpl });
  await assert.rejects(studio.quote(quote), (e: any) => {
    assert.equal(e.code, "RESOURCE_LIMIT");
    assert.deepEqual(e.attempts.map((a: any) => a.baseUrl), ["https://a.test", "https://b.test"]);
    return true;
  });
});

test("network errors are retried, then reported", async () => {
  let n = 0;
  const fetchImpl = (async () => {
    n++;
    throw new TypeError("fetch failed");
  }) as unknown as typeof fetch;
  await assert.rejects(new ImageStudio({ baseUrl: "https://api.test", fetch: fetchImpl, retries: 2, retryDelayMs: 1 }).quote(quote), (e: any) => e.code === "NETWORK_ERROR" && e.attempts.length === 3);
  assert.equal(n, 3);
});

test("timeout and abort", async () => {
  const hang = (async (_url: string, init: RequestInit) =>
    new Promise((_, reject) => init.signal!.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError"))))) as unknown as typeof fetch;

  await assert.rejects(new ImageStudio({ baseUrl: "https://api.test", fetch: hang, timeoutMs: 20, retries: 0 }).quote(quote), (e: any) => e.code === "TIMEOUT");

  const controller = new AbortController();
  const p = new ImageStudio({ baseUrl: "https://api.test", fetch: hang, timeoutMs: 5_000 }).quote(quote, { signal: controller.signal });
  setTimeout(() => controller.abort(), 10);
  await assert.rejects(p, (e: any) => e.code === "ABORTED");
});

test("non-image 200 responses are BAD_RESPONSE", async () => {
  const { fetchImpl } = mockFetch([() => new Response("<html>login</html>", { headers: { "Content-Type": "text/html" } })]);
  await assert.rejects(new ImageStudio({ baseUrl: "https://api.test", fetch: fetchImpl, retries: 0 }).quote(quote), (e: any) => e.code === "BAD_RESPONSE");
});

test("client-side limits fail fast (no request sent)", async () => {
  const { fetchImpl, calls } = mockFetch([() => png()]);
  const studio = new ImageStudio({ baseUrl: "https://api.test", fetch: fetchImpl });
  const canvas = { title: "t", width: 10, height: 10, background: "#000", elements: [] };
  await assert.rejects(studio.animate({ title: "t", canvas, tracks: [], duration: 5000, fps: 30 }), /limit is 60/);
  await assert.rejects(studio.animate({ title: "t", canvas, tracks: [], duration: 20_000, fps: 1 }), /cannot exceed 10000/);
  await assert.rejects(studio.animate({ title: "t", format: "png" }), /frame\(\)/);
  assert.equal(calls.length, 0);
  assert.doesNotThrow(() => assertAnimationLimits({ title: "t", canvas, tracks: [], duration: 1500, fps: 12 }));
});

test("presets: GET query, validation, reserved variables", async () => {
  const { fetchImpl, calls } = mockFetch([() => png()]);
  const studio = new ImageStudio({ baseUrl: "https://api.test", fetch: fetchImpl });
  await studio.presetFrame("welcome", { time: 350, variables: { userName: "Alex", guildName: "Legends" } });
  const url = new URL(calls[0].url);
  assert.equal(url.pathname, "/api/animation/frame");
  assert.deepEqual(Object.fromEntries(url.searchParams), { preset: "welcome", time: "350", userName: "Alex", guildName: "Legends" });

  await studio.presetAnimation("music", { format: "gif", fps: 10 });
  assert.deepEqual(Object.fromEntries(new URL(calls[1].url).searchParams), { preset: "music", format: "gif", fps: "10" });

  await assert.rejects(studio.presetFrame("nope" as any), /Unknown preset/);
  await assert.rejects(studio.presetFrame("welcome", { variables: { time: "1" } }), /reserved/);
  assert.equal(calls.length, 2);
});

test("constructor validation + IMAGE_STUDIO_URL fallback", () => {
  assert.throws(() => new ImageStudio({ fetch: (() => {}) as any, baseUrl: "" }), /baseUrl/);
  assert.throws(() => new ImageStudio({ baseUrl: "api.test" }), /http/);
  process.env.IMAGE_STUDIO_URL = "https://env.test";
  assert.deepEqual(new ImageStudio().baseUrls, ["https://env.test"]);
  delete process.env.IMAGE_STUDIO_URL;
});

test("toImageSource", async () => {
  assert.equal(await toImageSource("https://x/y.png"), "https://x/y.png");
  assert.equal(await toImageSource(undefined), "");
  assert.match(await toImageSource(new Blob([fakePng(1, 1) as unknown as BlobPart], { type: "image/png" })), /^data:image\/png;base64,/);
  await assert.rejects(toImageSource(new Uint8Array([1, 2, 3])), /Unrecognised/);
});

test("patterns: animatePattern and framePattern with built-in and custom patterns", async () => {
  const { fetchImpl, calls } = mockFetch([() => png(), () => png()]);
  const studio = new ImageStudio({ baseUrl: "https://api.test", fetch: fetchImpl });

  // 1. animatePattern by ID
  const anim = await studio.animatePattern("welcome", {
    variables: { userName: "Tester" },
    format: "webp",
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].init.method, "POST");
  const animBody = JSON.parse(calls[0].init.body as string);
  assert.equal(animBody.type, "animated");
  assert.equal(animBody.data.format, "webp");
  assert.equal(animBody.data.templateVariables.userName, "Tester");
  assert.equal(anim.width, 930);

  // 2. framePattern by ID
  await studio.framePattern("welcome", { time: 500, variables: { userName: "Tester" } });
  assert.equal(calls.length, 2);
  const frameBody = JSON.parse(calls[1].init.body as string);
  assert.equal(frameBody.data.format, "png");
  assert.equal(frameBody.data.frameTime, 500);

  // 3. invalid pattern ID throws ImageStudioError
  await assert.rejects(studio.animatePattern("unknown-pattern-123"), /Unknown pattern/);

  // 4. remote URL pattern
  const remoteCanvas = { title: "Remote", width: 500, height: 200, background: "#111", elements: [] };
  const { fetchImpl: remoteFetch, calls: remoteCalls } = mockFetch([
    () => json(200, { canvas: remoteCanvas, duration: 1000, fps: 10 }),
    () => png(),
  ]);
  const remoteStudio = new ImageStudio({ baseUrl: "https://api.test", fetch: remoteFetch });
  await remoteStudio.animatePattern("https://cdn.example/my-pattern.json");
  assert.equal(remoteCalls.length, 2);
  assert.equal(remoteCalls[0].url, "https://cdn.example/my-pattern.json");
  const remoteBody = JSON.parse(remoteCalls[1].init.body as string);
  assert.equal(remoteBody.data.duration, 1000);
});
