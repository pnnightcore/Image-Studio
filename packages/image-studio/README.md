# image-studio

Typed client for the **Image Studio** HTTP API: song / profile / leaderboard / quote cards, free-form canvas, animated GIF & WebP and single-frame extraction.

- Zero runtime dependencies, uses `fetch` (Node 18+, Bun, Deno, Cloudflare Workers, browsers)
- ESM + CJS + full types
- Typed errors, retries with back-off, **fail-over between hosts**, timeouts and `AbortSignal`
- Fails fast on requests the server would reject (animation limits, unknown presets…)

```ts
import { ImageStudio } from "image-studio";

const studio = new ImageStudio();

const card = await studio.quote({
  quote: "Ship it.",
  author: "Me",
  handle: "@me",
  tag: "#dev",
  avatar: "https://…/a.png",
});
await card.save("quote.png"); // Node / Bun
message.reply({ files: [card.toAttachment()] }); // discord.js
return card.toResponse(); // Workers / Next.js / Hono
```

## Methods

| Method                                                                                      | Endpoint                              | Output                                      |
| ------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------- |
| `quote(input)` · `profile(input)` · `leaderboard(input)` · `song(input)` · `custom(canvas)` | `POST /api/generate`                  | PNG                                         |
| `animate(data)` (`format: "gif" \| "webp"`)                                                 | `POST /api/generate`                  | GIF / WebP                                  |
| `frame(data, { time \| index })`                                                            | `POST /api/animation/frame`           | PNG                                         |
| `presetFrame(preset, { time \| frame, variables })`                                         | `GET /api/animation/frame`            | PNG                                         |
| `presetAnimation(preset, { format, fps, duration, loop, variables })`                       | `GET /api/animation/frame?format=gif` | GIF / WebP                                  |
| `animatePattern(pattern, { variables, duration, fps, format, loop })`                       | `POST /api/generate`                  | GIF / WebP                                  |
| `framePattern(pattern, { time \| frame, variables })`                                       | `POST /api/animation/frame`           | PNG                                         |
| `generate(request)`                                                                         | `POST /api/generate`                  | any (low level)                             |
| `stats()` / `capabilities()`                                                                | `GET /api/stats`                      | counter + runtime, formats, limits, presets |

Avatars / icons accept `string` (URL or data URI), `Uint8Array`, `ArrayBuffer` or `Blob`; bytes are sent as data URIs. Song items are numbered automatically.

## Patterns & Web-to-SDK Workflow

A **Pattern** (`StudioPattern`) is a reusable, parameterized visual template containing canvas layout, multi-track keyframe animations, typography, particles, and default template variables (`{userName}`, `{guildName}`, etc.).

You can visually design patterns on the **Image Studio Web** (`/animation`) and use them with the `image-studio` SDK in 3 flexible ways:

### 1. Using Built-in Patterns (Bundled with SDK)

The SDK ships with 7 pre-bundled starter patterns: `welcome`, `cyber-rotation`, `music`, `rank-up`, `spark-magic`, `sakura-petals`, `music-neon`.

```ts
import { ImageStudio, patterns } from "image-studio";

const studio = new ImageStudio();

// Render animated GIF or WebP by pattern ID
const animation = await studio.animatePattern("welcome", {
  variables: { userName: "Nova", guildName: "Alpha Squad" },
});
await animation.save("welcome.gif");

// Or capture a single PNG frame at 350ms
const frame = await studio.framePattern("welcome", {
  time: 350,
  variables: { userName: "Nova" },
});
await frame.save("welcome-preview.png");
```

### 2. Exporting Custom Patterns from Web Studio to Your Project

When using the published npm package in your own application (Discord bot, backend, microservice):

1. Open **Image Studio Web** (`http://localhost:3000` or deployed URL) and navigate to **Animation Studio** (`/animation`).
2. Visually arrange layers, keyframe tracks, particles, and template variables (`{userName}`, `{guildName}`, etc.).
3. Click **"Export Pattern"** in the top action bar (or inside the API Payload Inspector).
4. Choose an export option:
   - **📁 Lưu thẳng vào thư mục dự án**: Opens native browser folder picker (`window.showSaveFilePicker`) to save `my-banner.ts` directly into your project's directory (e.g. `src/patterns/`).
   - **📥 Tải .ts / .json**: Downloads the typed TypeScript module or JSON file.
   - **📋 Sao chép code**: Copies the ready-to-run pattern code to your clipboard.
5. In your project, import the exported pattern and execute it:

```ts
import { ImageStudio } from "image-studio";
import { myBannerPattern } from "./patterns/my-banner.js";

const studio = new ImageStudio();

const image = await studio.animatePattern(myBannerPattern, {
  variables: { userName: "Nova", guildName: "Alpha Squad" },
});
await image.save("my-banner.gif");
```

### 3. Dynamic Remote Loading via URL (No Code Redeploy / No Publish)

