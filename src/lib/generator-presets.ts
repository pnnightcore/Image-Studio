import type {
  SongResult,
  ProfileData,
  LeaderboardData,
  QuoteData,
  SongLayout,
} from "./types";
import { sampleSongs } from "./sample-data";

export interface StoredPreset<T = any> {
  id: string;
  name: string;
  description: string;
  category: "builtin" | "user";
  createdAt?: string;
  data: T;
  badge?: string;
}

export type PresetGeneratorType = "song" | "profile" | "leaderboard" | "quote";

// 1. Built-in Song Presets
export const BUILTIN_SONG_PRESETS: StoredPreset<{
  title: string;
  songs: SongResult[];
  layout: SongLayout;
}>[] = [
  {
    id: "song-lofi-list",
    name: "Lo-Fi Study (List)",
    description: "5 relaxing lo-fi beats in clean modern vertical list layout",
    category: "builtin",
    badge: "List · 5 Tracks",
    data: {
      title: "Lo-Fi Beats to Relax & Study",
      layout: "list",
      songs: sampleSongs.slice(0, 5).map((s, i) => ({ ...s, index: i + 1 })),
    },
  },
  {
    id: "song-chill-grid",
    name: "Summer Chill (Grid)",
    description: "6 vibrant tracks in compact 2-column grid cards",
    category: "builtin",
    badge: "Grid · 6 Tracks",
    data: {
      title: "Summer Chill Vibes 2026",
      layout: "grid",
      songs: sampleSongs.slice(0, 6).map((s, i) => ({ ...s, index: i + 1 })),
    },
  },
  {
    id: "song-classic-compact",
    name: "Trending Hits (Classic)",
    description: "4 top tracks in classic Discord bot style banner",
    category: "builtin",
    badge: "Classic · 4 Tracks",
    data: {
      title: "Trending Music Search",
      layout: "classic",
      songs: sampleSongs.slice(0, 4).map((s, i) => ({ ...s, index: i + 1 })),
    },
  },
  {
    id: "song-mega-auto",
    name: "Mega Playlist (Auto 12)",
    description:
      "12 curated tracks with automated responsive sizing (12 tracks -> dual column list)",
    category: "builtin",
    badge: "Auto · 12 Tracks",
    data: {
      title: "Essential Study Vibes (Top 12)",
      layout: "auto",
      songs: sampleSongs.slice(0, 12).map((s, i) => ({ ...s, index: i + 1 })),
    },
  },
  {
    id: "song-synthwave-showcase",
    name: "Synthwave Outrun (Showcase)",
    description:
      "Featured #1 hero track with retro wave visualizer + 5 cyber sub-tracks",
    category: "builtin",
    badge: "Showcase · 6 Tracks",
    data: {
      title: "Cyberpunk 2077 Night Drive",
      layout: "showcase",
      songs: [
        {
          index: 1,
          avatar: "https://i.ytimg.com/vi/0fCckxq7css/hqdefault.jpg",
          displayName: "Resonance - HOME (Outrun Master)",
          time: "3:32",
          source: "youtube",
          author: "Astral Throb",
          views: "45M views",
        },
        {
          index: 2,
          avatar: "https://i.ytimg.com/vi/5NVKHu6LzlQ/hq720.jpg",
          displayName: "Nightcall - Kavinsky (Drive OST)",
          time: "4:19",
          source: "youtube",
          author: "Record Makers",
          views: "280M views",
        },
        {
          index: 3,
          avatar: "https://i.ytimg.com/vi/DWcJFNfaw9c/hq720.jpg",
          displayName: "Turbo Killer - Carpenter Brut",
          time: "3:28",
          source: "youtube",
          author: "No Quarter Prod",
          views: "35M views",
        },
        {
          index: 4,
          avatar: "https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
          displayName: "After Dark - Mr.Kitty (Synth Edition)",
          time: "4:18",
          source: "youtube",
          author: "Negative Gain",
          views: "110M views",
        },
        {
          index: 5,
          avatar: "https://i.ytimg.com/vi/rUxyKA_-grg/hq720.jpg",
          displayName: "Tech Noir - Gunship",
          time: "4:57",
          source: "youtube",
          author: "INgrooves",
          views: "18M views",
        },
        {
          index: 6,
          avatar: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
          displayName: "Days of Thunder - The Midnight",
          time: "4:30",
          source: "youtube",
          author: "Silk Music",
          views: "22M views",
        },
      ],
    },
  },
  {
    id: "song-acoustic-queue",
    name: "Acoustic Coffeehouse (Queue)",
    description:
      "5 cozy warm acoustic indie melodies in clean single-column queue",
    category: "builtin",
    badge: "Queue · 5 Tracks",
    data: {
      title: "Warm Coffee & Acoustic Mornings",
      layout: "compact-queue",
      songs: [
        {
          index: 1,
          avatar: "https://i.ytimg.com/vi/ygHUmlIYWe8/hq720.jpg",
          displayName: "Coffee Shop Acoustic & Ambient Rain",
          time: "02:10:00",
          source: "youtube",
          author: "Chill Select",
          views: "950K views",
        },
        {
          index: 2,
          avatar: "https://i.ytimg.com/vi/NRRXrZnhT5s/hq720.jpg",
          displayName: "Autumn Leaves Guitar & Lo-fi Bass",
          time: "00:36:50",
          source: "youtube",
          author: "Acoustic Beats",
          views: "640K views",
        },
        {
          index: 3,
          avatar: "https://i.ytimg.com/vi/rUxyKA_-grg/hq720.jpg",
          displayName: "Vintage Vinyl Warm Crackle Session",
          time: "01:24:30",
          source: "youtube",
          author: "Dusty Needle Co.",
          views: "710K views",
        },
        {
          index: 4,
          avatar: "https://i.ytimg.com/vi/vRLSlcuD07U/hq720.jpg",
          displayName: "Warm Sunlight Sunday Morning Vibes",
          time: "00:38:40",
          source: "youtube",
          author: "Sunny Side Beats",
          views: "420K views",
        },
        {
          index: 5,
          avatar: "https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg",
          displayName: "Cloudy Sky Afternoon Dream",
          time: "00:48:15",
          source: "youtube",
          author: "Dream State",
          views: "530K views",
        },
      ],
    },
  },
  {
    id: "song-orchestral-classic",
    name: "Epic Orchestral (Classic)",
    description:
      "4 cinematic fantasy orchestral symphonies in classic Discord banner",
    category: "builtin",
    badge: "Classic · 4 Tracks",
    data: {
      title: "Legends of Arcana Epic Symphony",
      layout: "classic",
      songs: [
        {
          index: 1,
          avatar: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
          displayName: "Star Sky - Two Steps From Hell",
          time: "5:30",
          source: "youtube",
          author: "Extreme Music",
          views: "85M views",
        },
        {
          index: 2,
          avatar: "https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
          displayName: "Victory - Two Steps From Hell (Battle Mix)",
          time: "5:20",
          source: "youtube",
          author: "Extreme Music",
          views: "120M views",
        },
        {
          index: 3,
          avatar: "https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg",
          displayName: "Heart of Courage - Thomas Bergersen",
          time: "1:58",
          source: "youtube",
          author: "TSFH Records",
          views: "95M views",
        },
        {
          index: 4,
          avatar: "https://i.ytimg.com/vi/DWcJFNfaw9c/hq720.jpg",
          displayName: "Dragon Rider - Audiomachine",
          time: "1:54",
          source: "youtube",
          author: "Audiomachine",
          views: "42M views",
        },
      ],
    },
  },
  {
    id: "song-anime-showcase",
    name: "Anime Battle OST (Showcase)",
    description:
      "Featured #1 anime anthem hero track + 7 high-energy battle soundtracks",
    category: "builtin",
    badge: "Showcase · 8 Tracks",
    data: {
      title: "Ultimate Anime Battle Anthems",
      layout: "showcase",
      songs: [
        {
          index: 1,
          avatar: "https://i.ytimg.com/vi/n61ULEU7SU0/hq720.jpg",
          displayName: "Gurenge - LiSA (Demon Slayer OP)",
          time: "3:58",
          source: "youtube",
          author: "SACRA MUSIC",
          views: "140M views",
        },
        {
          index: 2,
          avatar: "https://i.ytimg.com/vi/7NOSDKb0HlU/hq720.jpg",
          displayName: "Kaikai Kitan - Eve (Jujutsu Kaisen OP)",
          time: "3:40",
          source: "youtube",
          author: "TOY'S FACTORY",
          views: "185M views",
        },
        {
          index: 3,
          avatar: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
          displayName: "Idol - YOASOBI (Oshi no Ko OP)",
          time: "3:34",
          source: "youtube",
          author: "Sony Music",
          views: "420M views",
        },
        {
          index: 4,
          avatar: "https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
          displayName: "Kick Back - Kenshi Yonezu (Chainsaw Man)",
          time: "3:13",
          source: "youtube",
          author: "SME Records",
          views: "160M views",
        },
        {
          index: 5,
          avatar: "https://i.ytimg.com/vi/rUxyKA_-grg/hq720.jpg",
          displayName: "Unravel - TK from Ling Tosite Sigure",
          time: "3:59",
          source: "youtube",
          author: "Sony Music",
          views: "230M views",
        },
        {
          index: 6,
          avatar: "https://i.ytimg.com/vi/DWcJFNfaw9c/hq720.jpg",
          displayName: "Blue Bird - Ikimonogakari (Naruto Shippuden)",
          time: "3:38",
          source: "youtube",
          author: "Epic Records",
          views: "98M views",
        },
        {
          index: 7,
          avatar: "https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg",
          displayName: "Peace Sign - Kenshi Yonezu (MHA OP)",
          time: "4:01",
          source: "youtube",
          author: "SME Records",
          views: "210M views",
        },
        {
          index: 8,
          avatar: "https://i.ytimg.com/vi/1_C_Z9xT1m8/hq720.jpg",
          displayName: "Silhouette - KANA-BOON (Naruto OP)",
          time: "4:00",
          source: "youtube",
          author: "Ki/oon Music",
          views: "290M views",
        },
      ],
    },
  },
];

