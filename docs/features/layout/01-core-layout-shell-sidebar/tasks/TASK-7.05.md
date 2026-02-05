---
title: "TASK-7.05: Unit & E2E Tests"
labels: [frontend]
parent: #7
project: sameera/ripples
---

## Summary

Write unit tests (Vitest + Testing Library) for all new components and state atoms, covering rendering, collapse behavior, active states, tooltip visibility, and localStorage persistence. Write Playwright E2E tests for the three critical user flows: cross-section navigation, collapse persistence across navigation, and collapse persistence across page refresh.

## Dependencies

-   Blocked by: TASK-7.03, TASK-7.04
-   Blocks: None

## Git Workspace

-   Worktree: `../ripples-worktrees/7`
-   Branch: `feat/7-core-layout-shell-sidebar`

## Low-Level Design

### Files

- `apps/web/src/state/sidebar.spec.ts` — Create: Unit tests for `sidebarCollapsedAtom` (default value, localStorage read/write) and `toggleSidebarAtom` (state flip)
- `apps/web/src/app/layout/AppShell.spec.tsx` — Create: Unit tests for AppShell grid rendering and response to collapse state
- `apps/web/src/app/layout/MainCanvas.spec.tsx` — Create: Unit tests for MainCanvas rendering and Outlet slot
- `apps/web/src/app/sidebar/AppSidebar.spec.tsx` — Create: Unit tests for sidebar rendering (5 nav items, toggle button) and collapse toggle interaction
- `apps/web/src/app/sidebar/NavItem.spec.tsx` — Create: Unit tests for NavItem rendering, active state via NavLink, tooltip conditional rendering
- `apps/web-e2e/src/sidebar.spec.ts` — Create: Playwright E2E tests — navigation flow, collapse persistence across navigation, collapse persistence across refresh

### Interfaces/Types

```typescript
// No new interfaces. Tests use:
// - render, screen, fireEvent from @testing-library/react
// - MemoryRouter from react-router-dom (wraps components needing router context)
// - Provider from jotai/react (if needed for atom store isolation)
// - test, expect, Page from @playwright/test
```

### Key Decisions

| Decision | Rationale | Alternatives |
| --- | --- | --- |
| `MemoryRouter` for unit tests | NavLink requires router context; MemoryRouter is zero-config and supports `initialEntries` for active-state testing | Full BrowserRouter (requires jsdom URL manipulation) |
| Mock `localStorage` in atom tests | Isolates persistence logic from real browser storage; predictable test state | Use real localStorage (less isolation, shared state between tests) |
| Separate unit and E2E test files | Unit tests validate component logic in isolation; E2E validates integrated user flows end-to-end | Single integration-only suite (misses component-level edge cases) |
| E2E tests target `data-testid` selectors | Stable across styling changes; matches HLD E2E test spec | CSS class selectors (break on refactor) |

### Implementation Notes

- **Atom tests** (`sidebar.spec.ts`):
  - Before each test, clear the mocked localStorage.
  - Test 1: fresh atom reads default `false`.
  - Test 2: pre-populate localStorage with `"true"`, verify atom reads `true`.
  - Test 3: set atom to `true`, verify localStorage was called with `"true"`.
  - Test 4: invoke `toggleSidebarAtom`, verify state flips.
  - Use Jotai's `getDefaultStore()` or create a fresh store per test for isolation.

- **Component tests** (AppShell, AppSidebar, NavItem):
  - Wrap each component in `MemoryRouter` (and a Jotai `Provider` with a fresh store if needed).
  - AppShell: assert two grid children exist; set atom to collapsed, verify `data-collapsed="true"`.
  - AppSidebar: assert 5 nav items rendered; click toggle, verify collapse state changes.
  - NavItem: render with `initialEntries={["/patterns"]}` and a NavItem for `/patterns`; assert active class is present.
  - NavItem tooltip: render with `collapsed={true}`, assert tooltip content present; render with `collapsed={false}`, assert tooltip absent.

- **MainCanvas test**: render with a mock Outlet (or nested route) and verify child content appears.

- **E2E tests** (`sidebar.spec.ts`) — directly from HLD Section 15:
  1. Navigate to `/`, click `[data-testid="nav-patterns"]`, assert URL is `/patterns`, assert that nav item has active class.
  2. Click `[data-testid="sidebar-toggle"]`, assert `[data-testid="sidebar"]` has `data-collapsed="true"`, click `[data-testid="nav-settings"]`, assert `data-collapsed` is still `"true"`.
  3. Click toggle to collapse, reload page, assert `data-collapsed` is still `"true"`.

- **Coverage target**: ≥80% line coverage on all new source files (`sidebar.ts`, `AppShell.tsx`, `MainCanvas.tsx`, `AppSidebar.tsx`, `NavItem.tsx`).

## Acceptance Criteria

- [ ] `sidebarCollapsedAtom` tests pass: default false, reads localStorage, persists on write
- [ ] `toggleSidebarAtom` test passes: state flips on invoke
- [ ] AppShell tests pass: grid renders, responds to collapsed state attribute
- [ ] MainCanvas tests pass: renders Outlet content
- [ ] AppSidebar tests pass: 5 nav items rendered, toggle button present and functional
- [ ] NavItem tests pass: icon + label render, active class applied on match, tooltip conditional on collapsed prop
- [ ] E2E — navigation: user clicks nav items and lands on correct routes with active highlighting
- [ ] E2E — collapse persistence (navigation): collapse state survives route changes
- [ ] E2E — collapse persistence (refresh): collapse state survives page reload
- [ ] All unit tests achieve ≥80% line coverage on new files
- [ ] `npx nx test ripples` passes with no failures
- [ ] `npx nx e2e web-e2e` passes with no failures
-   [ ] All existing tests pass
-   [ ] New functionality has test coverage (if applicable)

## Estimated Effort

4-8 hours (half day to full day)