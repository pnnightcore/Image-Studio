/**
 * Build All Images & Animations via image-studio SDK
 * Target backend: http://localhost:3000/ (or process.env.IMAGE_STUDIO_URL)
 * Saves all generated media to ./output/
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ImageStudio, patterns } from "image-studio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;
const outputDir = path.resolve(rootDir, "output");

const BACKEND_URL = process.env.IMAGE_STUDIO_URL || "http://localhost:3000";

console.log("===============================================================");
console.log("🎨 Image Studio — Complete Media Build Pipeline");
console.log(`🔗 Target Backend: ${BACKEND_URL}`);
console.log(`📁 Output Directory: ${outputDir}`);
console.log(
  "===============================================================\n",
);

const studio = new ImageStudio({ baseUrl: BACKEND_URL, timeoutMs: 90000 });

// Ensure output directories exist
const dirs = {
  root: outputDir,
  profile: path.join(outputDir, "profile"),
  song: path.join(outputDir, "song"),
  leaderboard: path.join(outputDir, "leaderboard"),
  quote: path.join(outputDir, "quote"),
  patternsFrames: path.join(outputDir, "patterns", "frames"),
  patternsAnimations: path.join(outputDir, "patterns", "animations"),
  custom: path.join(outputDir, "custom"),
};

for (const dir of Object.values(dirs)) {
  await fs.mkdir(dir, { recursive: true });
}

const stats = {
  totalFiles: 0,
  totalBytes: 0,
  start: Date.now(),
};

async function saveFile(destPath, imageResult, label) {
  const filePath = await imageResult.save(destPath);
  stats.totalFiles++;
  stats.totalBytes += imageResult.size;
  const sizeKb = (imageResult.size / 1024).toFixed(1);
  console.log(
    `  ✅ [${label}] -> ${path.relative(rootDir, filePath)} (${imageResult.width}x${imageResult.height}, ${sizeKb} KB)`,
  );
  return filePath;
}

/* =========================================================================
   1. PROFILE CARDS (All 8 Themes)
   ========================================================================= */
console.log("📦 [1/6] Rendering Profile Cards (8 Themes)...");

const PROFILE_THEMES = [
  "ruby-poly",
  "cyber-neon",
  "glass-minimal",
  "gold-legend",
  "cosmic-void",
  "frost-glacier",
  "sakura-duelist",
  "hacker-terminal",
];

for (const theme of PROFILE_THEMES) {
  try {
    const card = await studio.profile({
      username: `Ziji_${theme.replace("-", "_")}`,
      tag: "#0001",
      rank: "#1",
      level: 42,
      currentXp: 8500,
      requiredXp: 10000,
      balance: "1,250,000",
      avatar: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
      theme,
    });
    await saveFile(
      path.join(dirs.profile, `profile-${theme}.png`),
      card,
      `Profile: ${theme}`,
    );
  } catch (err) {
    console.error(`  ❌ Failed Profile theme [${theme}]:`, err?.message || err);
  }
}

/* =========================================================================
   2. SONG SEARCH CARDS (All 6 Layouts)
   ========================================================================= */
console.log("\n📦 [2/6] Rendering Song Search Cards (6 Layouts)...");

const SONG_LAYOUTS = [
  "showcase",
  "compact-queue",
  "grid",
  "list",
  "classic",
  "auto",
];

const SAMPLE_SONGS = [
  {
    title: "Nightcall (Drive OST)",
    author: "Kavinsky",
    time: "4:19",
    views: "245M views",
    avatar: "https://i.ytimg.com/vi/ZBEbyx-iV0g/hq720.jpg",
  },
  {
    title: "Resonance (Synthwave Master)",
    author: "HOME",
    time: "3:32",
    views: "189M views",
    avatar: "https://i.ytimg.com/vi/8GW6sLrK40k/hq720.jpg",
  },
  {
    title: "After Dark (Cyberpunk Edit)",
    author: "Mr.Kitty",
    time: "4:17",
    views: "320M views",
    avatar: "https://i.ytimg.com/vi/J3lpbDk0X5w/hq720.jpg",
  },
  {
    title: "Starboy",
    author: "The Weeknd ft. Daft Punk",
    time: "3:50",
    views: "2.1B views",
    avatar: "https://i.ytimg.com/vi/aiargMxSKbA/hq720.jpg",
  },
];