// 2. Built-in Profile Presets
export const BUILTIN_PROFILE_PRESETS: StoredPreset<ProfileData>[] = [
  {
    id: "profile-ruby-legend",
    name: "Ruby Poly Legend",
    description:
      "Rank #1 elite player with geometric ruby backdrop and 13K gold",
    category: "builtin",
    badge: "Ruby · Lv.16",
    data: {
      username: "__ziji",
      balance: "13,080 xu",
      avatar: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
      level: 16,
      currentXp: 350,
      requiredXp: 800,
      rank: "#1",
      theme: "ruby-poly",
      title: "Ruby Grandmaster",
      badge: "★ TOP 1 GUILD",
    },
  },
  {
    id: "profile-cyber-samurai",
    name: "Cyber Neon Samurai",
    description:
      "Futuristic neon purple & cyan theme with tech stats and cyber grid",
    category: "builtin",
    badge: "Cyber · Lv.42",
    data: {
      username: "Neon_Kenshi",
      balance: "85,400 xu",
      avatar: "https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
      level: 42,
      currentXp: 3200,
      requiredXp: 4000,
      rank: "#3",
      theme: "cyber-neon",
      title: "Neon Infiltrator",
      badge: "⚡ CYBER RONIN",
    },
  },
  {
    id: "profile-glass-emerald",
    name: "Glassmorphic Emerald",
    description:
      "Clean frosted glass aesthetic with emerald aurora and circular glow",
    category: "builtin",
    badge: "Glass · Lv.99",
    data: {
      username: "AetherLord",
      balance: "1,250,000 xu",
      avatar: "https://i.ytimg.com/vi/rUxyKA_-grg/hq720.jpg",
      level: 99,
      currentXp: 9500,
      requiredXp: 10000,
      rank: "#1",
      theme: "glass-minimal",
      title: "Aura Champion",
      badge: "✦ EMERALD AURA",
    },
  },
  {
    id: "profile-gold-legend",
    name: "Imperial Gold Legend",
    description:
      "Majestic imperial gold & dark obsidian with crowned warrior stats",
    category: "builtin",
    badge: "Gold · Lv.80",
    data: {
      username: "Aurelius_Rex",
      balance: "540,000 xu",
      avatar: "https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg",
      level: 80,
      currentXp: 6800,
      requiredXp: 7500,
      rank: "#2",
      theme: "gold-legend",
      title: "Imperial Vanguard",
      badge: "👑 IMPERIAL AETHER",
    },
  },
  {
    id: "profile-cosmic-void",
    name: "Cosmic Void Sovereign",
    description:
      "Ascended astral ruler with deep purple starlight aura & singluarity core",
    category: "builtin",
    badge: "Cosmic · Lv.88",
    data: {
      username: "Astral_Valkyrie",
      balance: "3,500,000 xu",
      avatar: "https://i.ytimg.com/vi/rUxyKA_-grg/hq720.jpg",
      level: 88,
      currentXp: 8400,
      requiredXp: 9000,
      rank: "#1",
      theme: "cosmic-void",
      title: "Cosmic Realm Ruler",
      badge: "🌌 VOID SOVEREIGN",
    },
  },
  {
    id: "profile-frost-monarch",
    name: "Glacial Frost Monarch",
    description:
      "Crystalline arctic frost aesthetic with cryogenic permafrost glow",
    category: "builtin",
    badge: "Glacier · Lv.75",
    data: {
      username: "Cryo_Empress",
      balance: "1,880,000 xu",
      avatar: "https://i.ytimg.com/vi/DWcJFNfaw9c/hq720.jpg",
      level: 75,
      currentXp: 6900,
      requiredXp: 7500,
      rank: "#1",
      theme: "frost-glacier",
      title: "Crown of Eternal Winter",
      badge: "❄️ FROST MONARCH",
    },
  },
  {
    id: "profile-matrix-hacker",
    name: "Neon Overdrive Hacker",
    description:
      "Matrix hacker dossier with green terminal CLI and buffer telemetry",
    category: "builtin",
    badge: "Terminal · Lv.64",
    data: {
      username: "Zero_Day_Ghost",
      balance: "982,500 xu",
      avatar: "https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg",
      level: 64,
      currentXp: 4800,
      requiredXp: 6000,
      rank: "#2",
      theme: "hacker-terminal",
      title: "Cyber Systems Architect",
      badge: "⚡ ROOT PRIVILEGE",
    },
  },
  {
    id: "profile-sakura-ronin",
    name: "Sakura Blossom Duelist",
    description:
      "Japanese anime bushido warrior with delicate cherry blossom petals and Dan ranking",
    category: "builtin",
    badge: "Sakura · Lv.55",
    data: {
      username: "Hana_Kenshin",
      balance: "420,000 xu",
      avatar: "https://i.ytimg.com/vi/n61ULEU7SU0/hq720.jpg",
      level: 55,
      currentXp: 4200,
      requiredXp: 5000,
      rank: "#3",
      theme: "sakura-duelist",
      title: "Wind of Cherry Petals",
      badge: "🌸 BLOSSOM MASTER",
    },
  },
];

