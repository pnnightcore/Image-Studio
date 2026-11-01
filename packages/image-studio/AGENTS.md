# AGENTS.md — Image Studio SDK Instructions for AI Agents

> **Role & Purpose**: This document instructs AI coding assistants (Cursor, Copilot, Antigravity, Claude, etc.) on how to install, configure, and execute the `image-studio` package in a user's project immediately, without guessing.

---

## 1. Quick Installation for User Project

When a user asks to generate banners, Discord cards, or animated media using Image Studio, run or instruct the user to run:

```bash
# npm
npm install image-studio

# pnpm
pnpm add image-studio

# bun
bun add image-studio
```

- **Runtime compatibility**: Node.js 18+, Bun, Deno, Cloudflare Workers, Next.js (Edge & Node runtimes), and modern browsers.
- **Dependencies**: Zero external runtime dependencies (uses native `fetch`).

---

## 2. Client Initialization Rules

Always instantiate `ImageStudio` with the default hosted endpoint or user custom endpoint:

```ts
import { ImageStudio } from "image-studio";

// Default production endpoint with automatic failover
const studio = new ImageStudio({
  baseUrl: [
    "https://image-studio-green.vercel.app",
    "https://image--studios.vercel.app",
  ],
});
```

*Optional environment variable*: `IMAGE_STUDIO_URL=https://image-studio-green.vercel.app`. When set, `new ImageStudio()` reads it automatically.

---

## 3. Plug-and-Play Recipes for Common User Tasks

### Recipe A: Discord.js Bot (v14)
When the user asks to send cards or welcome banners in Discord:

```ts
import { Client, GatewayIntentBits, AttachmentBuilder } from "discord.js";
import { ImageStudio } from "image-studio";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const studio = new ImageStudio();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "welcome") {
    await interaction.deferReply();

    // Render animated GIF welcome card using built-in pattern
    const image = await studio.animatePattern("welcome", {
      variables: {
        userName: interaction.user.username,
        guildName: interaction.guild?.name || "Server",
        userAVTurl: interaction.user.displayAvatarURL({ extension: "png" }),
      },
    });

    const attachment = new AttachmentBuilder(image.toBuffer(), { name: "welcome.gif" });
    await interaction.editReply({ files: [attachment] });
  }
});
```

### Recipe B: Node.js / Bun Local Script (Save to File)
When the user wants to generate an image and save it directly to disk:

```ts
import { ImageStudio } from "image-studio";

const studio = new ImageStudio();

// Example 1: User Profile / Rank Card (PNG)
const profile = await studio.profile({
  username: "Nova",
  rank: "#1",
  level: 42,
  currentXp: 8500,
  requiredXp: 10000,
  balance: "1,250,000",
  avatar: "https://github.com/shadcn.png",
  theme: "cosmic-void", // "ruby-poly" | "cyber-neon" | "glass-minimal" | "gold-legend" | "cosmic-void" | "frost-glacier" | "sakura-duelist" | "hacker-terminal"
});
await profile.save("profile.png");

// Example 2: Stylized Quote Card (PNG)
const quote = await studio.quote({
  quote: "Simplicity is prerequisite for reliability.",
  author: "Edsger W. Dijkstra",
  handle: "@dijkstra",
  tag: "#computer-science",
  avatar: "https://github.com/shadcn.png",
  layout: "magazine-editorial", // "split-portrait" | "centered-minimal" | "modern-card" | "neon-cyber" | "magazine-editorial" | "polaroid-vintage" | "speech-bubble" | "code-terminal"
});
await quote.save("quote.png");
```

### Recipe C: Next.js / Hono / Cloudflare Workers API Route
When the user wants to return the image directly as an HTTP response:

```ts
import { ImageStudio } from "image-studio";

const studio = new ImageStudio();

export async function GET(request: Request) {
  const card = await studio.quote({
    quote: "Stay hungry, stay foolish.",
    author: "Steve Jobs",
    handle: "@apple",
    tag: "#inspiration",
    avatar: "https://github.com/shadcn.png",
  });

  return card.toResponse(); // Returns native Response with image bytes & correct Content-Type
}
```

---

## 4. Working with Patterns: Built-in Catalog, Custom Patterns & On-Demand Execution

