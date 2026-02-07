---
standard: Testing Patterns
version: 1.0.0
last_updated: 2026-01-19
---

# Testing Patterns

This document describes testing strategies, tools, and conventions for the Ripples project.

## Testing Stack

- **Unit Testing**: Vitest 4.0.0
- **E2E Testing**: Playwright 1.36.0
- **Testing Library**: @testing-library/react 16.3.0
- **Coverage**: Vitest Coverage (v8 provider)

## Unit Testing with Vitest

### Configuration

**Global Configuration**: [vitest.workspace.ts](../../../vitest.workspace.ts)

```typescript
export default ["**/vite.config.{mjs,js,ts,mts}", "**/vitest.config.{mjs,js,ts,mts}"];
```

**Web App Configuration**: [apps/web/vite.config.mts:29-40](../../../apps/web/vite.config.mts#L29-L40)

```typescript
test: {
    name: "ripple",
    watch: false,
    globals: true,
    environment: "jsdom",
    include: ["{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    coverage: {
        reportsDirectory: "./test-output/vitest/coverage",
        provider: "v8" as const,
    }
}
```

### Running Tests

**Run all tests**:

```bash
npx nx test web
```

**Watch mode**:

```bash
npx nx test web --watch
```

**With coverage**:

```bash
npx nx test web --coverage
```

**Run specific test file**:

```bash
npx nx test web --testFile=src/app/app.tsx
```

### Test File Patterns

Tests are discovered using co-located test files:

- `*.test.tsx`, `*.spec.tsx` - Component and module tests
- `*.test.ts`, `*.spec.ts` - Utility and non-component tests

**Co-location Best Practices**:

Place test files next to the source files they test:

```
src/
  app/
    app.tsx
    app.spec.tsx
  components/
    Button.tsx
    Button.spec.tsx
    Card.tsx
    Card.test.tsx
```

**Benefits**:
- Easy to find tests for any given file
- Clear one-to-one relationship between source and tests
- Simplified imports (relative paths are shorter)
- Better IDE support and navigation

### Component Test Files

**Location**: Co-locate with source files

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

**More examples**:

```typescript
// apps/web/src/app/components/Button.spec.tsx
import { render } from "@testing-library/react";
import { expect, it, describe, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
    it("should render with text", () => {
        const { getByText } = render(<Button>Click me</Button>);
        expect(getByText("Click me")).toBeInTheDocument();
    });

    it("should call onClick when clicked", () => {
        const onClick = vi.fn();
        const { getByRole } = render(<Button onClick={onClick}>Click</Button>);

        getByRole("button").click();
        expect(onClick).toHaveBeenCalledOnce();
    });
});
```

### Testing React Components

**Use @testing-library/react**:

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, it, describe, vi } from "vitest";

describe("UserForm", () => {
    it("should submit form data", async () => {
        const onSubmit = vi.fn();
        render(<UserForm onSubmit={onSubmit} />);

        fireEvent.change(screen.getByLabelText("Name"), {
            target: { value: "John Doe" }
        });

        fireEvent.click(screen.getByRole("button", { name: "Submit" }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({ name: "John Doe" });
        });
    });
});
```

### Mocking

**Mocking modules**:

```typescript
import { vi } from "vitest";

vi.mock("../api/client", () => ({
    fetchUser: vi.fn().mockResolvedValue({ id: "1", name: "John" })
}));
```

**Mocking functions**:

```typescript
const mockFn = vi.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue({ data: "async" });
```

### Coverage

**Generate coverage report**:

```bash
npx nx test web --coverage
```

**Output**: `apps/web/test-output/vitest/coverage/`

**Coverage formats**:

- HTML report
- JSON summary
- Text summary in terminal

## E2E Testing with Playwright

### Configuration

**Project**: `apps/web-e2e`

**Configuration file**: [apps/web-e2e/playwright.config.ts](../../../apps/web-e2e/playwright.config.ts)

### Test Location

**Test files**: `apps/web-e2e/src/**/*.spec.ts`

**Example** ([apps/web-e2e/src/example.spec.ts](../../../apps/web-e2e/src/example.spec.ts)):

```typescript
import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
    await page.goto("/");

    // Expect h1 to contain a substring.
    expect(await page.locator("h1").innerText()).toContain("Welcome");
});
```

### Running E2E Tests

**Run E2E tests**:

```bash
npx nx e2e web-e2e
```

**Run in UI mode** (interactive):

```bash
npx nx e2e web-e2e --ui
```

**Run in headed mode** (see browser):

```bash
npx nx e2e web-e2e --headed
```

**Debug mode**:

```bash
npx nx e2e web-e2e --debug
```

### E2E Test Patterns

**Basic test**:

```typescript
import { test, expect } from "@playwright/test";

