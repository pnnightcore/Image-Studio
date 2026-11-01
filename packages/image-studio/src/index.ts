export { ImageStudio, createClient, assertAnimationLimits, DEFAULT_LIMITS } from "./client.js";
export type {
  ImageStudioOptions,
  SongInput,
  SongItemInput,
  ProfileInput,
  QuoteInput,
  LeaderboardInput,
  LeaderboardItemInput,
  PresetFrameOptions,
  PresetAnimationOptions,
} from "./client.js";
export { GeneratedImage, toImageSource, readImageSize } from "./image.js";
export type { ImageInput, GeneratedImageMeta } from "./image.js";
export { ImageStudioError, isImageStudioError } from "./errors.js";
export type { ImageStudioErrorCode, AttemptInfo } from "./errors.js";
export type { CallOptions } from "./transport.js";
export { BUILTIN_PRESET_IDS } from "./types.js";
export type * from "./types.js";