The SDK can dynamically load and execute pattern JSON files from any HTTP/HTTPS URL (GitHub Raw, S3, CDN, or your own asset server):

```ts
const image = await studio.animatePattern(
  "https://raw.githubusercontent.com/my-org/my-bot/main/patterns/event-banner.json",
  {
    variables: { userName: "Alice" },
    format: "webp",
    duration: 1800,
  }
);
await image.save("event.webp");
```

### Pattern Methods Reference

| Method | Argument | Returns |
| --- | --- | --- |
| `animatePattern(pattern, options?, call?)` | `pattern`: pattern ID (`string`), `StudioPattern` object, or remote JSON URL (`string`) | `Promise<GeneratedImage>` (GIF / WebP) |
| `framePattern(pattern, options?, call?)` | `pattern`: pattern ID (`string`), `StudioPattern` object, or remote JSON URL (`string`) | `Promise<GeneratedImage>` (PNG) |
| `resolvePattern(pattern)` | Resolves ID, URL, or JSON into a typed `StudioPattern` | `Promise<StudioPattern>` |
| `patterns` | Dictionary of all pre-bundled patterns (`patterns.welcome`, etc.) | `Record<string, StudioPattern>` |
| `registerPattern(pattern)` | Dynamically register custom pattern into runtime registry | `void` |

### `GeneratedImage`

`bytes`, `mime`, `width`, `height`, `filename`, `totalGenerated`, `renderMs`, `runtime` (`"node"` or `"cloudflare"`), `baseUrl` (host that served it), plus
`toBuffer()`, `toBlob()`, `toArrayBuffer()`, `toBase64()`, `toDataURL()`, `toResponse()`, `toAttachment()`, `save(path)`.

## Options

```ts
new ImageStudio({
  baseUrl: "https://a.example" | ["https://primary", "https://fallback"], // or IMAGE_STUDIO_URL
  timeoutMs: 30_000, // per attempt, includes downloading the body
  retries: 2, // same host, transient errors only (network, 429, 502, 503, 504)
  retryDelayMs: 300, // exponential back-off, honours Retry-After
  headers: {}, // e.g. { Authorization: "Bearer …" } behind a gateway
  fetch, // custom fetch
  onRetry,
  onFailover, // observability hooks
});
```

Every method also takes `{ signal, timeoutMs, retries }` as its last argument.

## Errors

All failures are `ImageStudioError` with `code`, `status`, `details`, `retryable`, `failoverable` and `attempts` (every host/attempt tried).

| `code`                                        | Meaning                                                                   | Retried | Fail-over |
| --------------------------------------------- | ------------------------------------------------------------------------- | ------- | --------- |
| `INVALID_REQUEST` (400)                       | Bad payload / unknown preset / limits. `details.field` names the culprit. | no      | no        |
| `METHOD_NOT_ALLOWED` (405), `NOT_FOUND` (404) | Wrong route                                                               | no      | no        |
| `UNSUPPORTED` (501)                           | Host cannot do it (animated WebP on Cloudflare)                           | no      | **yes**   |
| `RENDER_FAILED` (500)                         | Rendering crashed                                                         | no      | yes       |
| `RESOURCE_LIMIT`                              | Cloudflare error 1102 (CPU/memory)                                        | no      | **yes**   |
| `NETWORK_ERROR`                               | DNS/connection failure                                                    | yes     | yes       |
| `TIMEOUT`                                     | Attempt exceeded `timeoutMs`                                              | no      | yes       |
| `ABORTED`                                     | Your `AbortSignal` fired                                                  | no      | no        |
| `BAD_RESPONSE` / `HTTP_ERROR`                 | Not an image / unknown error page                                         | –       | –         |

## Fail-over

```ts
const studio = new ImageStudio({
  baseUrl: ["https://cf.example", "https://vercel.example"],
});
```

Cloudflare's free plan allows 10 ms of CPU per request, so big renders fail with error 1102. List a second host and those requests are replayed there automatically; validation errors (4xx) are never replayed.

## Wire contract (what both sides rely on)

- Success: `200` + image bytes. Metadata is in headers: `X-Image-Width`, `X-Image-Height`, `X-Total-Generated`, `X-Render-Ms`, `X-Render-Runtime`, `Content-Disposition` (URL-encoded filename). All are exposed to browsers through CORS.
- Failure: JSON `{ "error": string, "code": ApiErrorCode, "details"?: any }`.
- `GET /api/stats` additionally publishes `runtime`, `formats`, `limits`, `presets`.
- `test/contract.types.ts` (compile time) and `test/contract.test.ts` (runtime) keep the SDK and `src/server/contract.ts` in sync.

## Development

```bash
npm install && npm test                                   # unit tests, mocked fetch
IMAGE_STUDIO_URL=http://localhost:3000 npm run test:e2e   # against a running server
npm run build                                             # dist/ (ESM + CJS + .d.ts)
```