A **StudioPattern** is a reusable, parameterized visual template containing canvas layout, multi-track keyframe animations, typography, particles, and default template variables (`{userName}`, `{guildName}`, `{userAVTurl}`).

### 4.1. Using Built-in Patterns (15 Ready-to-Use Patterns)

The SDK ships with 15 pre-bundled starter patterns:
1. `welcome` — Welcome Card with pop-in avatar and title
2. `cyber-rotation` — 3D Cyber Card with rotating avatar
3. `music` — Lo-Fi Music Player with spinning vinyl & track telemetry
4. `rank-up` — Rank Up Level Progression with XP bar animation
5. `spark-magic` — Magical Sparkles Burst with floating avatar
6. `sakura-petals` — Falling Sakura Petals aesthetic card
7. `music-neon` — Neon Vinyl Wave with pulsing soundwave
8. `cyber-bento-hud` — Cyber Bento Grid HUD with telemetry panels
9. `hacker-terminal` — Matrix Netrunner Terminal with command stream
10. `space-boarding-pass` — Sci-Fi Space Flight Pass with detachable stub
11. `vinyl-turntable` — Spinning Vinyl Turntable with tonearm & VU meter
12. `tcg-hologram` — Holographic TCG Trading Card with mana & stars
13. `vs-battle-duel` — Arcade Fighting VS Battle Clash with dual health bars
14. `gacha-lootbox` — RPG Gacha SSR Summon with 5-star golden ray burst
15. `retro-synthwave-sunset` — 80s Outrun Synthwave Sunset with horizon grid & turbo speedometer

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

// Extract a single high-res PNG frame at 600ms
const frame = await studio.framePattern("retro-synthwave-sunset", {
  time: 600,
  variables: { userName: "CyberPilot" },
});
await frame.save("synthwave-frame.png");
```

#### Option B: Call with Typed Pattern Import
```ts
import { ImageStudio, gachaLootboxPattern, retroSynthwaveSunsetPattern } from "image-studio";

const studio = new ImageStudio();

const animation = await studio.animatePattern(gachaLootboxPattern, {
  variables: { userName: "Eldoria Knight" },
});
await animation.save("lootbox.gif");
```

---

### 4.2. How to Build a Pattern from Scratch (from 0)

When you want to programmatically generate or design a new custom animation pattern without using the UI, construct a `StudioPattern` object following this specification:

#### Step 1: Pattern Structure & Canvas Setup
```ts
import type { StudioPattern } from "image-studio";

