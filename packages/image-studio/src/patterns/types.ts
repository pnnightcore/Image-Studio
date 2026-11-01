import type { CustomCanvasData, TrackData, AnimatedImageFormat } from "../types.js";

/**
 * A reusable visual template / animation pattern in Image Studio.
 *
 * Contains canvas configuration, keyframe tracks, default template variables,
 * and animation export settings.
 */
export interface StudioPattern {
  id: string;
  name: string;
  description?: string;
  duration?: number;
  fps?: number;
  format?: AnimatedImageFormat;
  canvas: CustomCanvasData;
  tracks?: TrackData[];
  defaultVariables?: Record<string, string>;
  category?: string;
  author?: string;
  createdAt?: string;
}

/**
 * Options when rendering an animation from a StudioPattern.
 */
export interface PatternRenderOptions {
  /** Override or provide template variables, e.g. `{ userName: "Alice" }`. */
  variables?: Record<string, string>;
  /** Override animation duration in milliseconds. */
  duration?: number;
  /** Override output framerate. */
  fps?: number;
  /** Override animation format ("gif" | "webp"). */
  format?: "gif" | "webp";
  /** Loop count (0 = infinite loop). */
  loop?: number;
}

/**
 * Options when extracting a single PNG frame from a StudioPattern.
 */
export interface PatternFrameOptions {
  /** Override or provide template variables. */
  variables?: Record<string, string>;
  /** Timestamp in milliseconds to capture as PNG frame. */
  time?: number;
  /** 0-based frame index to capture as PNG frame. */
  frame?: number;
}