for (const layout of SONG_LAYOUTS) {
  try {
    const card = await studio.song({
      title: `TOP HITS // ${layout.toUpperCase()}`,
      layout,
      items: SAMPLE_SONGS,
    });
    await saveFile(
      path.join(dirs.song, `song-${layout}.png`),
      card,
      `Song: ${layout}`,
    );
  } catch (err) {
    console.error(`  ❌ Failed Song layout [${layout}]:`, err?.message || err);
  }
}

/* =========================================================================
   3. LEADERBOARD CARDS (All 8 Layouts)
   ========================================================================= */
console.log("\n📦 [3/6] Rendering Leaderboard Cards (8 Layouts)...");

const LEADERBOARD_LAYOUTS = [
  "podium",
  "compact-list",
  "cyber-grid",
  "minimal-cards",
  "versus-duel",
  "hall-of-fame",
  "tier-division",
  "terminal-matrix",
];

const SAMPLE_PLAYERS = [
  {
    rank: 1,
    username: "TenZ",
    handle: "@tenz_aim",
    avatar: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
    level: 99,
    xp: 98500,
  },
  {
    rank: 2,
    username: "Aspas",
    handle: "@aspas_duelist",
    avatar: "https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
    level: 95,
    xp: 92400,
  },
  {
    rank: 3,
    username: "Derke",
    handle: "@derke_entry",
    avatar: "https://i.ytimg.com/vi/rUxyKA_-grg/hq720.jpg",
    level: 91,
    xp: 87100,
  },
  {
    rank: 4,
    username: "Chronicle",
    handle: "@chronicle_flex",
    avatar: "https://i.ytimg.com/vi/DWcJFNfaw9c/hq720.jpg",
    level: 88,
    xp: 81200,
  },
  {
    rank: 5,
    username: "Jinggg",
    handle: "@jinggg_raze",
    avatar: "https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg",
    level: 85,
    xp: 76500,
  },
  {
    rank: 6,
    username: "Boaster",
    handle: "@boaster_igl",
    avatar: "https://i.ytimg.com/vi/7NOSDKb0HlU/hq720.jpg",
    level: 82,
    xp: 71000,
  },
];

for (const layout of LEADERBOARD_LAYOUTS) {
  try {
    const card = await studio.leaderboard({
      guildName: "VCT Radiant Masters",
      guildIcon: "https://i.ytimg.com/vi/NRRXrZnhT5s/hq720.jpg",
      season: "SEASON 4 FINALS",
      layout,
      items: SAMPLE_PLAYERS,
    });
    await saveFile(
      path.join(dirs.leaderboard, `leaderboard-${layout}.png`),
      card,
      `Leaderboard: ${layout}`,
    );
  } catch (err) {
    console.error(
      `  ❌ Failed Leaderboard layout [${layout}]:`,
      err?.message || err,
    );
  }
}

/* =========================================================================
   4. QUOTE CARDS (All 8 Layouts)
   ========================================================================= */
console.log("\n📦 [4/6] Rendering Quote Cards (8 Layouts)...");

const QUOTE_LAYOUTS = [
  "split-portrait",
  "centered-minimal",
  "modern-card",
  "neon-cyber",
  "magazine-editorial",
  "polaroid-vintage",
  "speech-bubble",
  "code-terminal",
];

const QUOTE_SAMPLES = {
  "split-portrait": {
    author: "Steve Jobs",
    quote:
      "The people who are crazy enough to think they can change the world are the ones who do.",
    tag: "Apple Co-founder",
  },
  "centered-minimal": {
    author: "Marcus Aurelius",
    quote:
      "You have power over your mind - not outside events. Realize this, and you will find strength.",
    tag: "Roman Emperor",
  },
  "modern-card": {
    author: "Alan Turing",
    quote:
      "Sometimes it is the people no one can imagine anything of who do things no one can imagine.",
    tag: "Father of Computing",
  },
  "neon-cyber": {
    author: "Bruce Lee",
    quote:
      "Be like water making its way through cracks. Do not be assertive, but adjust to the object.",
    tag: "Martial Artist",
  },
  "magazine-editorial": {
    author: "Carl Sagan",
    quote: "Somewhere, something incredible is waiting to be known.",
    tag: "Cosmos Editorial",
  },
  "polaroid-vintage": {
    author: "Nikola Tesla",
    quote:
      "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.",
    tag: "Wardenclyffe 1901",
  },
  "speech-bubble": {
    author: "Miyamoto Musashi",
    quote:
      "There is nothing outside of yourself that can ever enable you to get better, stronger, richer, quicker, or smarter.",
    tag: "Book of Five Rings",
  },
  "code-terminal": {
    author: "Linus Torvalds",
    quote: "Talk is cheap. Show me the code.",
    tag: "Linux & Git Creator",
  },
};

