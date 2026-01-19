# System Documentation

This directory contains comprehensive technical documentation for the Ripples project, designed to help both developers and AI agents understand the codebase structure, patterns, and conventions.

## Documentation Index

### Core Documentation

- **[Technology Stack](stack.md)** - Complete overview of all technologies, frameworks, and tools used in the project
  - **When to consult**: When you need to understand what libraries/versions are available, build tools, testing frameworks, or deployment configuration

### Standards & Patterns

#### API Standards

- **[Fastify API Patterns](standards/fastify-api-patterns.md)** - Fastify plugin architecture, route registration, and request handling
  - **When to consult**: When creating new API endpoints, plugins, or modifying backend code

#### Frontend Standards

- **[React Component Patterns](standards/react-component-patterns.md)** - React component structure, in-source testing, and styling conventions
  - **When to consult**: When creating or modifying React components, setting up component tests, or applying styles

#### Monorepo Standards

- **[Nx Workspace Patterns](standards/nx-workspace-patterns.md)** - Project structure, task configuration, and dependency management
  - **When to consult**: When adding new apps/libraries, configuring build tasks, or managing cross-project dependencies

#### Testing Standards

- **[Testing Patterns](standards/testing-patterns.md)** - Unit testing with Vitest and E2E testing with Playwright
  - **When to consult**: When writing tests, setting up test configurations, or debugging test failures

#### Code Quality Standards

- **[TypeScript & Code Quality](standards/typescript-quality-patterns.md)** - TypeScript configuration, strict mode, ESLint rules, and code style
  - **When to consult**: When resolving type errors, configuring linting, or understanding project code conventions

## Quick Navigation

### Common Tasks

- **Adding a new API endpoint** → See [Fastify API Patterns](standards/fastify-api-patterns.md#creating-new-routes)
- **Creating a React component** → See [React Component Patterns](standards/react-component-patterns.md#component-structure)
- **Adding a new library/app** → See [Nx Workspace Patterns](standards/nx-workspace-patterns.md#adding-projects)
- **Writing unit tests** → See [Testing Patterns](standards/testing-patterns.md#unit-testing-with-vitest)
- **Running E2E tests** → See [Testing Patterns](standards/testing-patterns.md#e2e-testing-with-playwright)
- **Understanding TypeScript config** → See [TypeScript & Code Quality](standards/typescript-quality-patterns.md#typescript-configuration)

### For AI Agents

When working on tasks in this codebase:

1. Start with [CLAUDE.md](../../CLAUDE.md) in the project root for high-level context and common commands
2. Check [stack.md](stack.md) to understand available tools and versions
3. Consult relevant standards files for implementation patterns
4. Always follow the code style conventions in [TypeScript & Code Quality](standards/typescript-quality-patterns.md)

### For Human Developers

- Quick reference: [CLAUDE.md](../../CLAUDE.md)
- Architecture overview: [Technology Stack](stack.md)
- Detailed patterns: Browse the `standards/` directory

## Maintenance

This documentation should be updated whenever:

- New frameworks or major dependencies are added
- Architectural patterns change
- New conventions are established
- Build or deployment processes are modified

Last updated: 2026-01-19
