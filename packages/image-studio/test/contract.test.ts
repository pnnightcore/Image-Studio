/**
 * Runtime contract check: what the SDK sends is accepted by the server validator, and what the
 * server answers is understood by the SDK. Needs the repo root (imports ../../../src).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { ImageStudio, ImageStudioError, BUILTIN_PRESET_IDS, DEFAULT_LIMITS } from "../src/index.js";
import { ApiError, buildFrameRequest, describeServer, errorToPayload, validateGenerateRequest } from "../../../src/server/contract.js";
import { UnsupportedOnRuntimeError } from "../../../src/lib/runtime.js";
import { createSdkExportSnippet, createIStudioProject } from "../../../src/lib/project-file.js";
import { generatePatternTypeScript, generatePatternSdkUsage } from "../../../src/lib/pattern-export.js";

const canvas = { title: "c", width: 100, height: 50, background: "#000", elements: [] };

test("every SDK method produces a request the server validator accepts", async () => {
  const bodies: any[] = [];
  const urls: string[] = [];
  const fetchImpl = (async (url: string, init: RequestInit) => {
    urls.push(url);
    if (init.body) bodies.push(JSON.parse(init.body as string));
    return new Response(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]), {
      headers: { "Content-Type": "image/png" },
    });
  }) as unknown as typeof fetch;
  const s = new ImageStudio({ baseUrl: "https://t.test", fetch: fetchImpl });

  await s.song({ title: "t", items: [{ displayName: "a", time: "1:00", source: "yt" }] });
  await s.profile({ username: "u", balance: "1", level: 1, currentXp: 1, requiredXp: 2, rank: "#1" });
  await s.quote({ quote: "q", author: "a", handle: "@a", tag: "#t" });
  await s.leaderboard({ items: [{ rank: 1, username: "u", handle: "@u", level: 1, xp: 1 }] });
  await s.custom(canvas);
  await s.animate({ title: "a", canvas, tracks: [], duration: 1000, fps: 10 });
  await s.frame({ title: "a", canvas, tracks: [] }, { time: 100 });

  assert.equal(bodies.length, 7);
  for (const body of bodies.slice(0, 6)) assert.doesNotThrow(() => validateGenerateRequest(body), JSON.stringify(body).slice(0, 80));
  // POST /api/animation/frame body goes through buildFrameRequest instead
  assert.doesNotThrow(() => buildFrameRequest("POST", undefined, bodies[6]));
  assert.equal(urls[6], "https://t.test/api/animation/frame");
});

test("GET query built by presetFrame / presetAnimation is understood by the server", async () => {
  const urls: string[] = [];
  const fetchImpl = (async (url: string) => {
    urls.push(url);
    return new Response(new Uint8Array([1]), { headers: { "Content-Type": "image/png" } });
  }) as unknown as typeof fetch;
  const s = new ImageStudio({ baseUrl: "https://t.test", fetch: fetchImpl });

  await s.presetFrame("welcome", { time: 350, variables: { userName: "Alex" } });
  const frame: any = buildFrameRequest("GET", new URL(urls[0]).searchParams, undefined);
  assert.deepEqual([frame.data.format, frame.data.frameTime, frame.data.templateVariables.userName], ["png", 350, "Alex"]);

  await s.presetAnimation("music", { format: "gif", fps: 10, duration: 1000 });
  const anim: any = buildFrameRequest("GET", new URL(urls[1]).searchParams, undefined);
  assert.deepEqual([anim.data.format, anim.data.fps, anim.data.duration, anim.data.frameTime], ["gif", 10, 1000, undefined]);
});

test("server errors map to the SDK error codes", async () => {
  const cases: Array<[unknown, number, string]> = [
    [new ApiError(400, "INVALID_REQUEST", "bad", { field: "x" }), 400, "INVALID_REQUEST"],
    [new ApiError(405, "METHOD_NOT_ALLOWED", "no"), 405, "METHOD_NOT_ALLOWED"],
    [new ApiError(404, "NOT_FOUND", "nf"), 404, "NOT_FOUND"],
    [new UnsupportedOnRuntimeError("no webp"), 501, "UNSUPPORTED"],
    [new Error("boom"), 500, "RENDER_FAILED"],
  ];
  for (const [error, status, code] of cases) {
    const { status: s, body } = errorToPayload(error);
    assert.equal(s, status);
    const fetchImpl = (async () => new Response(JSON.stringify(body), { status: s, headers: { "Content-Type": "application/json" } })) as unknown as typeof fetch;
    await assert.rejects(new ImageStudio({ baseUrl: "https://t.test", fetch: fetchImpl, retries: 0 }).quote({ quote: "q", author: "a", handle: "h", tag: "t" }), (e: any) => {
      assert.ok(e instanceof ImageStudioError);
      return e.code === code && e.status === status;
    });
  }
});

test("server validation rejects what the SDK would never send", () => {
  for (const bad of [null, [], {}, { type: "nope" }, { type: "quote" }, { type: "animated", data: {} }, { type: "leaderboard", data: {} }, { type: "custom", data: {} }]) {
    assert.throws(() => validateGenerateRequest(bad), (e: any) => e instanceof ApiError && e.status === 400, JSON.stringify(bad));
  }
  assert.throws(() => buildFrameRequest("GET", { preset: "zzz" }, undefined), /Unknown preset/);
  assert.throws(() => buildFrameRequest("GET", { time: "abc" }, undefined), /expected a number/);
  assert.throws(() => buildFrameRequest("DELETE", {}, undefined), (e: any) => e.status === 405);
});

test("project export can be converted to a ready-to-run SDK snippet", () => {
  const project = createIStudioProject(
    "Exported banner",
    {
      title: "Exported banner",
      width: 930,
      height: 280,
      background: "#090614",
      elements: [{ id: "title", type: "text", x: 20, y: 20, width: 200, height: 40, content: "Hello {userName}" }],
    },
    [{ elementId: "title", keyframes: [{ time: 0, x: 20 }, { time: 300, x: 40 }] }],
    { userName: "Alex" },
    { duration: 1200, fps: 12, format: "gif" }
  );

  const snippet = createSdkExportSnippet(project, { baseUrl: "https://example.test", method: "animate" });

  assert.match(snippet, /import \{ ImageStudio \} from "image-studio"/);
  assert.match(snippet, /new ImageStudio\(\{ baseUrl: "https:\/\/example.test" \}\)/);
  assert.match(snippet, /await studio\.animate\(/);
  assert.match(snippet, /templateVariables: \{\s*"userName": "Alex"/s);
});

test("pattern export generates valid TypeScript module and SDK usage", () => {
  const pattern = {
    id: "test-cyber",
    name: "Test Cyber Banner",
    description: "Cyberpunk animated banner",
    duration: 1500,
    fps: 12,
    format: "gif" as const,
    defaultVariables: { userName: "Nova" },
    canvas: {
      title: "Test Cyber Banner",
      width: 930,
      height: 280,
      background: "#090614",
      elements: [{ id: "tag", type: "text" as const, x: 20, y: 20, width: 200, height: 40, content: "CYBER {userName}" }],
    },
    tracks: [{ elementId: "tag", keyframes: [{ time: 0, x: 20 }, { time: 500, x: 40 }] }],
  };

  const tsCodeExternal = generatePatternTypeScript(pattern);
  assert.match(tsCodeExternal, /import type \{ StudioPattern \} from "image-studio";/);
  assert.match(tsCodeExternal, /export const testCyberPattern: StudioPattern = \{/);
  assert.match(tsCodeExternal, /"id": "test-cyber"/);

  const tsCodeInternal = generatePatternTypeScript(pattern, { importSource: "./types.js" });
  assert.match(tsCodeInternal, /import type \{ StudioPattern \} from "\.\/types\.js";/);

  const usage = generatePatternSdkUsage(pattern);
  assert.match(usage, /studio\.animatePattern/);
});

test("constants shared by both sides do not drift", () => {
  for (const runtime of ["node", "cloudflare"] as const) {
    const caps = describeServer(runtime);
    assert.deepEqual(caps.limits, DEFAULT_LIMITS);
    assert.deepEqual(caps.presets, [...BUILTIN_PRESET_IDS]);
  }
  assert.deepEqual(describeServer("cloudflare").formats, ["png", "gif"]);
  assert.deepEqual(describeServer("node").formats, ["png", "gif", "webp"]);
});