for (const layout of QUOTE_LAYOUTS) {
  try {
    const sample = QUOTE_SAMPLES[layout] || {
      author: "Anonymous",
      quote: "Simplicity is the ultimate sophistication.",
      tag: "Wisdom",
    };
    const card = await studio.quote({
      quote: sample.quote,
      author: sample.author,
      handle: `@${sample.author.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
      tag: sample.tag,
      avatar: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
      layout,
    });
    await saveFile(
      path.join(dirs.quote, `quote-${layout}.png`),
      card,
      `Quote: ${layout}`,
    );
  } catch (err) {
    console.error(`  ❌ Failed Quote layout [${layout}]:`, err?.message || err);
  }
}

/* =========================================================================
   5. BUILT-IN ANIMATION PATTERNS (15 Patterns: Frames & GIFs)
   ========================================================================= */
console.log(
  "\n📦 [5/6] Rendering Built-in Animation Patterns (15 Patterns)...",
);

const BUILTIN_IDS = [
  "welcome",
  "cyber-rotation",
  "music",
  "rank-up",
  "spark-magic",
  "sakura-petals",
  "music-neon",
  "cyber-bento-hud",
  "hacker-terminal",
  "space-boarding-pass",
  "vinyl-turntable",
  "tcg-hologram",
  "vs-battle-duel",
  "gacha-lootbox",
  "retro-synthwave-sunset",
];

for (const patternId of BUILTIN_IDS) {
  const pattern = patterns[patternId];
  if (!pattern) {
    console.warn(`  ⚠️ Pattern [${patternId}] not found in patterns registry.`);
    continue;
  }

  const variables = {
    userName: "Ziji",
    guildName: "Arcana Legends",
    userAVTurl: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
  };

  try {
    // 1. Render PNG Frame
    const frame = await studio.framePattern(pattern, {
      time: Math.round((pattern.duration || 1500) * 0.4),
      variables,
    });
    await saveFile(
      path.join(dirs.patternsFrames, `${patternId}-frame.png`),
      frame,
      `Frame: ${patternId}`,
    );

    // 2. Render Animated GIF
    const animation = await studio.animatePattern(pattern, {
      variables,
      format: "gif",
      fps: 10,
      duration: Math.min(pattern.duration || 1200, 1200),
    });
    await saveFile(
      path.join(dirs.patternsAnimations, `${patternId}.gif`),
      animation,
      `GIF: ${patternId}`,
    );
  } catch (err) {
    console.error(`  ❌ Failed Pattern [${patternId}]:`, err?.message || err);
  }
}

/* =========================================================================
   6. CUSTOM INLINE PATTERN (On-Demand StudioPattern Request)
   ========================================================================= */
console.log("\n📦 [6/6] Rendering Custom Inline StudioPattern Request...");

const customPattern = {
  id: "welcome-card-animation",
  name: "Welcome Card Animation",
  description: "Pattern created dynamically in Image Studio (930x280)",
  duration: 500,
  fps: 12,
  format: "gif",
  defaultVariables: {
    userAVTurl: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
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

try {
  // Frame PNG
  const frame = await studio.framePattern(customPattern, {
    time: 20,
    variables: { userName: "ziji" },
  });
  await saveFile(
    path.join(dirs.custom, "welcome-custom-frame.png"),
    frame,
    "Custom: Frame @ 20ms",
  );

  // Animated GIF
  const animation = await studio.animatePattern(customPattern, {
    variables: { userName: "ziji" },
    format: "gif",
  });
  await saveFile(
    path.join(dirs.custom, "welcome-custom-animation.gif"),
    animation,
    "Custom: Animated GIF",
  );
} catch (err) {
  console.error("  ❌ Failed Custom Inline Pattern:", err?.message || err);
}

/* =========================================================================
   SUMMARY REPORT
   ========================================================================= */
const elapsedSec = ((Date.now() - stats.start) / 1000).toFixed(2);
const totalMb = (stats.totalBytes / (1024 * 1024)).toFixed(2);

console.log(
  "\n===============================================================",
);
console.log("🎉 Build Complete!");
console.log(`⏱️  Elapsed Time: ${elapsedSec}s`);
console.log(`📄 Total Files Generated: ${stats.totalFiles}`);
console.log(`💾 Total Output Size: ${totalMb} MB`);
console.log(`📂 Output Root: ${outputDir}`);
console.log(
  "===============================================================\n",
);