export const myCustomPattern: StudioPattern = {
  id: "custom-battle-banner",
  name: "Custom Battle Banner",
  description: "Dynamic battle banner with animated avatar and title",
  duration: 1500, // Total duration in ms
  fps: 15,        // Recommended: 12 - 15 fps
  format: "gif",   // "gif" | "webp"
  defaultVariables: {
    userName: "Player1",
    guildName: "Legends Guild",
    userAVTurl: "https://github.com/shadcn.png",
  },
  canvas: {
    title: "Battle Banner",
    width: 930,
    height: 280,
    background: "linear-gradient(135deg, #090614 0%, #1e1035 50%, #4a1d6e 100%)",
    elements: [
      // Step 2: Define visual elements
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
        textShadow: "0 0 16px rgba(192, 132, 252, 0.75), 2px 3px 6px rgba(0, 0, 0, 0.9)",
      },
      {
        id: "role-badge",
        type: "badge",
        x: 257,
        y: 100,
        width: 130,
        height: 32,
        content: "{guildName}",
        color: "#c084fc",
        backgroundColor: "rgba(192, 132, 252, 0.15)",
        border: "1px solid rgba(192, 132, 252, 0.4)",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 700,
      },
    ],
  },
  // Step 3: Define animation keyframe tracks
  tracks: [
    {
      elementId: "avatar",
      keyframes: [
        { time: 0, x: 20, y: 40, width: 110, height: 110, rotation: -12, scaleX: 0.8, scaleY: 0.8, opacity: 0, easing: "bounce" },
        { time: 450, x: 445, y: 96, width: 140, height: 140, rotation: 6, scaleX: 1.05, scaleY: 1.05, opacity: 1, easing: "ease-out" },
        { time: 550, x: 445, y: 96, width: 140, height: 140, rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, easing: "ease-in-out" },
      ],
    },
    {
      elementId: "title",
      keyframes: [
        { time: 200, x: 160, y: 55, width: 650, height: 52, rotation: -2, scaleX: 0.95, opacity: 0, easing: "ease-out" },
        { time: 450, x: 257, y: 36, width: 650, height: 52, rotation: 0, scaleX: 1, opacity: 1, easing: "ease-in-out" },
      ],
    },
    {
      elementId: "role-badge",
      keyframes: [
        { time: 400, y: 120, opacity: 0, easing: "bounce" },
        { time: 700, y: 100, opacity: 1, easing: "ease-in-out" },
      ],
    },
  ],
};
```

#### Element Types Reference:
- `"avatar"`: `{ id, type: "avatar", x, y, width, height, imageUrl, borderRadius?, border? }`
- `"text"`: `{ id, type: "text", x, y, width, height, content, color?, fontSize?, fontWeight?, textAlign?, textShadow?, glowEnabled?, glowBlur?, glowColor? }`
- `"badge"`: `{ id, type: "badge", x, y, width, height, content, color?, backgroundColor?, border?, borderRadius?, fontSize?, fontWeight? }`
- `"box"`: `{ id, type: "box", x, y, width, height, backgroundColor?, border?, borderRadius?, opacity? }`
- `"progress"`: `{ id, type: "progress", x, y, width, height, progressPercent, progressColor?, backgroundColor?, borderRadius? }`
- `"particle"`: `{ id, type: "particle", x, y, width, height, particleConfig }` (use configs from `PARTICLE_PRESETS.spark.config`, etc.)

#### Keyframe Animation Options:
- `time`: millisecond timestamp within `duration`
- `x`, `y`: position coordinates
- `width`, `height`: element dimensions
- `rotation`: degrees (-360 to 360)
- `scaleX`, `scaleY`: 2D scale multipliers
- `anchorX`, `anchorY`: transform origin (0 to 1, default 0.5 center)
- `opacity`: transparency (0 to 1)
- `easing`: `"linear"` | `"ease-in"` | `"ease-out"` | `"ease-in-out"` | `"bounce"`

---

### 4.3. On-Demand Rendering with Custom / Inline Pattern Request

You can pass a custom `StudioPattern` object directly in the request to render and download frames or animations without needing to save to disk or publish:

```ts
import { ImageStudio } from "image-studio";

const studio = new ImageStudio();

// 1. Download / Save a single PNG frame at 20ms with custom variables
const frame = await studio.framePattern(
  {
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
      background: "linear-gradient(135deg, #090614 0%, #1e1035 50%, #4a1d6e 100%)",
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
          textShadow: "0 0 16px rgba(192, 132, 252, 0.75), 2px 3px 6px rgba(0, 0, 0, 0.9)",
        },
      ],
    },
    tracks: [
      {
        elementId: "avatar",
        keyframes: [
          { time: 0, x: 20, y: 40, width: 110, height: 110, rotation: -12, scaleX: 0.8, scaleY: 0.8, opacity: 0, easing: "bounce" },
          { time: 450, x: 445, y: 96, width: 140, height: 140, rotation: 6, scaleX: 1.05, scaleY: 1.05, opacity: 1, easing: "ease-out" },
          { time: 500, x: 445, y: 96, width: 140, height: 140, rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, easing: "ease-in-out" },
        ],
      },
      {
        elementId: "title",
        keyframes: [
          { time: 200, x: 160, y: 55, width: 650, height: 52, rotation: -2, scaleX: 0.95, opacity: 0, easing: "ease-out" },
          { time: 450, x: 257, y: 36, width: 650, height: 52, rotation: 0, scaleX: 1, opacity: 1, easing: "ease-in-out" },
        ],
      },
    ],
  },
  {
    time: 20,
    variables: {
      userAVTurl: "https://github.com/shadcn.png",
      userName: "ziji",
    },
  }
);

// Download / Save PNG Frame
await frame.save("welcome-custom-frame.png");
console.log(`Saved frame: ${frame.width}x${frame.height} PNG, size: ${frame.size} bytes`);

