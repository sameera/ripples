---
standard: Nx Workspace Patterns
version: 1.0.0
last_updated: 2026-01-19
---

# Nx Workspace Patterns

This document describes the Nx monorepo structure, task configuration, and dependency management patterns in the Ripples project.

## Workspace Structure

```
ripples/
├── apps/
│   ├── web/              # React frontend (Vite)
│   ├── api/              # Fastify backend (esbuild)
│   └── web-e2e/          # Playwright E2E tests
├── libs/                 # Shared libraries (currently empty)
├── nx.json               # Nx configuration
├── package.json          # Workspace root package.json
├── pnpm-workspace.yaml   # pnpm workspace config
└── tsconfig.base.json    # Base TypeScript config
```

### Project Types

**Applications** (`apps/`):

- Deployable artifacts
- Each app has its own build output
- Examples: web (frontend), api (backend), web-e2e (tests)

**Libraries** (`libs/`):

- Shared code between applications
- Not directly deployable
- Can be published as npm packages

## Nx Configuration

### Global Configuration

**File**: [nx.json](../../../nx.json)

Key sections:

**Named Inputs** - Define file sets for caching:

```json
{
    "namedInputs": {
        "default": ["{projectRoot}/**/*", "sharedGlobals"],
        "production": [
            "default",
            "!{projectRoot}/.eslintrc.json",
            "!{projectRoot}/eslint.config.mjs",
            "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
            "!{projectRoot}/tsconfig.spec.json",
            "!{projectRoot}/src/test-setup.[jt]s"
        ],
        "sharedGlobals": []
    }
}
```

**Plugins** - Task inference via plugins:

```json
{
    "plugins": [
        {
            "plugin": "@nx/js/typescript",
            "options": {
                "typecheck": { "targetName": "typecheck" }
            }
        },
        { "plugin": "@nx/eslint/plugin" },
        { "plugin": "@nx/vite/plugin" },
        { "plugin": "@nx/vitest" },
        { "plugin": "@nx/playwright/plugin" }
    ]
}
```

**Target Defaults**:

```json
{
    "targetDefaults": {
        "test": {
            "dependsOn": ["^build"]
        },
        "@nx/esbuild:esbuild": {
            "cache": true,
            "dependsOn": ["^build"],
            "inputs": ["production", "^production"]
        }
    }
}
```

## Project Configuration

### Project Structure

Each project has a `project.json` file defining its targets and configuration.

**Example**: [apps/api/project.json](../../../apps/api/project.json)

```json
{
    "name": "api",
    "$schema": "../../node_modules/nx/schemas/project-schema.json",
    "sourceRoot": "apps/api/src",
    "projectType": "application",
    "tags": [],
    "targets": {
        "build": { ... },
        "serve": { ... }
    }
}
```

### Common Targets

**Build**:

```bash
npx nx build <project-name>
```

**Serve** (development):

```bash
npx nx serve <project-name>
```

**Test**:

```bash
npx nx test <project-name>
```

**Lint**:

```bash
npx nx lint <project-name>
```

**Type Check**:

```bash
npx nx typecheck <project-name>
```

## API-Specific Configuration

### Build Configuration

