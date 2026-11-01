/**
 * Wire types of the Image Studio API.
 *
 * These mirror `src/lib/types.ts` of the server. `test/contract.types.ts` (checked by the
 * repo-level `tsc`) fails to compile if the two drift apart.
 */

/* ---------------------------------------------------------------- particles */
export type ParticleShape = "circle" | "spark" | "petal" | "snow" | "fire" | "star" | "music";
export type ParticlePresetId = "spark" | "petals" | "snow" | "fire" | "stars" | "music";
export interface ParticleConfig {
  count: number;
  size: number;
  speed: number;
  direction: number;
  spread: number;
  gravity: number;
  opacity: number;
  lifetime: number;
  color: string;
  colorSecondary?: string;
  shape?: ParticleShape;
  preset?: ParticlePresetId;
  glow?: boolean;
}

/* --------------------------------------------------------------------- song */
export interface SongResult { index: number; avatar: string; displayName: string; time: string; source: string; author?: string; views?: string }
export type SongLayout = "auto" | "list" | "grid" | "classic";
export interface SongRequest { type?: "song"; title: string; items: SongResult[]; layout?: SongLayout; particleConfig?: ParticleConfig }

/* ------------------------------------------------------------------ profile */
export type ProfileTheme = "ruby-poly" | "cyber-neon" | "glass-minimal" | "gold-legend";
export interface ProfileData {
  username: string; balance: string; avatar: string; level: number; currentXp: number; requiredXp: number; rank: string;
  theme?: ProfileTheme; badge?: string; title?: string; particleConfig?: ParticleConfig;
}
export interface ProfileRequest { type: "profile"; data: ProfileData; particleConfig?: ParticleConfig }

/* -------------------------------------------------------------- leaderboard */
export type LeaderboardLayout = "podium" | "compact-list" | "cyber-grid" | "minimal-cards";
export interface LeaderboardItem { rank: number; username: string; handle: string; avatar: string; level: number; xp: number }
export interface LeaderboardData { guildIcon: string; guildName?: string; season?: string; items: LeaderboardItem[]; layout?: LeaderboardLayout; particleConfig?: ParticleConfig }
export interface LeaderboardRequest { type: "leaderboard"; data: LeaderboardData; particleConfig?: ParticleConfig }

/* -------------------------------------------------------------------- quote */
export type QuoteLayout = "split-portrait" | "centered-minimal" | "modern-card" | "neon-cyber";
export interface QuoteData { quote: string; author: string; handle: string; tag: string; avatar: string; layout?: QuoteLayout; particleConfig?: ParticleConfig }
export interface QuoteRequest { type: "quote"; data: QuoteData; particleConfig?: ParticleConfig }

/* ------------------------------------------------------------------- custom */
export type CustomElementType = "text" | "image" | "avatar" | "badge" | "progress" | "box" | "particle";
export interface Transform { x: number; y: number; width: number; height: number; rotation: number; scaleX: number; scaleY: number; anchorX: number; anchorY: number }
export interface CustomElement {
  id: string; type: CustomElementType; x: number; y: number; width: number; height: number;
  content?: string; color?: string; backgroundColor?: string; fontSize?: number; fontWeight?: number;
  borderRadius?: number; border?: string; opacity?: number; zIndex?: number; progressPercent?: number;
  progressColor?: string; imageUrl?: string; textAlign?: "left" | "center" | "right";
  textShadow?: string; shadowEnabled?: boolean; shadowColor?: string; shadowBlur?: number; shadowOffsetX?: number; shadowOffsetY?: number;
  glowEnabled?: boolean; glowColor?: string; glowBlur?: number; glowIntensity?: "soft" | "medium" | "neon";
  rotation?: number; scaleX?: number; scaleY?: number; anchorX?: number; anchorY?: number; transform?: Transform;
  blur?: number; brightness?: number; saturation?: number; contrast?: number;
  letterSpacing?: number; lineHeight?: number; particleConfig?: ParticleConfig;
}
export interface CustomCanvasData {
  title: string; width: number; height: number; background: string; elements: CustomElement[];
  /** Optional animated background image URL (PNG/JPEG/GIF everywhere; WebP only on Node hosts). */
  backgroundImageUrl?: string;
  particleSystem?: ParticleConfig;
}
export interface CustomRequest { type: "custom"; data: CustomCanvasData }

/* ----------------------------------------------------------------- animated */
export type AnimatedImageFormat = "gif" | "webp" | "png";
export type Easing = "ease-in-out" | "linear" | "ease-in" | "ease-out" | "bounce" | "elastic" | "spring";
export interface KeyframeData {
  id?: string; time: number; easing?: Easing;
  x?: number; y?: number; width?: number; height?: number; rotation?: number; scaleX?: number; scaleY?: number; anchorX?: number; anchorY?: number;
  transform?: Partial<Transform>;
  opacity?: number; blur?: number; brightness?: number; saturation?: number; contrast?: number;
  color?: string; backgroundColor?: string; glowColor?: string; glowBlur?: number;
  fontSize?: number; letterSpacing?: number; lineHeight?: number; textShadow?: string;
}
export interface TrackData { elementId: string; keyframes: KeyframeData[] }
export interface AnimatedData {
  title: string;
  format?: AnimatedImageFormat;
  loop?: number;
  frameIndex?: number;
  frameTime?: number;
  /** Baked frames (every frame must have the same size) */
  frames?: CustomCanvasData[];
  delay?: number | number[];
  /** Compact timeline: one canvas + keyframe tracks */
  canvas?: CustomCanvasData;
  tracks?: TrackData[];
  duration?: number;
  fps?: number;
  templateVariables?: Record<string, string>;
}
export interface AnimatedRequest { type: "animated"; data: AnimatedData }

export type GenerateRequest = SongRequest | ProfileRequest | LeaderboardRequest | QuoteRequest | CustomRequest | AnimatedRequest;

/* ------------------------------------------------------- server capabilities */
export const BUILTIN_PRESET_IDS = ["welcome", "cyber-rotation", "music", "rank-up", "spark-magic", "sakura-petals", "music-neon"] as const;
export type PresetId = (typeof BUILTIN_PRESET_IDS)[number];

export interface ServerStats {
  totalGenerated: number;
  lastGeneratedAt: string | null;
  runtime?: "node" | "cloudflare";
  formats?: Array<"png" | "gif" | "webp">;
  limits?: { maxFrames: number; maxDurationMs: number; maxLoop: number };
  presets?: string[];
}