// 3. Built-in Leaderboard Presets
export const BUILTIN_LEADERBOARD_PRESETS: StoredPreset<LeaderboardData>[] = [
  {
    id: "lb-championship-podium",
    name: "Championship Podium (Top 10)",
    description:
      "Full guild leaderboard with 3D top 3 podium & Season 1 banner",
    category: "builtin",
    badge: "Podium · 10 Players",
    data: {
      guildName: "Legends of Arcana",
      guildIcon: "https://i.ytimg.com/vi/NRRXrZnhT5s/hq720.jpg",
      season: "SEASON 1",
      layout: "podium",
      items: [
        {
          rank: 1,
          username: "Ziji",
          handle: "@xxxxxxziji",
          avatar: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
          level: 16,
          xp: 8250,
        },
        {
          rank: 2,
          username: "ShadowFang",
          handle: "@shadow_ninja",
          avatar: "https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
          level: 14,
          xp: 7100,
        },
        {
          rank: 3,
          username: "Valkyrie",
          handle: "@valk_queen",
          avatar: "https://i.ytimg.com/vi/rUxyKA_-grg/hq720.jpg",
          level: 12,
          xp: 5800,
        },
        {
          rank: 4,
          username: "CyberRonin",
          handle: "@ronin99",
          avatar: "https://i.ytimg.com/vi/DWcJFNfaw9c/hq720.jpg",
          level: 10,
          xp: 4300,
        },
        {
          rank: 5,
          username: "FrostBite",
          handle: "@frosty",
          avatar: "https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg",
          level: 9,
          xp: 3900,
        },
        {
          rank: 6,
          username: "Phoenix",
          handle: "@firebird",
          avatar: "https://i.ytimg.com/vi/7NOSDKb0HlU/hq720.jpg",
          level: 8,
          xp: 3400,
        },
        {
          rank: 7,
          username: "NovaStrike",
          handle: "@nova_star",
          avatar: "https://i.ytimg.com/vi/n61ULEU7SU0/hq720.jpg",
          level: 7,
          xp: 2800,
        },
        {
          rank: 8,
          username: "IronClad",
          handle: "@iron_tank",
          avatar: "https://i.ytimg.com/vi/1_C_Z9xT1m8/hq720.jpg",
          level: 6,
          xp: 2100,
        },
        {
          rank: 9,
          username: "BlazeRider",
          handle: "@blaze",
          avatar: "https://i.ytimg.com/vi/aGSYKFb_zxg/hq720.jpg",
          level: 5,
          xp: 1600,
        },
        {
          rank: 10,
          username: "StormSeeker",
          handle: "@storm",
          avatar: "https://i.ytimg.com/vi/gGEyRz0x7Kk/hq720.jpg",
          level: 4,
          xp: 1100,
        },
      ],
    },
  },
  {
    id: "lb-compact-list",
    name: "Streamlined List (Compact)",
    description:
      "High-density clean list with medal badges 🥇🥈🥉 and sleek rows",
    category: "builtin",
    badge: "List · 6 Players",
    data: {
      guildName: "Grand Masters Arena",
      guildIcon: "https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
      season: "GLOBAL RANK",
      layout: "compact-list",
      items: [
        {
          rank: 1,
          username: "AetherKing",
          handle: "@aether_1",
          avatar: "https://i.ytimg.com/vi/rUxyKA_-grg/hq720.jpg",
          level: 50,
          xp: 48900,
        },
        {
          rank: 2,
          username: "SilverBlade",
          handle: "@silver_blade",
          avatar: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
          level: 46,
          xp: 42100,
        },
        {
          rank: 3,
          username: "CrimsonNova",
          handle: "@crimson_x",
          avatar: "https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg",
          level: 41,
          xp: 37500,
        },
        {
          rank: 4,
          username: "ValkyriePrime",
          handle: "@valk_prime",
          avatar: "https://i.ytimg.com/vi/DWcJFNfaw9c/hq720.jpg",
          level: 38,
          xp: 32000,
        },
        {
          rank: 5,
          username: "ZenithHunter",
          handle: "@zenith",
          avatar: "https://i.ytimg.com/vi/7NOSDKb0HlU/hq720.jpg",
          level: 34,
          xp: 27400,
        },
        {
          rank: 6,
          username: "NightStalker",
          handle: "@stalker",
          avatar: "https://i.ytimg.com/vi/n61ULEU7SU0/hq720.jpg",
          level: 30,
          xp: 23100,
        },
      ],
    },
  },
  {
    id: "lb-cyber-grid",
    name: "Cyber Neon Grid",
    description:
      "Cyberpunk 2-column battle grid with glowing rank tiles & neon accents",
    category: "builtin",
    badge: "Cyber Grid · 6 Players",
    data: {
      guildName: "Neo Tokyo Speedrunners",
      guildIcon: "https://i.ytimg.com/vi/DWcJFNfaw9c/hq720.jpg",
      season: "CYBER TOURNEY",
      layout: "cyber-grid",
      items: [
        {
          rank: 1,
          username: "WarlordThor",
          handle: "@thor_hammer",
          avatar: "https://i.ytimg.com/vi/DWcJFNfaw9c/hq720.jpg",
          level: 30,
          xp: 19800,
        },
        {
          rank: 2,
          username: "OdinSpear",
          handle: "@odin_all",
          avatar: "https://i.ytimg.com/vi/7NOSDKb0HlU/hq720.jpg",
          level: 28,
          xp: 17200,
        },
        {
          rank: 3,
          username: "LokiTrickster",
          handle: "@loki_chaos",
          avatar: "https://i.ytimg.com/vi/n61ULEU7SU0/hq720.jpg",
          level: 25,
          xp: 14500,
        },
        {
          rank: 4,
          username: "FreyaFalcon",
          handle: "@freya_wings",
          avatar: "https://i.ytimg.com/vi/1_C_Z9xT1m8/hq720.jpg",
          level: 22,
          xp: 11900,
        },
        {
          rank: 5,
          username: "HeimdallGaze",
          handle: "@bifrost",
          avatar: "https://i.ytimg.com/vi/aGSYKFb_zxg/hq720.jpg",
          level: 20,
          xp: 9800,
        },
        {
          rank: 6,
          username: "TyrJustice",
          handle: "@tyr_blade",
          avatar: "https://i.ytimg.com/vi/gGEyRz0x7Kk/hq720.jpg",
          level: 18,
          xp: 8400,
        },
      ],
    },
  },
  {
    id: "lb-frosted-cards",
    name: "Frosted Glass Cards (Top 8)",
    description:
      "Modern cards with individual XP progress tracks and neon accents",
    category: "builtin",
    badge: "Frosted · 8 Players",
    data: {
      guildName: "Celestial Esports Guild",
      guildIcon: "https://i.ytimg.com/vi/rUxyKA_-grg/hq720.jpg",
      season: "CHAMPIONSHIP 2026",
      layout: "minimal-cards",
      items: [
        {
          rank: 1,
          username: "AstralKirin",
          handle: "@kirin_prime",
          avatar: "https://i.ytimg.com/vi/rUxyKA_-grg/hq720.jpg",
          level: 60,
          xp: 58200,
        },
        {
          rank: 2,
          username: "CyberRonin",
          handle: "@ronin_x",
          avatar: "https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
          level: 55,
          xp: 51400,
        },
        {
          rank: 3,
          username: "SolarisBlaze",
          handle: "@solaris",
          avatar: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
          level: 49,
          xp: 44800,
        },
        {
          rank: 4,
          username: "ValkyrieAce",
          handle: "@valk_ace",
          avatar: "https://i.ytimg.com/vi/DWcJFNfaw9c/hq720.jpg",
          level: 42,
          xp: 37900,
        },
        {
          rank: 5,
          username: "GlacierWolf",
          handle: "@glacier",
          avatar: "https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg",
          level: 38,
          xp: 31200,
        },
        {
          rank: 6,
          username: "ZephyrWind",
          handle: "@zephyr",
          avatar: "https://i.ytimg.com/vi/7NOSDKb0HlU/hq720.jpg",
          level: 34,
          xp: 26500,
        },
        {
          rank: 7,
          username: "NightShade",
          handle: "@shade",
          avatar: "https://i.ytimg.com/vi/n61ULEU7SU0/hq720.jpg",
          level: 29,
          xp: 21800,
        },
        {
          rank: 8,
          username: "IronHeart",
          handle: "@iron_heart",
          avatar: "https://i.ytimg.com/vi/1_C_Z9xT1m8/hq720.jpg",
          level: 25,
          xp: 17600,
        },
      ],
    },
  },
  {
    id: "lb-radiant-championship",
    name: "VCT Radiant Rivalry (Versus Duel)",
    description:
      "Head-to-head #1 vs #2 battle clash arena with remaining contenders",
    category: "builtin",
    badge: "Versus Duel · 10 Players",
    data: {
      guildName: "VCT Radiant Masters",
      guildIcon: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
      season: "CLASH ARENA",
      layout: "versus-duel",
      items: [
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
        {
          rank: 7,
          username: "Cryocells",
          handle: "@cryo_op",
          avatar: "https://i.ytimg.com/vi/n61ULEU7SU0/hq720.jpg",
          level: 79,
          xp: 66200,
        },
        {
          rank: 8,
          username: "Yay",
          handle: "@el_diablo",
          avatar: "https://i.ytimg.com/vi/1_C_Z9xT1m8/hq720.jpg",
          level: 76,
          xp: 61800,
        },
        {
          rank: 9,
          username: "f0rsakeN",
          handle: "@forsaken_prx",
          avatar: "https://i.ytimg.com/vi/aGSYKFb_zxg/hq720.jpg",
          level: 73,
          xp: 57400,
        },
        {
          rank: 10,
          username: "cNed",
          handle: "@cned_sniper",
          avatar: "https://i.ytimg.com/vi/gGEyRz0x7Kk/hq720.jpg",
          level: 70,
          xp: 52900,
        },
      ],
    },
  },
  {
    id: "lb-cyber-speedrun",
    name: "Netrunner Live Recon (Terminal Matrix)",
    description:
      "Underground netrunner command center with live matrix XP stream",
    category: "builtin",
    badge: "Matrix Terminal · 6 Agents",
    data: {
      guildName: "Neo-Tokyo Netrunners",
      guildIcon: "https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
      season: "ROOT ACCESS",
      layout: "terminal-matrix",
      items: [
        {
          rank: 1,
          username: "GlitchSurfer",
          handle: "@glitch_01",
          avatar: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
          level: 68,
          xp: 64200,
        },
        {
          rank: 2,
          username: "FramePerfect",
          handle: "@frame_zero",
          avatar: "https://i.ytimg.com/vi/DWcJFNfaw9c/hq720.jpg",
          level: 65,
          xp: 59800,
        },
        {
          rank: 3,
          username: "ByteRacer",
          handle: "@byte_racer",
          avatar: "https://i.ytimg.com/vi/7NOSDKb0HlU/hq720.jpg",
          level: 61,
          xp: 54100,
        },
        {
          rank: 4,
          username: "WarpDrive",
          handle: "@warp_tas",
          avatar: "https://i.ytimg.com/vi/n61ULEU7SU0/hq720.jpg",
          level: 58,
          xp: 48900,
        },
        {
          rank: 5,
          username: "SubPixel",
          handle: "@sub_pixel",
          avatar: "https://i.ytimg.com/vi/1_C_Z9xT1m8/hq720.jpg",
          level: 54,
          xp: 43200,
        },
        {
          rank: 6,
          username: "NullPointer",
          handle: "@null_void",
          avatar: "https://i.ytimg.com/vi/aGSYKFb_zxg/hq720.jpg",
          level: 50,
          xp: 38600,
        },
      ],
    },
  },
  {
    id: "lb-mythic-dungeon",
    name: "Grand Sovereign Hall of Fame",
    description:
      "Grand champion golden centerpiece throne with royal guild knights",
    category: "builtin",
    badge: "Hall of Fame · 8 Knights",
    data: {
      guildName: "Echoes of Eternity",
      guildIcon: "https://i.ytimg.com/vi/rUxyKA_-grg/hq720.jpg",
      season: "SOVEREIGN THRONE",
      layout: "hall-of-fame",
      items: [
        {
          rank: 1,
          username: "AegisPaladin",
          handle: "@aegis_tank",
          avatar: "https://i.ytimg.com/vi/rUxyKA_-grg/hq720.jpg",
          level: 85,
          xp: 78900,
        },
        {
          rank: 2,
          username: "ArchmageZephyr",
          handle: "@zephyr_arc",
          avatar: "https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg",
          level: 82,
          xp: 74200,
        },
        {
          rank: 3,
          username: "ShadowStalker",
          handle: "@shadow_rogue",
          avatar: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
          level: 79,
          xp: 69800,
        },
        {
          rank: 4,
          username: "CelestialPriest",
          handle: "@celestial_heal",
          avatar: "https://i.ytimg.com/vi/DWcJFNfaw9c/hq720.jpg",
          level: 76,
          xp: 65400,
        },
        {
          rank: 5,
          username: "BloodBerserker",
          handle: "@blood_axe",
          avatar: "https://i.ytimg.com/vi/7NOSDKb0HlU/hq720.jpg",
          level: 73,
          xp: 61100,
        },
        {
          rank: 6,
          username: "VoidSummoner",
          handle: "@void_lock",
          avatar: "https://i.ytimg.com/vi/n61ULEU7SU0/hq720.jpg",
          level: 70,
          xp: 56900,
        },
        {
          rank: 7,
          username: "FrostWeaver",
          handle: "@frost_mage",
          avatar: "https://i.ytimg.com/vi/1_C_Z9xT1m8/hq720.jpg",
          level: 67,
          xp: 52300,
        },
        {
          rank: 8,
          username: "SolarDruid",
          handle: "@solar_nature",
          avatar: "https://i.ytimg.com/vi/aGSYKFb_zxg/hq720.jpg",
          level: 64,
          xp: 48000,
        },
      ],
    },
  },
  {
    id: "lb-diamond-cup",
    name: "Tier Division Matrix (S/A/B)",
    description:
      "Hierarchical tiers categorizing contenders into S-Tier, A-Tier, and B-Tier",
    category: "builtin",
    badge: "Tier Division · 6 Players",
    data: {
      guildName: "Aetheria High League",
      guildIcon: "https://i.ytimg.com/vi/DWcJFNfaw9c/hq720.jpg",
      season: "DIVISION FINALS",
      layout: "tier-division",
      items: [
        {
          rank: 1,
          username: "KirinLord",
          handle: "@kirin_apex",
          avatar: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
          level: 72,
          xp: 68400,
        },
        {
          rank: 2,
          username: "ValkyrieNova",
          handle: "@valk_nova",
          avatar: "https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
          level: 69,
          xp: 63100,
        },
        {
          rank: 3,
          username: "AuraBreaker",
          handle: "@aura_x",
          avatar: "https://i.ytimg.com/vi/rUxyKA_-grg/hq720.jpg",
          level: 66,
          xp: 58900,
        },
        {
          rank: 4,
          username: "FrostPhantom",
          handle: "@phantom_ice",
          avatar: "https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg",
          level: 62,
          xp: 53200,
        },
        {
          rank: 5,
          username: "SolarFlare",
          handle: "@solar_flare",
          avatar: "https://i.ytimg.com/vi/7NOSDKb0HlU/hq720.jpg",
          level: 59,
          xp: 48700,
        },
        {
          rank: 6,
          username: "IronTitan",
          handle: "@iron_titan",
          avatar: "https://i.ytimg.com/vi/n61ULEU7SU0/hq720.jpg",
          level: 55,
          xp: 44100,
        },
      ],
    },
  },
];

