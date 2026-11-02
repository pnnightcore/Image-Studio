# image-studio

[leaderboard-compact-list.png (540×556)](https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/leaderboard/leaderboard-compact-list.png)

Typed client for the **Image Studio** HTTP API: song / profile / leaderboard / quote cards, free-form canvas, animated GIF & WebP and single-frame extraction.

- Zero runtime dependencies, uses `fetch` (Node 18+, Bun, Deno, Cloudflare Workers, browsers)
- ESM + CJS + full types
- Typed errors, retries with back-off, **fail-over between hosts**, timeouts and `AbortSignal`
- Fails fast on requests the server would reject (animation limits, unknown presets…)

## Showcase

### Leaderboard
<table width="100%">
  <tr>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/leaderboard/leaderboard-compact-list.png"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/leaderboard/leaderboard-compact-list.png" width="100%" alt="leaderboard-compact-list" /></a><br><sub>compact-list</sub></td>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/leaderboard/leaderboard-podium.png"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/leaderboard/leaderboard-podium.png" width="100%" alt="leaderboard-podium" /></a><br><sub>podium</sub></td>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/leaderboard/leaderboard-versus-duel.png"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/leaderboard/leaderboard-versus-duel.png" width="100%" alt="leaderboard-versus-duel" /></a><br><sub>versus-duel</sub></td>
  </tr>
</table>

### Profile
<table width="100%">
  <tr>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/profile/profile-cyber-neon.png"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/profile/profile-cyber-neon.png" width="100%" alt="profile-cyber-neon" /></a><br><sub>cyber-neon</sub></td>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/profile/profile-glass-minimal.png"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/profile/profile-glass-minimal.png" width="100%" alt="profile-glass-minimal" /></a><br><sub>glass-minimal</sub></td>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/profile/profile-hacker-terminal.png"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/profile/profile-hacker-terminal.png" width="100%" alt="profile-hacker-terminal" /></a><br><sub>hacker-terminal</sub></td>
  </tr>
</table>

### Quote
<table width="100%">
  <tr>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/quote/quote-modern-card.png"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/quote/quote-modern-card.png" width="100%" alt="quote-modern-card" /></a><br><sub>modern-card</sub></td>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/quote/quote-code-terminal.png"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/quote/quote-code-terminal.png" width="100%" alt="quote-code-terminal" /></a><br><sub>code-terminal</sub></td>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/quote/quote-neon-cyber.png"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/quote/quote-neon-cyber.png" width="100%" alt="quote-neon-cyber" /></a><br><sub>neon-cyber</sub></td>
  </tr>
</table>

### Song
<table width="100%">
  <tr>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/song/song-showcase.png"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/song/song-showcase.png" width="100%" alt="song-showcase" /></a><br><sub>showcase</sub></td>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/song/song-grid.png"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/song/song-grid.png" width="100%" alt="song-grid" /></a><br><sub>grid</sub></td>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/song/song-list.png"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/song/song-list.png" width="100%" alt="song-list" /></a><br><sub>list</sub></td>
  </tr>
</table>
### Pattern previews

<table width="100%">
  <tr>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/welcome.gif"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/welcome.gif" width="100%" alt="welcome" /></a><br><sub>welcome</sub></td>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/music.gif"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/music.gif" width="100%" alt="music" /></a><br><sub>music</sub></td>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/music-neon.gif"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/music-neon.gif" width="100%" alt="music-neon" /></a><br><sub>music-neon</sub></td>
  </tr>
  <tr>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/sakura-petals.gif"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/sakura-petals.gif" width="100%" alt="sakura-petals" /></a><br><sub>sakura-petals</sub></td>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/cyber-rotation.gif"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/cyber-rotation.gif" width="100%" alt="cyber-rotation" /></a><br><sub>cyber-rotation</sub></td>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/cyber-bento-hud.gif"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/cyber-bento-hud.gif" width="100%" alt="cyber-bento-hud" /></a><br><sub>cyber-bento-hud</sub></td>
  </tr>
  <tr>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/space-boarding-pass.gif"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/space-boarding-pass.gif" width="100%" alt="space-boarding-pass" /></a><br><sub>space-boarding-pass</sub></td>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/vinyl-turntable.gif"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/vinyl-turntable.gif" width="100%" alt="vinyl-turntable" /></a><br><sub>vinyl-turntable</sub></td>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/vs-battle-duel.gif"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/vs-battle-duel.gif" width="100%" alt="vs-battle-duel" /></a><br><sub>vs-battle-duel</sub></td>
  </tr>
  <tr>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/hacker-terminal.gif"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/hacker-terminal.gif" width="100%" alt="hacker-terminal" /></a><br><sub>hacker-terminal</sub></td>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/tcg-hologram.gif"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/tcg-hologram.gif" width="100%" alt="tcg-hologram" /></a><br><sub>tcg-hologram</sub></td>
    <td width="33.33%" align="center"><a href="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/spark-magic.gif"><img src="https://raw.githubusercontent.com/zijipia/Image-Studio/refs/heads/main/output/patterns/animations/spark-magic.gif" width="100%" alt="spark-magic" /></a><br><sub>spark-magic</sub></td>
  </tr>
