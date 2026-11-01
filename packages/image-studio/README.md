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
| `generate(request)`                                                                         | `POST /api/generate`                  | any (low level)                             |
| `stats()` / `capabilities()`                                                                | `GET /api/stats`                      | counter + runtime, formats, limits, presets |

Avatars / icons accept `string` (URL or data URI), `Uint8Array`, `ArrayBuffer` or `Blob`; bytes are sent as data URIs. Song items are numbered automatically.

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