// 4. Built-in Quote Presets
export const BUILTIN_QUOTE_PRESETS: StoredPreset<QuoteData>[] = [
  {
    id: "quote-steve-jobs",
    name: "Steve Jobs (Split Cinema)",
    description:
      "Cinematic side-by-side portrait with horizontal gradient fade",
    category: "builtin",
    badge: "Split Cinema",
    data: {
      quote:
        "The people who are crazy enough to think they can change the world are the ones who do.",
      author: "Steve Jobs",
      handle: "@stevejobs",
      tag: "Apple Co-founder",
      avatar: "https://i.ytimg.com/vi/858Eq25HpXg/hq720.jpg",
      layout: "split-portrait",
    },
  },
  {
    id: "quote-marcus-aurelius",
    name: "Marcus Aurelius (Centered Editorial)",
    description:
      "Philosophical centered typography with quote watermark & verified seal",
    category: "builtin",
    badge: "Centered Editorial",
    data: {
      quote:
        "You have power over your mind - not outside events. Realize this, and you will find strength.",
      author: "Marcus Aurelius",
      handle: "@meditations",
      tag: "Roman Emperor & Stoic",
      avatar: "https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
      layout: "centered-minimal",
    },
  },
  {
    id: "quote-alan-turing",
    name: "Alan Turing (Modern Card)",
    description:
      "Frosted speech card with author pill header and highlighted quotation",
    category: "builtin",
    badge: "Modern Card",
    data: {
      quote:
        "Sometimes it is the people no one can imagine anything of who do things no one can imagine.",
      author: "Alan Turing",
      handle: "@alanturing",
      tag: "Father of Modern Computing",
      avatar: "https://i.ytimg.com/vi/rUxyKA_-grg/hq720.jpg",
      layout: "modern-card",
    },
  },
  {
    id: "quote-bruce-lee",
    name: "Bruce Lee (Cyberpunk Neon)",
    description:
      "Glowing neon cyan & gold cyber terminal card with neon author frame",
    category: "builtin",
    badge: "Neon Cyber",
    data: {
      quote:
        "Be like water making its way through cracks. Do not be assertive, but adjust to the object, and you shall find a way around or through it.",
      author: "Bruce Lee",
      handle: "@brucelee",
      tag: "Philosopher & Martial Artist",
      avatar: "https://i.ytimg.com/vi/DWcJFNfaw9c/hq720.jpg",
      layout: "neon-cyber",
    },
  },
  {
    id: "quote-carl-sagan",
    name: "Carl Sagan (Magazine Editorial)",
    description:
      "High-fashion TIME editorial spread with typography column & portrait archive",
    category: "builtin",
    badge: "Magazine Editorial",
    data: {
      quote: "Somewhere, something incredible is waiting to be known.",
      author: "Carl Sagan",
      handle: "@carlsagan",
      tag: "Cosmos Editorial 2026",
      avatar: "https://i.ytimg.com/vi/rUxyKA_-grg/hq720.jpg",
      layout: "magazine-editorial",
    },
  },
  {
    id: "quote-nikola-tesla",
    name: "Nikola Tesla (Vintage Polaroid)",
    description:
      "Authentic retro Polaroid snapshot with textured tape and handwritten archive quote",
    category: "builtin",
    badge: "Vintage Polaroid",
    data: {
      quote:
        "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.",
      author: "Nikola Tesla",
      handle: "@nikolatesla",
      tag: "Wardenclyffe 1901 Archive",
      avatar: "https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg",
      layout: "polaroid-vintage",
    },
  },
  {
    id: "quote-linus-torvalds",
    name: "Linus Torvalds (Code Terminal)",
    description:
      "Developer IDE quotation with line gutter, syntax highlight and git status",
    category: "builtin",
    badge: "Code Terminal",
    data: {
      quote: "Talk is cheap. Show me the code.",
      author: "Linus Torvalds",
      handle: "@torvalds",
      tag: "Linux & Git Creator",
      avatar: "https://i.ytimg.com/vi/DWcJFNfaw9c/hq720.jpg",
      layout: "code-terminal",
    },
  },
  {
    id: "quote-miyamoto-musashi",
    name: "Miyamoto Musashi (Speech Bubble)",
    description:
      "Vibrant manga dialog bubble with character cut-in avatar and comic border",
    category: "builtin",
    badge: "Manga Bubble",
    data: {
      quote:
        "There is nothing outside of yourself that can ever enable you to get better, stronger, richer, quicker, or smarter. Everything is within.",
      author: "Miyamoto Musashi",
      handle: "@musashi",
      tag: "The Book of Five Rings",
      avatar: "https://i.ytimg.com/vi/n61ULEU7SU0/hq720.jpg",
      layout: "speech-bubble",
    },
  },
];

