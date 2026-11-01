# AGENTS.md

## Repo overview

Image Studio is a full-stack image generation project for social cards, profile/leaderboard banners, animated GIF/WebP output, and custom canvas generation. The main app uses Vite + React, a Node/Express-compatible runtime, and edge/serverless API handlers.

## Key paths

- `src/`: app logic, rendering pipelines, shared utilities
- `api/`: route handlers for serverless execution
- `server.ts`: local runtime entry point
- `packages/image-studio/`: published SDK package
  - `src/patterns/`: pre-bundled starter patterns (`welcome`, `music`, `rank-up`, etc.), registry, and types (`StudioPattern`)
  - `src/client.ts`: client implementation (`animatePattern`, `framePattern`, `resolvePattern`)
- `docs/` and `README.md`: product and API documentation
- `test/` and `packages/image-studio/test/`: validation coverage

## Patterns architecture & Web-to-SDK export

- **`StudioPattern`**: A typed visual blueprint containing `canvas` (elements, particles, background), `tracks` (keyframes, easing curves), timeline settings (`duration`, `fps`, `format`), and `defaultVariables`.
- **SDK Execution**: `studio.animatePattern(pattern, options)` and `studio.framePattern(pattern, options)` support:
  1. Built-in pattern IDs (`"welcome"`, `"cyber-rotation"`, etc.)
  2. Direct `StudioPattern` objects (imported from a downloaded `.ts` file or declared in code)
  3. Remote HTTP/HTTPS URLs (fetches pattern JSON dynamically from GitHub, CDN, S3, or Gist)
  4. Raw JSON strings
- **Web Export Workflow**: End-users design patterns on the web app (`/animation`) and export to their own project:
  - Native browser save (`window.showSaveFilePicker`): writes `my-banner.ts` or `my-banner.json` directly into the user's project folder.
  - Direct file download (`.ts` / `.json`) or clipboard copy.
  - Exported TypeScript modules import from the published package: `import type { StudioPattern } from "image-studio";`.
- **Maintainer Presets Sync**: Run `npm run export:patterns` to synchronize starter animation presets from `src/lib/animation-presets.ts` into `packages/image-studio/src/patterns/`.

## Rules for AI contributors

- Keep changes narrow and aligned with the existing architecture.
- Do not introduce broad refactors or unrelated cleanup while fixing a task.
- Preserve API contracts and generated image metadata semantics.
- Update docs and tests when behavior changes.
- Prefer TypeScript typing and explicit validation.
- For changes in the SDK package, keep compatibility with Node 18+, browsers, Bun, Deno, and Cloudflare Workers.

## Validation

Run the smallest relevant check:
- `npm run typecheck` for TypeScript validation
- `npm run smoke:handlers` for API/server smoke checks
- `npm --prefix packages/image-studio test` for SDK unit tests
- `npm run sdk:build` when packaging or export changes are involved

## Notes

This repo has both frontend and backend responsibilities. Keep server, contract, and SDK behavior in sync whenever you touch generation endpoints or payload validation.
