/**
 * End-to-end through the SDK against a running deployment.
 *   IMAGE_STUDIO_URL=http://127.0.0.1:3000 npm run test:e2e
 * Works against every host (Express/Vercel/Netlify = "node", Cloudflare Worker = "cloudflare").
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { ImageStudio, ImageStudioError, DEFAULT_LIMITS, BUILTIN_PRESET_IDS } from "../src/index.js";
import { PRESETS } from "../../../src/lib/animation-presets.js";

const baseUrl = process.env.IMAGE_STUDIO_URL;
const outDir = process.env.E2E_OUT;
const studio = baseUrl ? new ImageStudio({ baseUrl, timeoutMs: 60_000, retries: 0 }) : undefined;
const opts = { skip: baseUrl ? false : "set IMAGE_STUDIO_URL to run the e2e tests" };

const isPng = (b: Uint8Array) => b[0] === 0x89 && b[1] === 0x50;
const isGif = (b: Uint8Array) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46;
const keep = (name: string, img: { bytes: Uint8Array }) => outDir && (fs.mkdirSync(outDir, { recursive: true }), fs.writeFileSync(`${outDir}/${name}`, img.bytes));

test("stats() exposes capabilities that match the SDK constants", opts, async () => {
  const stats = await studio!.stats();
  assert.equal(typeof stats.totalGenerated, "number");
  assert.ok(stats.runtime === "node" || stats.runtime === "cloudflare", `runtime=${stats.runtime}`);
  assert.deepEqual(stats.limits, DEFAULT_LIMITS);
  assert.deepEqual(stats.presets, [...BUILTIN_PRESET_IDS]);
  console.log(`# host runtime: ${stats.runtime}, formats: ${stats.formats?.join(",")}`);
});

test("quote() → PNG with metadata", opts, async () => {
  const img = await studio!.quote({ quote: "Hello from the SDK", author: "Image Studio", handle: "@sdk", tag: "#e2e" });
  keep("quote.png", img);
  assert.ok(isPng(img.bytes));
  assert.deepEqual([img.mime, img.extension], ["image/png", "png"]);
  assert.ok(img.width > 0 && img.height > 0, `${img.width}x${img.height}`);
  assert.ok((img.renderMs ?? 0) >= 0 && img.runtime);
  assert.match(img.filename, /\.png$/);
});

test("song() → PNG", opts, async () => {
  const img = await studio!.song({
    title: "lofi",
    layout: "list",
    items: [
      { displayName: "Track one", time: "3:12", source: "youtube", author: "A" },
      { displayName: "Track two", time: "2:48", source: "spotify", author: "B" },
    ],
  });
  keep("song.png", img);
  assert.ok(isPng(img.bytes) && img.width > 0);
});

test("custom() → PNG", opts, async () => {
  const img = await studio!.custom({
    title: "My Design", width: 400, height: 200, background: "#112233",
    elements: [{ id: "t", type: "text", x: 20, y: 20, width: 360, height: 60, content: "Hi", color: "#fff", fontSize: 40 }],
  });
  assert.deepEqual([img.width, img.height], [400, 200]);
});

test("presetFrame() and frame()", opts, async () => {
  const f1 = await studio!.presetFrame("welcome", { time: 350, variables: { userName: "SDK" } });
  keep("preset-frame.png", f1);
  assert.ok(isPng(f1.bytes) && f1.width > 0);

  const preset = PRESETS[0];
  const f2 = await studio!.frame({ title: preset.canvas.title, canvas: preset.canvas, tracks: preset.tracks as any }, { time: 700 });
  assert.ok(isPng(f2.bytes) && f2.width === f1.width);
});

test("animate() → GIF, presetAnimation() → GIF", opts, async () => {
  const preset = PRESETS[0];
  const gif = await studio!.animate({ title: "sdk", canvas: preset.canvas, tracks: preset.tracks as any, duration: 1000, fps: 6 });
  keep("animate.gif", gif);
  assert.ok(isGif(gif.bytes) && gif.animated);
  assert.equal(gif.mime, "image/gif");
  assert.ok(gif.width > 0 && gif.height > 0);

  const g2 = await studio!.presetAnimation("welcome", { fps: 6, duration: 1000 });
  keep("preset.gif", g2);
  assert.ok(isGif(g2.bytes));
});

test("animated WebP: works on node hosts, UNSUPPORTED on cloudflare", opts, async () => {
  const { runtime } = await studio!.stats();
  const preset = PRESETS[0];
  const run = () => studio!.animate({ title: "w", format: "webp", canvas: preset.canvas, tracks: preset.tracks as any, duration: 600, fps: 5 });
  if (runtime === "cloudflare") {
    await assert.rejects(run(), (e: any) => e instanceof ImageStudioError && e.code === "UNSUPPORTED" && e.status === 501);
  } else {
    assert.equal((await run()).mime, "image/webp");
  }
});

test("typed errors from the server", opts, async () => {
  await assert.rejects(studio!.generate({ type: "nope" } as any), (e: any) => e.code === "INVALID_REQUEST" && e.status === 400 && e.details?.field === "type");
  await assert.rejects(studio!.generate({ type: "animated", data: { title: "x" } } as any), (e: any) => e.code === "INVALID_REQUEST");
  // the SDK refuses obviously invalid animations locally (no request, no status)…
  const preset = PRESETS[0];
  const tooLong = { title: "x", canvas: preset.canvas, tracks: preset.tracks as any, duration: 9000, fps: 30 };
  await assert.rejects(studio!.animate(tooLong), (e: any) => e.code === "INVALID_REQUEST" && e.status === undefined);
  // …and the server enforces the same limits when called directly
  const res = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "animated", data: { ...tooLong, loop: -1 } }),
  });
  assert.equal(res.status, 400);
  assert.equal(((await res.json()) as any).code, "INVALID_REQUEST");
  const raw = await fetch(`${baseUrl}/api/animation/frame?preset=zzz`);
  assert.equal(raw.status, 400);
  assert.equal(((await raw.json()) as any).code, "INVALID_REQUEST");
});

test("CORS preflight + exposed headers", opts, async () => {
  const res = await fetch(`${baseUrl}/api/generate`, { method: "OPTIONS" });
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
  const exposed = (res.headers.get("access-control-expose-headers") || "").toLowerCase();
  for (const h of ["x-image-width", "x-image-height", "content-disposition", "x-render-ms"]) assert.ok(exposed.includes(h), h);
});