</table>

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

The SDK ships with **15 pre-bundled visual patterns** ready to render by ID or imported directly from `"image-studio"`:

| Pattern ID               | Name                            | Duration | Default Variables                     | Category  |
| ------------------------ | ------------------------------- | -------- | ------------------------------------- | --------- |
| `welcome`                | Welcome Card                    | 1500 ms  | `{ userName, guildName, userAVTurl }` | Classic   |
| `cyber-rotation`         | 3D Cyber Rotation               | 1800 ms  | `{ userName, guildName, userAVTurl }` | Cyber     |
| `music`                  | Lo-Fi Music Player              | 1600 ms  | `{ userName, userAVTurl }`            | Music     |
| `rank-up`                | Rank Up Level Progression       | 1500 ms  | `{ userName, userAVTurl }`            | Gaming    |
| `spark-magic`            | Magical Sparkles Burst          | 1500 ms  | `{ userName, userAVTurl }`            | Classic   |
| `sakura-petals`          | Falling Sakura Petals           | 1500 ms  | `{ userName, userAVTurl }`            | Classic   |
| `music-neon`             | Neon Vinyl Wave                 | 1600 ms  | `{ userName, userAVTurl }`            | Music     |
| `cyber-bento-hud`        | Cyber Bento Grid HUD            | 1800 ms  | `{ userName, guildName, userAVTurl }` | ✦   |
| `hacker-terminal`        | Matrix Netrunner Terminal       | 1800 ms  | `{ userName, guildName, userAVTurl }` | ✦   |
| `space-boarding-pass`    | Sci-Fi Space Flight Pass        | 1600 ms  | `{ userName, guildName, userAVTurl }` | ✦   |
| `vinyl-turntable`        | Spinning Vinyl Turntable        | 2400 ms  | `{ userName, userAVTurl }`            | ✦   |
| `tcg-hologram`           | Holographic TCG Trading Card    | 1600 ms  | `{ userName, userAVTurl }`            | ✦   |
| `vs-battle-duel`         | Arcade Fighting VS Battle Clash | 1600 ms  | `{ userName, guildName, userAVTurl }` | ✦   |
| `gacha-lootbox`          | RPG Gacha SSR Summon (5-Star)   | 1800 ms  | `{ userName, userAVTurl }`            | ✦   |
| `retro-synthwave-sunset` | 80s Outrun Synthwave Sunset     | 1800 ms  | `{ userName, userAVTurl }`            | ✦   |

#### Option A: Call by Pattern ID string

```ts
import { ImageStudio } from "image-studio";

const studio = new ImageStudio();

// Render animated GIF or WebP by pattern ID
const animation = await studio.animatePattern("gacha-lootbox", {
  variables: { userName: "Nova", userAVTurl: "https://github.com/shadcn.png" },
  format: "gif",
});
await animation.save("gacha-summon.gif"); // Direct local file save (Node / Bun)

// Or extract a single high-res PNG frame at 600ms
const frame = await studio.framePattern("retro-synthwave-sunset", {
  time: 600,
  variables: { userName: "CyberPilot" },
});
await frame.save("synthwave-frame.png");
```

#### Option B: Call with Typed Pattern Import

```ts
import {
  ImageStudio,
  gachaLootboxPattern,
  retroSynthwaveSunsetPattern,
} from "image-studio";

const studio = new ImageStudio();

const animation = await studio.animatePattern(gachaLootboxPattern, {
  variables: { userName: "Eldoria Knight" },
});
await animation.save("lootbox.gif");
```

