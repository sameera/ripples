---
standard: React Component Patterns
version: 1.0.0
last_updated: 2026-01-19
---

# React Component Patterns

This document describes patterns and conventions for building React components in the Ripples project.

## Component Structure

### Entry Point

**Location**: `apps/web/src/main.tsx`

The app entry point uses React 19's `createRoot` API ([apps/web/src/main.tsx](../../../apps/web/src/main.tsx)):

```typescript
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import App from "./app/app";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <StrictMode>
        <App/>
    </StrictMode>
);
```

### Root Component

**Location**: `apps/web/src/app/app.tsx`

Basic functional component pattern ([apps/web/src/app/app.tsx](../../../apps/web/src/app/app.tsx)):

```typescript
export function App() {
    return (
        <div>
            <h1>
                <span> Hello there, </span>
                Welcome ripple 👋
            </h1>
        </div>
    );
}

export default App;
```

## Component Organization

### File Naming

- Use PascalCase for component files: `UserProfile.tsx`, `NavBar.tsx`
- Co-locate related files (styles, tests) when needed
- Place shared components in `apps/web/src/app/components/` (or create a shared library in `libs/`)

### Component Export Pattern

**Default exports for components**:

```typescript
export function MyComponent() {
    return <div>...</div>;
}

export default MyComponent;
```

This pattern supports both named and default imports.

## Testing Components

### Co-located Test Files

Place test files next to the components they test using `.spec.tsx` or `.test.tsx` extensions:

```
apps/web/src/app/
  app.tsx
  app.spec.tsx
  components/
    UserProfile.tsx
    UserProfile.spec.tsx
    Button.tsx
    Button.test.tsx
```

### Basic Component Test

**Example** ([apps/web/src/app/app.spec.tsx](../../../apps/web/src/app/app.spec.tsx)):

```typescript
import { render } from "@testing-library/react";
import { expect, it, describe } from "vitest";
import App from "./app";

describe("App", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<App />);
        expect(baseElement).toBeTruthy();
    });

    it("should have a greeting as the title", () => {
        const { getAllByText } = render(<App />);
        expect(getAllByText(new RegExp("Welcome ripple", "gi")).length > 0).toBeTruthy();
    });
});
```

### Testing Component Props

```typescript
import { render } from "@testing-library/react";
import { expect, it, describe } from "vitest";
import { UserProfile } from "./UserProfile";

describe("UserProfile", () => {
    it("should render user name", () => {
        const { getByText } = render(
            <UserProfile userId="1" displayName="John Doe" />
        );
        expect(getByText("John Doe")).toBeInTheDocument();
    });

    it("should render avatar when provided", () => {
        const { getByAltText } = render(
            <UserProfile
                userId="1"
                displayName="John Doe"
                avatarUrl="https://example.com/avatar.jpg"
            />
        );
        expect(getByAltText("John Doe")).toHaveAttribute("src", "https://example.com/avatar.jpg");
    });
});
```

### Testing User Interactions

```typescript
import { render, fireEvent } from "@testing-library/react";
import { expect, it, describe, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
    it("should call onClick when clicked", () => {
        const onClick = vi.fn();
        const { getByRole } = render(<Button onClick={onClick}>Click me</Button>);

        fireEvent.click(getByRole("button"));
        expect(onClick).toHaveBeenCalledOnce();
    });
});
```

See [Testing Patterns](testing-patterns.md) for comprehensive testing guidelines.

## Styling with Tailwind CSS

### Setup

Tailwind CSS is configured as the default styling solution (see [apps/web/vite.config.mts](../../../apps/web/vite.config.mts) and [apps/web/src/styles.css](../../../apps/web/src/styles.css)).

### Usage Pattern

Apply utility classes directly to elements:

```typescript
export function Card({ title, content }: CardProps) {
    return (
        <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-gray-600">{content}</p>
        </div>
    );
}
```

### Styling Conventions

- Use Tailwind utility classes for styling
- Keep class lists readable (consider `clsx` or `classnames` for conditional styling)
- Create component variants using props when needed
- For global styles, modify `apps/web/src/styles.css`

## TypeScript Component Patterns

### Props Typing

Always define explicit prop interfaces:

```typescript
interface UserProfileProps {
    userId: string;
    displayName: string;
    avatarUrl?: string;
}

export function UserProfile({ userId, displayName, avatarUrl }: UserProfileProps) {
    return (
        <div>
            <h2>{displayName}</h2>
            {avatarUrl && <img src={avatarUrl} alt={displayName} />}
        </div>
    );
}
```

### Children Props

For components accepting children:

```typescript
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
    className?: string;
}

export function Layout({ children, className = "" }: LayoutProps) {
    return (
        <div className={`container mx-auto ${className}`}>
            {children}
        </div>
    );
}
```

### Event Handlers

Type event handlers explicitly:

```typescript
import { FormEvent, ChangeEvent } from "react";

interface FormProps {
    onSubmit: (data: FormData) => void;
}

export function MyForm({ onSubmit }: FormProps) {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit(formData);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" onChange={handleChange} />
            <button type="submit">Submit</button>
        </form>
    );
}
```

## State Management

### Local State

Use `useState` for component-local state:

```typescript
import { useState } from "react";

export function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}
```

### Shared State

For app-wide state, consider:

- React Context API (built-in)
- Third-party libraries (when needed): Zustand, Redux, Jotai

**React 19 Features**:

- Use hooks like `useTransition`, `useDeferredValue` for performance
- Leverage Server Components if backend rendering is added

## Development Server

### Running the App

```bash
npx nx serve ripples
```

- Runs on `http://localhost:4200`
- Hot module replacement (HMR) enabled via Vite
- Fast refresh for React components

### Build Output

```bash
npx nx build ripples
```

- Output: `apps/web/dist/`
- Production-optimized bundle
- Source maps disabled in production

## Code Style

Follow project-wide conventions (see [CLAUDE.md](../../../CLAUDE.md)):

- Use double quotes for strings
- 4-space indentation (spaces, not tabs)
- Explicit semicolons
- TypeScript with explicit type annotations
- No AI generation attribution comments

## Related Documentation

- [Technology Stack](../stack.md) - React and Vite versions
- [Testing Patterns](testing-patterns.md) - Testing React components
- [Nx Workspace Patterns](nx-workspace-patterns.md) - Web app configuration
- [TypeScript & Code Quality](typescript-quality-patterns.md) - TypeScript setup
