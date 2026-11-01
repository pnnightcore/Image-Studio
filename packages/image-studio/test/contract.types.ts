/**
 * Compile-time contract check between the SDK wire types and the server types.
 * Picked up by the repo-level `tsc --noEmit` (npm run typecheck): if either side changes a field,
 * this file stops compiling.
 */
import type * as Server from "../../../src/lib/types";
import type * as Sdk from "../src/types";

type Mutual<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
type Assert<T extends true> = T;

export type _Song = Assert<Mutual<Sdk.SongRequest, Server.SongGenerateRequest>>;
export type _Profile = Assert<Mutual<Sdk.ProfileRequest, Server.ProfileGenerateRequest>>;
export type _Leaderboard = Assert<Mutual<Sdk.LeaderboardRequest, Server.LeaderboardGenerateRequest>>;
export type _Quote = Assert<Mutual<Sdk.QuoteRequest, Server.QuoteGenerateRequest>>;
export type _Custom = Assert<Mutual<Sdk.CustomRequest, Server.CustomGenerateRequest>>;
export type _Animated = Assert<Mutual<Sdk.AnimatedRequest, Server.AnimatedGenerateRequest>>;
export type _Particle = Assert<Mutual<Sdk.ParticleConfig, Server.ParticleConfig>>;
// every SDK request must be accepted by the server union
export type _Union = Assert<[Sdk.GenerateRequest] extends [Server.AnyGenerateRequest] ? true : false>;