### 2. Passing Custom / Inline Pattern Objects (Build from Scratch)

You can pass a custom `StudioPattern` object directly in the request to render on-demand without needing to save to disk or publish:

```ts
import { ImageStudio, type StudioPattern } from "image-studio";

const studio = new ImageStudio();

const customPattern: StudioPattern = {
  id: "welcome-card-animation",
  name: "Welcome Card Animation",
  description: "Pattern created in Image Studio (930x280)",
  duration: 500,
  fps: 12,
  format: "gif",
  defaultVariables: {
    userAVTurl: "https://github.com/shadcn.png",
    userName: "ziji",
    guildName: "Hội Vô Danh 2",
  },
  canvas: {
    title: "Welcome Card Animation",
    width: 930,
    height: 280,
    background:
      "linear-gradient(135deg, #090614 0%, #1e1035 50%, #4a1d6e 100%)",
    elements: [
      {
        id: "avatar",
        type: "avatar",
        x: 445,
        y: 96,
        width: 140,
        height: 140,
        imageUrl: "{userAVTurl}",
        borderRadius: 999,
        border: "4px solid rgba(168, 85, 247, 0.6)",
      },
      {
        id: "title",
        type: "text",
        x: 257,
        y: 36,
        width: 650,
        height: 52,
        content: "Welcome, {userName}!",
        color: "#ffffff",
        fontSize: 44,
        fontWeight: 700,
        textShadow:
          "0 0 16px rgba(192, 132, 252, 0.75), 2px 3px 6px rgba(0, 0, 0, 0.9)",
      },
    ],
  },
  tracks: [
    {
      elementId: "avatar",
      keyframes: [
        {
          time: 0,
          x: 20,
          y: 40,
          width: 110,
          height: 110,
          rotation: -12,
          scaleX: 0.8,
          scaleY: 0.8,
          opacity: 0,
          easing: "bounce",
        },
        {
          time: 450,
          x: 445,
          y: 96,
          width: 140,
          height: 140,
          rotation: 6,
          scaleX: 1.05,
          scaleY: 1.05,
          opacity: 1,
          easing: "ease-out",
        },
        {
          time: 500,
          x: 445,
          y: 96,
          width: 140,
          height: 140,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          easing: "ease-in-out",
        },
      ],
    },
    {
      elementId: "title",
      keyframes: [
        {
          time: 200,
          x: 160,
          y: 55,
          width: 650,
          height: 52,
          rotation: -2,
          scaleX: 0.95,
          opacity: 0,
          easing: "ease-out",
        },
        {
          time: 450,
          x: 257,
          y: 36,
          width: 650,
          height: 52,
          rotation: 0,
          scaleX: 1,
          opacity: 1,
          easing: "ease-in-out",
        },
      ],
    },
  ],
};

// 1. Download / Save a single PNG frame at 20ms with custom variables
const frame = await studio.framePattern(customPattern, {
  time: 20,
  variables: {
    userName: "ziji",
    userAVTurl: "https://github.com/shadcn.png",
  },
});
await frame.save("welcome-custom-frame.png");

// 2. Download / Save the full animated GIF
const animation = await studio.animatePattern(customPattern, {
  variables: { userName: "ziji" },
  format: "gif",
});
await animation.save("welcome-custom.gif");
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
  },
);
await image.save("event.webp");
```

### Pattern Methods Reference

| Method                                     | Argument                                                                                | Returns                                |
| ------------------------------------------ | --------------------------------------------------------------------------------------- | -------------------------------------- |
| `animatePattern(pattern, options?, call?)` | `pattern`: pattern ID (`string`), `StudioPattern` object, or remote JSON URL (`string`) | `Promise<GeneratedImage>` (GIF / WebP) |
| `framePattern(pattern, options?, call?)`   | `pattern`: pattern ID (`string`), `StudioPattern` object, or remote JSON URL (`string`) | `Promise<GeneratedImage>` (PNG)        |
| `resolvePattern(pattern)`                  | Resolves ID, URL, or JSON into a typed `StudioPattern`                                  | `Promise<StudioPattern>`               |
| `patterns`                                 | Dictionary of all pre-bundled patterns (`patterns.welcome`, etc.)                       | `Record<string, StudioPattern>`        |
| `registerPattern(pattern)`                 | Dynamically register custom pattern into runtime registry                               | `void`                                 |

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
