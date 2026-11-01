# AGENTS.md

## Repo overview

Image Studio is a full-stack image generation project for social cards, profile/leaderboard banners, animated GIF/WebP output, and custom canvas generation. The main app uses Vite + React, a Node/Express-compatible runtime, and edge/serverless API handlers.

## Key paths

- `src/`: app logic, rendering pipelines, shared utilities
- `api/`: route handlers for serverless execution
- `server.ts`: local runtime entry point
- `packages/image-studio/`: published SDK package
- `docs/` and `README.md`: product and API documentation
- `test/` and `packages/image-studio/test/`: validation coverage

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