// 2. Download / Save full animated GIF
const animation = await studio.animatePattern(customPattern, {
  variables: { userName: "ziji" },
  format: "gif",
});
await animation.save("welcome-custom-animation.gif");
```

---

### 4.4. Downloading & Saving Helpers

`framePattern()` and `animatePattern()` resolve to a `GeneratedImage` object with zero-copy binary helpers:
- `await image.save("output.png")` — Writes directly to disk on Node.js / Bun.
- `image.toBuffer()` — Returns Node `Buffer` (for Discord attachments or filesystem operations).
- `image.toBlob()` — Returns W3C `Blob` (for browser upload or FormData).
- `image.toArrayBuffer()` — Returns raw `ArrayBuffer`.
- `image.toDataURL()` — Returns `data:image/png;base64,...` URI.
- `image.toResponse()` — Returns a native web `Response` with headers set for API routes.
- `image.toAttachment("file.png")` — Returns `{ attachment, name }` for `discord.js`.

---

## 5. Available API Surface Summary

```ts
// 1. Static Card Generators (Returns PNG)
studio.song({
  title,
  items,
  layout?: "auto" | "list" | "grid" | "classic" | "showcase" | "compact-queue",
  particleConfig?,
})

studio.profile({
  username,
  balance,
  level,
  currentXp,
  requiredXp,
  rank,
  theme?: "ruby-poly" | "cyber-neon" | "glass-minimal" | "gold-legend" | "cosmic-void" | "frost-glacier" | "sakura-duelist" | "hacker-terminal",
  avatar?,
  particleConfig?,
})

studio.leaderboard({
  guildName,
  guildIcon?,
  season?,
  items,
  layout?: "podium" | "compact-list" | "cyber-grid" | "minimal-cards" | "versus-duel" | "hall-of-fame" | "tier-division" | "terminal-matrix",
  particleConfig?,
})

studio.quote({
  quote,
  author,
  handle,
  tag?,
  avatar?,
  layout?: "split-portrait" | "centered-minimal" | "modern-card" | "neon-cyber" | "magazine-editorial" | "polaroid-vintage" | "speech-bubble" | "code-terminal",
})

studio.custom(canvas)

// 2. Multi-track Timeline Animations (Returns GIF or WebP)
studio.animate(data, options?)
studio.frame(data, { time?: number, index?: number })

// 3. Patterns (15 Built-in Patterns, Remote URL, or Direct StudioPattern Object)
studio.animatePattern(patternOrIdOrUrl, { variables?, format?, duration?, fps?, loop? })
studio.framePattern(patternOrIdOrUrl, { time?: number, frame?: number, variables? })

// 4. Server Capabilities & Diagnostics
await studio.stats()
```

---

## 6. Generated Image Helper Methods

Every generator method resolves to a `GeneratedImage` instance with convenient helpers:
- `image.toBuffer()` -> `Buffer` (for Node.js fs / Discord attachments)
- `image.toBlob()` -> `Promise<Blob>` (for Web / Fetch)
- `image.toArrayBuffer()` -> `ArrayBuffer`
- `image.toDataURL()` -> `string` (Base64 data URI `data:image/png;base64,...`)
- `image.toResponse()` -> `Response` (native web Response for Next.js/Hono/Workers)
- `image.toAttachment(filename?)` -> `{ attachment: Buffer, name: string }`
- `image.save(filepath)` -> Saves directly to local disk (Node/Bun)

---

## 7. Guidelines for AI Assistants Answering Users

1. **Always use modern top-level await or async/await functions**.
2. **Never import from internal paths** (e.g. `image-studio/src/...` or `image-studio/dist/...`). Always import directly from `"image-studio"`.
3. **Avatars / Images**: Accept remote URLs (`https://...`), Base64 data URIs, `Buffer`, `Uint8Array`, or `Blob`.
4. **Error handling**: All errors are instances of `ImageStudioError`. Catch them and inspect `error.code` (`INVALID_REQUEST`, `RESOURCE_LIMIT`, `TIMEOUT`, `NETWORK_ERROR`).
5. **Always provide self-contained, immediately executable code** when responding to user requests.
