---
stack: Primary Technology Stack
version: 1.0.0
last_updated: 2026-01-19
---

# Technology Stack

## Frontend

- **Framework**: React 19.0.0
- **Language**: TypeScript 5.9.2
- **Build Tool**: Vite 7.0.0
- **Styling**: Tailwind CSS 3.4.3
- **Compiler**: SWC via @vitejs/plugin-react-swc
- **State Management**: Jotai
- **UI Components**: shadcn/ui with Base-UI

## Backend

- **Framework**: Fastify 5.2.1
- **Language**: TypeScript 5.9.2
- **Plugin System**: @fastify/autoload 6.0.3
- **Utilities**: @fastify/sensible 6.0.2
- **Build Tool**: esbuild 0.19.2 (CommonJS output)

## Testing

- **Unit Testing**: Vitest 4.0.0 with jsdom environment
- **E2E Testing**: Playwright 1.36.0
- **Code Coverage**: Vitest Coverage (v8 provider)
- **Testing Library**: @testing-library/react 16.3.0

## Build System

- **Monorepo**: Nx 22.3.3
- **Task Orchestration**: Plugin-based task inference
- **Package Manager**: pnpm 10.28.0 (required)
- **Caching**: Nx computation caching with namedInputs

## Code Quality

- **Linting**: ESLint 9.8.0 with flat config
- **Type Checking**: TypeScript strict mode with composite: true
- **Project References**: TypeScript project references enabled
- **Module Boundaries**: @nx/eslint-plugin enforcement

## Development

- **Node Runtime**: Node 20+
- **TypeScript Compiler**: tsc with declaration maps
- **Hot Reload**: Vite HMR for web, watch mode for API
- **In-source Testing**: Vitest supports in-source tests via import.meta.vitest

## Configuration Management

- **Environment Variables**:
  - API: `PORT` (default: 3000), `HOST` (default: localhost)
  - Web: Vite default ports (dev: 4200)
- **TypeScript**: Project references with composite builds
- **ESLint**: Flat config with module boundary enforcement

## Deployment

- **Web Build Output**: Static files → `apps/web/dist/`
- **API Build Output**: CommonJS modules → `apps/api/dist/`
- **Deployment Preparation**: Nx prune-lockfile and copy-workspace-modules tasks available
