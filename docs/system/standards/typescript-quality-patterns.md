---
standard: TypeScript & Code Quality
version: 1.0.0
last_updated: 2026-01-19
---

# TypeScript & Code Quality

This document describes TypeScript configuration, ESLint rules, and code style conventions for the Ripples project.

## TypeScript Configuration

### Base Configuration

**File**: [tsconfig.base.json](../../../tsconfig.base.json)

```json
{
    "compilerOptions": {
        "composite": true,
        "declarationMap": true,
        "emitDeclarationOnly": true,
        "importHelpers": true,
        "isolatedModules": true,
        "lib": ["es2022"],
        "module": "esnext",
        "moduleResolution": "bundler",
        "noEmitOnError": true,
        "noFallthroughCasesInSwitch": true,
        "noImplicitOverride": true,
        "noImplicitReturns": true,
        "noUnusedLocals": true,
        "skipLibCheck": true,
        "strict": true,
        "target": "es2022",
        "customConditions": ["@ripples/source"]
    }
}
```

### Key Compiler Options

**Strict Type Checking**:

- `strict: true` - Enables all strict type checking options
- `noImplicitReturns: true` - Requires return values in all code paths
- `noUnusedLocals: true` - Reports unused local variables
- `noFallthroughCasesInSwitch: true` - Requires breaks in switch statements

**Module System**:

- `module: "esnext"` - Use ES modules
- `moduleResolution: "bundler"` - Bundler-style resolution (Vite/esbuild)
- `isolatedModules: true` - Required for esbuild/SWC

**Project References**:

- `composite: true` - Enable TypeScript project references
- `declarationMap: true` - Generate .d.ts.map files for IDE navigation
- `emitDeclarationOnly: true` - Only emit .d.ts files (build tools handle JS)

### Project-Specific Configuration

Each project extends `tsconfig.base.json`:

**Web App** ([apps/web/tsconfig.app.json](../../../apps/web/tsconfig.app.json)):

```json
{
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "outDir": "./out-tsc/build",
        "types": ["vite/client"]
    },
    "files": [],
    "include": ["src/**/*.ts", "src/**/*.tsx"],
    "exclude": ["src/**/*.spec.ts", "src/**/*.spec.tsx"]
}
```

**API** ([apps/api/tsconfig.app.json](../../../apps/api/tsconfig.app.json)):

```json
{
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "outDir": "./out-tsc/build",
        "module": "commonjs",
        "types": ["node"]
    },
    "exclude": ["src/**/*.spec.ts"],
    "include": ["src/**/*.ts"]
}
```

Note: API uses `module: "commonjs"` to match esbuild output format.

## Type Safety Guidelines

### Explicit Type Annotations

Always provide explicit type annotations for:

- Function parameters
- Function return types
- Component props
- Complex object shapes

**Good**:

```typescript
function calculateTotal(items: Item[]): number {
    return items.reduce((sum, item) => sum + item.price, 0);
}

interface UserProfileProps {
    userId: string;
    displayName: string;
}

function UserProfile({ userId, displayName }: UserProfileProps): JSX.Element {
    return <div>{displayName}</div>;
}
```

**Avoid**:

```typescript
// Implicit types - avoid when possible
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Avoid `any`

Use `unknown` instead of `any` when type is truly unknown:

```typescript
// Bad
function processData(data: any) {
    return data.value; // No type safety
}

// Good
function processData(data: unknown) {
    if (typeof data === "object" && data !== null && "value" in data) {
        return (data as { value: string }).value;
    }
    throw new Error("Invalid data");
}
```

### Prefer Type Inference Where Appropriate

TypeScript can infer simple types:

```typescript
// Type inference is fine here
const count = 42; // number
const message = "Hello"; // string
const items = [1, 2, 3]; // number[]

// But be explicit for function signatures
function greet(name: string): string {
    return `Hello, ${name}`;
}
```

### Strict Null Checks

With `strict: true`, handle nullable values explicitly:

```typescript
function findUser(id: string): User | undefined {
    return users.find(u => u.id === id);
}

const user = findUser("123");
if (user) {
    console.log(user.name); // Safe - user is narrowed to User
}

// Or use optional chaining
console.log(user?.name);

// Or nullish coalescing
const name = user?.name ?? "Unknown";
```

## ESLint Configuration

### Configuration File

**File**: [eslint.config.mjs](../../../eslint.config.mjs)

```javascript
import nx from "@nx/eslint-plugin";

