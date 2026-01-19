---
standard: Fastify API Patterns
version: 1.0.0
last_updated: 2026-01-19
---

# Fastify API Patterns

This document describes the patterns and conventions for building API endpoints using Fastify in the Ripples project.

## Architecture Overview

The API uses Fastify's auto-load plugin pattern for modular route and plugin organization.

### Entry Points

```
apps/api/src/main.ts       → Server instantiation and startup
apps/api/src/app/app.ts    → Application plugin registration
```

**Main Server Setup** ([apps/api/src/main.ts](../../../apps/api/src/main.ts)):

```typescript
import Fastify from "fastify";
import { app } from "./app/app";

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = Fastify({
    logger: true,
});

server.register(app);

server.listen({ port, host }, (err) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    } else {
        console.log(`[ ready ] http://${host}:${port}`);
    }
});
```

## Plugin Architecture

### Auto-Load Pattern

The app uses `@fastify/autoload` to automatically register plugins and routes ([apps/api/src/app/app.ts](../../../apps/api/src/app/app.ts)):

```typescript
import * as path from "path";
import { FastifyInstance } from "fastify";
import AutoLoad from "@fastify/autoload";

export interface AppOptions {}

export async function app(fastify: FastifyInstance, opts: AppOptions) {
    // Load all plugins (support plugins that are reused)
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, "plugins"),
        options: { ...opts },
    });

    // Load all routes
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, "routes"),
        options: { ...opts },
    });
}
```

### Plugin Types

**Support Plugins** (`apps/api/src/app/plugins/`):

- Reusable plugins for common functionality
- Wrapped with `fastify-plugin` (fp) to expose decorators/hooks to parent scope
- Example: sensible plugin for HTTP error utilities

**Route Plugins** (`apps/api/src/app/routes/`):

- Define HTTP endpoints
- Exported as default async functions
- Auto-registered by AutoLoad

## Creating New Routes

### Basic Route Pattern

**Location**: `apps/api/src/app/routes/`

**Example** ([apps/api/src/app/routes/root.ts](../../../apps/api/src/app/routes/root.ts)):

```typescript
import { FastifyInstance } from "fastify";

export default async function(fastify: FastifyInstance) {
    fastify.get("/", async function() {
        return { message: "Hello API" };
    });
}
```

### Route File Naming

- Use kebab-case for route files: `user-profile.ts`, `auth.ts`
- File structure mirrors URL structure where possible
- Root routes: `root.ts`

### Adding New Routes

1. Create a new file in `apps/api/src/app/routes/`
2. Export a default async function taking `FastifyInstance`
3. Register routes using `fastify.get()`, `fastify.post()`, etc.
4. Routes will be automatically loaded on server start

**Example - Creating a new endpoint**:

```typescript
// apps/api/src/app/routes/users.ts
import { FastifyInstance } from "fastify";

export default async function(fastify: FastifyInstance) {
    fastify.get("/users", async function() {
        return { users: [] };
    });

    fastify.get("/users/:id", async function(request) {
        const { id } = request.params as { id: string };
        return { user: { id } };
    });

    fastify.post("/users", async function(request) {
        const body = request.body;
        return { created: true, data: body };
    });
}
```

## Creating Support Plugins

### Plugin Pattern

**Location**: `apps/api/src/app/plugins/`

**Example** ([apps/api/src/app/plugins/sensible.ts](../../../apps/api/src/app/plugins/sensible.ts)):

```typescript
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import sensible from "@fastify/sensible";

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async function(fastify: FastifyInstance) {
    fastify.register(sensible);
});
```

### When to Use `fastify-plugin`

- Use `fp()` wrapper when the plugin needs to expose decorators, hooks, or utilities to the parent scope
- Without `fp()`, plugin encapsulation prevents parent access to decorators
- Most support plugins should use `fp()`

## Environment Configuration

### Available Variables

- `HOST` - Server host (default: `localhost`)
- `PORT` - Server port (default: `3000`)

**Usage**:

```bash
HOST=0.0.0.0 PORT=8080 npx nx serve api
```

## Error Handling

The `@fastify/sensible` plugin is registered globally, providing:

- `fastify.httpErrors.*` - Pre-built HTTP error constructors
- `fastify.assert()` - Assertion utilities
- Common HTTP status code helpers

**Example**:

```typescript
fastify.get("/users/:id", async function(request, reply) {
    const { id } = request.params as { id: string };
    const user = await findUser(id);

    if (!user) {
        throw fastify.httpErrors.notFound("User not found");
    }

    return { user };
});
```

## Type Safety

### Request Typing

Use TypeScript generics for type-safe request parameters:

```typescript
import { FastifyInstance, FastifyRequest } from "fastify";

interface UserParams {
    id: string;
}

interface UserBody {
    name: string;
    email: string;
}

export default async function(fastify: FastifyInstance) {
    fastify.get<{ Params: UserParams }>("/users/:id", async (request) => {
        const { id } = request.params; // TypeScript knows id is a string
        return { userId: id };
    });

    fastify.post<{ Body: UserBody }>("/users", async (request) => {
        const { name, email } = request.body; // Typed
        return { created: true, name, email };
    });
}
```

## Testing API Endpoints

API endpoints should be tested through E2E tests in the `web-e2e` project, or by creating a dedicated `api-e2e` project.

For local testing during development:

1. Start the API: `npx nx serve api`
2. Make requests to `http://localhost:3000`

## Related Documentation

- [Technology Stack](../stack.md) - Fastify version and dependencies
- [Testing Patterns](testing-patterns.md) - E2E testing approaches
- [Nx Workspace Patterns](nx-workspace-patterns.md) - API build configuration
