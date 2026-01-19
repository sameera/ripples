# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ripples is an Nx monorepo containing a full-stack TypeScript application:
- **Web**: React 19 frontend with Vite
- **API**: Fastify 5 backend with auto-loading plugins/routes
- **E2E**: Playwright test suite

## Common Commands

```bash
# Development servers
npx nx serve ripples         # Web app on :4200
npx nx serve api             # API server on :3000

# Building
npx nx build ripples         # Build web → apps/web/dist/
npx nx build api             # Build API → apps/api/dist/

# Testing
npx nx test ripples          # Run Vitest unit tests for web
npx nx e2e web-e2e           # Run Playwright E2E tests

# Linting and type checking
npx nx lint <project>        # ESLint
npx nx typecheck <project>   # TypeScript type check

# Utilities
npx nx graph                 # View dependency graph
npx nx show project <name>   # Show project configuration
```

## Architecture

### Apps Structure
- `apps/web/` - React frontend (Vite, Tailwind CSS, Vitest)
- `apps/api/` - Fastify backend (esbuild, CommonJS output)
- `apps/web-e2e/` - Playwright tests targeting web app
- `libs/` - Shared libraries (workspace configured but empty)

### API Plugin Pattern
The API uses Fastify's auto-load pattern:
- `apps/api/src/app/plugins/` - Reusable Fastify plugins
- `apps/api/src/app/routes/` - Route handlers (auto-registered)

Entry: `apps/api/src/main.ts` → `apps/api/src/app/app.ts`

### Web Entry
`apps/web/src/main.tsx` → `apps/web/src/app/app.tsx`

## Tech Stack

- **Package Manager**: pnpm 10.28.0 (required)
- **Build**: Nx 22.3.3 with plugin-based task inference
- **TypeScript**: 5.9.2 with strict mode
- **Frontend**: React 19, Vite 7, Tailwind CSS 3.4
- **Backend**: Fastify 5.2, esbuild
- **Testing**: Vitest 4 (unit), Playwright 1.36 (E2E)
- **Linting**: ESLint 9 with flat config

## Code Style

- Use double quotes for strings
- Tab width is 4 spaces (use spaces, not tabs)
- Always use TypeScript with explicit type annotations
- Use semicolons explicitly
- No AI generation attribution comments

## Configuration Notes

- Nx caches tasks based on `namedInputs` in `nx.json`
- ESLint enforces module boundaries between projects
- TypeScript uses `composite: true` with project references
- Vitest uses jsdom environment for web tests
- API configurable via `PORT` and `HOST` environment variables