export default [
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
    {
        ignores: [
            "**/dist",
            "**/out-tsc",
            "**/vite.config.*.timestamp*",
            "**/vitest.config.*.timestamp*",
            "**/test-output"
        ]
    },
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        rules: {
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
    }
];
```

### Module Boundaries

The `@nx/enforce-module-boundaries` rule prevents:

- Apps importing from other apps
- Libraries with incompatible tags depending on each other
- Circular dependencies

**Example violation**:

```typescript
// apps/web/src/app/app.tsx
import { someFunction } from "../../../api/src/app/utils"; // ❌ Cross-app import
```

**Correct approach**:

```typescript
// Move shared code to a library
// libs/shared/utils/src/lib/utils.ts
export function someFunction() { ... }

// Both apps can import from the library
import { someFunction } from "@ripples/shared/utils";
```

### Running Linter

```bash
# Lint a specific project
npx nx lint web
npx nx lint api

# Lint all projects
npx nx run-many --target=lint --all

# Auto-fix issues
npx nx lint web --fix
```

## Code Style Conventions

### String Quotes

Use **double quotes** for strings:

```typescript
const message = "Hello, world";
const name = "John";
```

### Semicolons

Use **explicit semicolons**:

```typescript
const x = 42;
const y = "hello";
```

### Indentation

Use **4 spaces** (not tabs):

```typescript
function example() {
    if (condition) {
        doSomething();
    }
}
```

### Naming Conventions

**Variables and functions**: camelCase

```typescript
const userName = "John";
function calculateTotal() { ... }
```

**Types and interfaces**: PascalCase

```typescript
interface UserProfile { ... }
type ResponseData = { ... };
```

**Constants**: UPPER_SNAKE_CASE (for true constants)

```typescript
const API_BASE_URL = "https://api.example.com";
const MAX_RETRIES = 3;
```

**Components**: PascalCase

```typescript
function UserProfile() { ... }
export function NavBar() { ... }
```

**Files**:

- Components: PascalCase (`UserProfile.tsx`)
- Utilities: kebab-case (`user-utils.ts`)
- Routes: kebab-case (`user-profile.ts`)

### Import Organization

Organize imports in this order:

1. External libraries
2. Internal absolute imports
3. Relative imports

```typescript
// External
import { useState } from "react";
import { FastifyInstance } from "fastify";

// Internal (workspace libs)
import { formatDate } from "@ripples/shared/utils";

// Relative
import { UserCard } from "./components/UserCard";
import type { User } from "./types";
```

### Comments

Use comments sparingly and only when necessary:

```typescript
// Good: Explains "why", not "what"
// Cache the result to avoid expensive recalculation
const cachedValue = computeExpensive();

// Bad: States the obvious
// Increment counter
counter++;
```

**JSDoc for public APIs**:

```typescript
/**
 * Calculates the total price of items in the cart
 * @param items - Array of cart items
 * @returns Total price in cents
 */
function calculateTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

### No AI Attribution

Do **not** add AI generation attribution comments:

```typescript
// ❌ Don't do this
// Significant portion of this file was generated with AI

// ❌ Don't do this either
// Generated by Claude Code
```

## Type Checking

### Running Type Check

```bash
# Type check a specific project
npx nx typecheck web
npx nx typecheck api

# Type check all projects
npx nx run-many --target=typecheck --all
```

### Build vs Type Check

- **Build**: Handled by Vite (web) or esbuild (API)
- **Type Check**: Separate `tsc` process with `--noEmit`

This separation allows fast builds while still catching type errors.

## Common TypeScript Patterns

### Union Types

```typescript
type Status = "pending" | "success" | "error";

function handleStatus(status: Status) {
    switch (status) {
        case "pending":
            return "Loading...";
        case "success":
            return "Done!";
        case "error":
            return "Failed";
    }
}
```

### Discriminated Unions

```typescript
type Result<T> =
    | { success: true; data: T }
    | { success: false; error: string };

function handleResult<T>(result: Result<T>) {
    if (result.success) {
        console.log(result.data); // TypeScript knows data exists
    } else {
        console.error(result.error); // TypeScript knows error exists
    }
}
```

### Utility Types

```typescript
interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

// Omit password from public API
type PublicUser = Omit<User, "password">;

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<Partial<User>>;

// Pick specific properties
type UserCredentials = Pick<User, "email" | "password">;
```

## Related Documentation

- [Technology Stack](../stack.md) - TypeScript and ESLint versions
- [Nx Workspace Patterns](nx-workspace-patterns.md) - TypeScript project references
- [React Component Patterns](react-component-patterns.md) - React-specific TypeScript patterns
- [Fastify API Patterns](fastify-api-patterns.md) - API-specific TypeScript patterns
