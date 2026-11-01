import type { StudioPattern } from "./types.js";
import { cyberRotationPattern } from "./cyber-rotation.js";
import { musicPattern } from "./music.js";
import { musicNeonPattern } from "./music-neon.js";
import { rankUpPattern } from "./rank-up.js";
import { sakuraPetalsPattern } from "./sakura-petals.js";
import { sparkMagicPattern } from "./spark-magic.js";
import { welcomePattern } from "./welcome.js";
import { welcomeCardAnimationPattern } from "./welcome-card-animation.js";

export * from "./types.js";
export {
  cyberRotationPattern,
  musicPattern,
  musicNeonPattern,
  rankUpPattern,
  sakuraPetalsPattern,
  sparkMagicPattern,
  welcomePattern,
  welcomeCardAnimationPattern,
};

export const patterns: Record<string, StudioPattern> = {
  "cyber-rotation": cyberRotationPattern,
  "music": musicPattern,
  "music-neon": musicNeonPattern,
  "rank-up": rankUpPattern,
  "sakura-petals": sakuraPetalsPattern,
  "spark-magic": sparkMagicPattern,
  "welcome": welcomePattern,
  "welcome-card-animation": welcomeCardAnimationPattern,
};

/**
 * Retrieves a registered StudioPattern by ID.
 */
export function getPattern(id: string): StudioPattern | undefined {
  return patterns[id];
}

/**
 * Registers a new pattern into the runtime registry.
 */
export function registerPattern(pattern: StudioPattern): void {
  patterns[pattern.id] = pattern;
}

/**
 * Helper to define a typed StudioPattern.
 */
export function definePattern(pattern: StudioPattern): StudioPattern {
  return pattern;
}