// Helper: Get localStorage key for a generator
export function getStorageKey(type: PresetGeneratorType): string {
  return `image_studio_user_presets_${type}`;
}

// Helper: Read user presets from localStorage
export function loadUserPresets<T>(
  type: PresetGeneratorType,
): StoredPreset<T>[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getStorageKey(type));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Helper: Save a new user preset to localStorage
export function saveUserPreset<T>(
  type: PresetGeneratorType,
  name: string,
  description: string,
  data: T,
  badge?: string,
): StoredPreset<T> {
  const existing = loadUserPresets<T>(type);
  const newPreset: StoredPreset<T> = {
    id: `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name: name.trim() || `My Preset ${existing.length + 1}`,
    description:
      description.trim() || `Saved on ${new Date().toLocaleDateString()}`,
    category: "user",
    createdAt: new Date().toISOString(),
    data,
    badge: badge || "User Saved",
  };

  const updated = [newPreset, ...existing];
  try {
    localStorage.setItem(getStorageKey(type), JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save preset to localStorage:", err);
  }

  return newPreset;
}

// Helper: Delete a user preset
export function deleteUserPreset(
  type: PresetGeneratorType,
  presetId: string,
): void {
  const existing = loadUserPresets(type);
  const updated = existing.filter((p) => p.id !== presetId);
  try {
    localStorage.setItem(getStorageKey(type), JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to delete preset from localStorage:", err);
  }
}

// Helper: Get all built-in presets for a given generator type
export function getBuiltinPresets(type: PresetGeneratorType): StoredPreset[] {
  switch (type) {
    case "song":
      return BUILTIN_SONG_PRESETS;
    case "profile":
      return BUILTIN_PROFILE_PRESETS;
    case "leaderboard":
      return BUILTIN_LEADERBOARD_PRESETS;
    case "quote":
      return BUILTIN_QUOTE_PRESETS;
    default:
      return [];
  }
}