The API uses `@nx/esbuild` executor ([apps/api/project.json:8-43](../../../apps/api/project.json#L8-L43)):

```json
{
    "build": {
        "executor": "@nx/esbuild:esbuild",
        "outputs": ["{options.outputPath}"],
        "defaultConfiguration": "production",
        "options": {
            "platform": "node",
            "outputPath": "apps/api/dist",
            "format": ["cjs"],
            "bundle": false,
            "main": "apps/api/src/main.ts",
            "tsConfig": "apps/api/tsconfig.app.json",
            "assets": ["apps/api/src/assets"],
            "esbuildOptions": {
                "sourcemap": true,
                "outExtension": { ".js": ".js" }
            }
        }
    }
}
```

**Key options**:

- `platform: "node"` - Target Node.js runtime
- `format: ["cjs"]` - Output CommonJS modules
- `bundle: false` - Don't bundle dependencies
- `sourcemap: true` (dev) / `false` (prod)

### Deployment Targets

**Prune Lockfile**:

```bash
npx nx run api:prune-lockfile
```

Creates a pruned `pnpm-lock.yaml` with only API dependencies.

**Copy Workspace Modules**:

```bash
npx nx run api:copy-workspace-modules
```

Copies workspace dependencies to `dist/workspace_modules`.

**Combined Prune**:

```bash
npx nx run api:prune
```

Runs both prune-lockfile and copy-workspace-modules.

## Web App Configuration

### Build Configuration

The web app uses `@nx/vite` plugin with inferred tasks from [apps/web/vite.config.mts](../../../apps/web/vite.config.mts):

**Available targets**:

- `build` - Production build
- `serve` - Development server
- `preview` - Preview production build
- `test` - Run Vitest tests

**Dev server config**:

```typescript
server: {
    port: 4200,
    host: "localhost",
}
```

## Dependency Graph

### Viewing the Graph

```bash
npx nx graph
```

Opens an interactive dependency graph in the browser.

### Managing Dependencies

**Module Boundaries** enforced by ESLint ([eslint.config.mjs:24-40](../../../eslint.config.mjs#L24-L40)):

```javascript
{
    "@nx/enforce-module-boundaries": [
        "error",
        {
            enforceBuildableLibDependency: true,
            depConstraints: [
                {
                    sourceTag: "*",
                    onlyDependOnLibsWithTags: ["*"]
                }
            ]
        }
    ]
}
```

## Adding New Projects

### Adding an Application

```bash
# React app
npx nx g @nx/react:app my-app

# Node/Fastify app
npx nx g @nx/node:app my-api --framework=fastify

# E2E app
npx nx g @nx/playwright:configuration --project=my-app-e2e
```

### Adding a Library

```bash
# React library
npx nx g @nx/react:lib my-lib

# TypeScript library
npx nx g @nx/js:lib my-lib
```

### Nx Generators Configuration

Default generator options are in [nx.json:85-101](../../../nx.json#L85-L101):

```json
{
    "generators": {
        "@nx/react": {
            "application": {
                "babel": true,
                "style": "tailwind",
                "linter": "eslint",
                "bundler": "vite"
            },
            "component": {
                "style": "tailwind"
            }
        }
    }
}
```

## Caching & Performance

### Task Caching

Nx caches task outputs based on inputs:

- Input files (namedInputs)
- Environment variables
- Runtime versions

**Invalidating cache**:

```bash
npx nx reset
```

### Parallel Execution

Run multiple tasks in parallel:

```bash
npx nx run-many --target=build --all
npx nx run-many --target=test --projects=web,api
```

### Affected Commands

Run tasks only for affected projects:

```bash
npx nx affected:build
npx nx affected:test
npx nx affected:lint
```

Based on git changes since the base branch.

## TypeScript Project References

### Configuration

TypeScript uses `composite: true` ([tsconfig.base.json:3](../../../tsconfig.base.json#L3)):

```json
{
    "compilerOptions": {
        "composite": true,
        "declarationMap": true,
        "emitDeclarationOnly": true
    }
}
```

**Benefits**:

- Faster incremental builds
- Better IDE performance
- Type-only imports across projects

### Project References

Each app/lib has its own `tsconfig.json` extending `tsconfig.base.json`.

## Package Management

### pnpm Workspace

**File**: `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "libs/*"
```

### Installing Dependencies

**Workspace root**:

```bash
pnpm add -w <package>
```

**Specific project**:

```bash
pnpm add <package> --filter api
pnpm add <package> --filter web
```

**Dev dependencies**:

```bash
pnpm add -D <package> --filter api
```

## Useful Commands

### Project Info

```bash
# Show project details
npx nx show project api

# List all projects
npx nx show projects

# Show task configuration
npx nx show project api --web
```

### Running Tasks

```bash
# Run with specific configuration
npx nx build api --configuration=production

# Run with environment variables
PORT=8080 npx nx serve api

# Watch mode (for supported targets)
npx nx test web --watch
```

## Related Documentation

- [Technology Stack](../stack.md) - Nx version and plugins
- [TypeScript & Code Quality](typescript-quality-patterns.md) - TypeScript configuration
- [Fastify API Patterns](fastify-api-patterns.md) - API build details
- [React Component Patterns](react-component-patterns.md) - Web app build details
