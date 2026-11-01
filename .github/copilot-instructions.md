# Copilot Instructions for Image Studio

## Project overview

This repository is a full-stack visual generation app for social cards, leaderboard/profile banners, animated media, and custom canvas generation. The app mixes a Vite/React frontend with a Node server and edge-friendly API handlers. Keep scope tight and respect the existing architecture.

Primary entry points:
- `src/` for the main app logic and shared rendering code
- `api/` for serverless route handlers used by Vercel/Netlify/Express
- `public/` and `server.ts` for the runtime web app / preview server
- `packages/image-studio/` for the standalone SDK package
- `docs/` and `README.md` for product/API docs

## Architecture guidance

- Prefer editing the smallest relevant module instead of broad refactors.
- Keep server-side rendering and validation logic aligned with the contract in `src/server/contract.ts`.
- If you change API behavior, update corresponding docs and any SDK contract tests in `packages/image-studio/test/`.
- Treat the SDK package as a separately published module: changes to its API surface or runtime behavior should remain backward-compatible unless the task explicitly calls for a breaking change.
- When adding or changing generated image types, preserve the same input/output contract used by the API and image generation pipeline.

## Coding conventions

- Use TypeScript and keep types explicit where needed.
- Prefer existing helper functions and naming patterns already used in the repo.
- Avoid introducing new runtime dependencies unless the task truly requires it.
- Preserve ESM/CJS compatibility for the published SDK package in `packages/image-studio`.
- Keep API payload validation, error mapping, and response metadata consistent across routes and SDK usage.

## Validation workflow

Before considering a task complete, run the smallest relevant validation:
- For app/server changes: `npm run typecheck` or `npm run lint` if available.
- For API/contract work: run relevant smoke or test scripts, such as `npm run smoke:handlers`.
- For SDK work: run `npm --prefix packages/image-studio test` and, when relevant, `npm run sdk:build`.
- If a change affects both server and SDK, validate both sides together.

## Documentation expectations

- Update README/docs when behavior, routes, payloads, or SDK usage materially change.
- Keep examples aligned with the real API contract and current package names.
- When adding AI-facing instructions, prefer clear, actionable guidance over generic boilerplate.

## Working style for future tasks

- Focus on the actual request, not unrelated cleanup.
- Keep changes surgical and easy to review.
- Validate behavior with the smallest command that checks the changed area.
- If you discover a bug coupled to the current task, fix it even if it is nearby and directly relevant.

## Important repo-specific notes

- The root app uses Vite + React + Express/edge handlers; keep frontend and server concerns separate.
- Image generation logic is sensitive to output format, render timing, and metadata headers; do not silently change response semantics.
- The generated SDK package is expected to support Node 18+, Bun, Deno, Cloudflare Workers, and browsers.
- This repo has both dynamic API templates and static/generated asset behavior; preserve compatibility with those environments.
