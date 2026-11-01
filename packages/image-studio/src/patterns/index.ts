import type { StudioPattern } from "./types.js";
import { cyberBentoHudPattern } from "./cyber-bento-hud.js";
import { cyberRotationPattern } from "./cyber-rotation.js";
import { gachaLootboxPattern } from "./gacha-lootbox.js";
import { hackerTerminalPattern } from "./hacker-terminal.js";
import { musicPattern } from "./music.js";
import { musicNeonPattern } from "./music-neon.js";
import { rankUpPattern } from "./rank-up.js";
import { retroSynthwaveSunsetPattern } from "./retro-synthwave-sunset.js";
import { sakuraPetalsPattern } from "./sakura-petals.js";
import { spaceBoardingPassPattern } from "./space-boarding-pass.js";
import { sparkMagicPattern } from "./spark-magic.js";
import { tcgHologramPattern } from "./tcg-hologram.js";
import { vinylTurntablePattern } from "./vinyl-turntable.js";
import { vsBattleDuelPattern } from "./vs-battle-duel.js";
import { welcomePattern } from "./welcome.js";
import { welcomeCardAnimationPattern } from "./welcome-card-animation.js";

export * from "./types.js";
export {
  cyberBentoHudPattern,
  cyberRotationPattern,
  gachaLootboxPattern,
  hackerTerminalPattern,
  musicPattern,
  musicNeonPattern,
  rankUpPattern,
  retroSynthwaveSunsetPattern,
  sakuraPetalsPattern,
  spaceBoardingPassPattern,
  sparkMagicPattern,
  tcgHologramPattern,
  vinylTurntablePattern,
  vsBattleDuelPattern,
  welcomePattern,
  welcomeCardAnimationPattern,
};

export const patterns: Record<string, StudioPattern> = {
  "cyber-bento-hud": cyberBentoHudPattern,
  "cyber-rotation": cyberRotationPattern,
  "gacha-lootbox": gachaLootboxPattern,
  "hacker-terminal": hackerTerminalPattern,
  "music": musicPattern,
  "music-neon": musicNeonPattern,
  "rank-up": rankUpPattern,
  "retro-synthwave-sunset": retroSynthwaveSunsetPattern,
  "sakura-petals": sakuraPetalsPattern,
  "space-boarding-pass": spaceBoardingPassPattern,
  "spark-magic": sparkMagicPattern,
  "tcg-hologram": tcgHologramPattern,
  "vinyl-turntable": vinylTurntablePattern,
  "vs-battle-duel": vsBattleDuelPattern,
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