test("user can log in", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "user@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator("h1")).toContainText("Dashboard");
});
```

**Using fixtures**:

```typescript
test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("navigates to about page", async ({ page }) => {
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL("/about");
});
```

**Testing API calls**:

```typescript
test("loads user data", async ({ page }) => {
    await page.route("**/api/users/1", (route) => {
        route.fulfill({
            status: 200,
            body: JSON.stringify({ id: "1", name: "John Doe" })
        });
    });

    await page.goto("/users/1");
    await expect(page.locator(".user-name")).toHaveText("John Doe");
});
```

### Test Organization

**Use describe blocks**:

```typescript
import { test, expect } from "@playwright/test";

test.describe("User Authentication", () => {
    test("user can sign up", async ({ page }) => {
        // ...
    });

    test("user can log in", async ({ page }) => {
        // ...
    });

    test("user can log out", async ({ page }) => {
        // ...
    });
});
```

## Testing Best Practices

### Avoiding Flaky Tests (AI Agent Guidance)

**95% test coverage without flaky tests is better than 100% coverage with flaky tests that will break.**

When generating UI tests, **never** create tests that depend on:

1. **CSS classes or styles** - Class names change with refactoring, CSS-in-JS libraries generate dynamic names
   ```typescript
   // BAD - Flaky
   expect(element).toHaveClass("btn-primary-active");
   await page.click(".submit-button");

   // GOOD - Stable
   expect(element).toBeEnabled();
   await page.click('button[type="submit"]');
   ```

2. **Specific DOM hierarchy** - Component structure changes frequently
   ```typescript
   // BAD - Flaky
   await page.locator("div > div > span.label");
   container.querySelector("form > div:nth-child(2) > input");

   // GOOD - Stable
   await page.getByRole("textbox", { name: "Email" });
   screen.getByLabelText("Email");
   ```

3. **Console log entries or error messages** - Log formats change, messages get updated
   ```typescript
   // BAD - Flaky
   expect(console.log).toHaveBeenCalledWith("User logged in successfully");

   // GOOD - Stable
   expect(onLoginSuccess).toHaveBeenCalled();
   await expect(page).toHaveURL("/dashboard");
   ```

4. **Internal component state or implementation details**
   ```typescript
   // BAD - Flaky
   expect(component.state.isLoading).toBe(false);

   // GOOD - Stable
   expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
   ```

**Prefer these stable selectors (in order of preference)**:
1. **Accessible roles**: `getByRole("button")`, `getByRole("textbox")`
2. **Label text**: `getByLabelText("Email")`, `getByText("Submit")`
3. **Placeholder text**: `getByPlaceholderText("Search...")`
4. **Test IDs** (last resort): `getByTestId("submit-button")`

**Skip tests rather than write flaky ones** - If a behavior cannot be tested reliably, document why and skip it. A skipped test with a clear explanation is better than a flaky test that erodes CI trust.

### General Principles

1. **Write tests for behavior, not implementation**
2. **Keep tests focused and isolated**
3. **Use descriptive test names**
4. **Prefer integration tests over unit tests for UI**
5. **Mock external dependencies**

### Unit Testing

- Test component outputs given inputs
- Use `@testing-library/react` queries (avoid `querySelector`)
- Don't test implementation details (state, props)
- Test user interactions, not internal logic

### E2E Testing

- Test critical user journeys
- Mock external APIs when needed
- Use data-testid for stable selectors
- Keep tests independent (no shared state)
- Clean up after tests

### Coverage Goals

- Aim for high coverage on critical paths
- Don't chase 100% coverage
- Focus on edge cases and error handling
- Cover business logic thoroughly

## Test Dependencies

Tests run after all dependencies are built ([nx.json:69-73](../../../nx.json#L69-L73)):

```json
{
    "targetDefaults": {
        "test": {
            "dependsOn": ["^build"]
        }
    }
}
```

This ensures libraries are built before running tests.

## Debugging Tests

### Vitest Debugging

**Use `console.log` for quick debugging**:

```typescript
it("should do something", () => {
    const result = myFunction();
    console.log(result);
    expect(result).toBe(expected);
});
```

**Use Vitest UI**:

```bash
npx nx test web --ui
```

Opens interactive UI for debugging tests.

### Playwright Debugging

**Use `page.pause()`**:

```typescript
test("debug test", async ({ page }) => {
    await page.goto("/");
    await page.pause(); // Opens Playwright Inspector
});
```

**Use `--debug` flag**:

```bash
npx nx e2e web-e2e --debug
```

## Related Documentation

- [Technology Stack](../stack.md) - Testing framework versions
- [React Component Patterns](react-component-patterns.md) - Component testing examples
- [Nx Workspace Patterns](nx-workspace-patterns.md) - Test task configuration
