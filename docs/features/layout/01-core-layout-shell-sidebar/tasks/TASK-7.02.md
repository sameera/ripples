---
title: "TASK-7.02: Route Configuration & Placeholder Views"
labels: [frontend]
parent: #7
project: sameera/ripples
---

## Summary

Define the NavRoute interface and the 5 primary application routes, create a generic PlaceholderView component for unimplemented destinations, and wire BrowserRouter with route declarations into app.tsx. Establishes the client-side routing skeleton that AppShell's Outlet will render into.

## Dependencies

-   Blocked by: None
-   Blocks: TASK-7.03

## Git Workspace

-   Worktree: `../ripples-worktrees/7`
-   Branch: `feat/7-core-layout-shell-sidebar`

## Low-Level Design

### Files

- `apps/web/src/app/routes/routes.config.ts` — Create: NavRoute interface and the array of 5 route definitions with lucide-react icons
- `apps/web/src/app/routes/PlaceholderView.tsx` — Create: Generic placeholder component that displays a "Coming soon" message with the route label
- `apps/web/src/app/app.tsx` — Modify: Wrap the application in `BrowserRouter`, define `Routes`/`Route` structure, add a root-level `Navigate` redirect from `/` to `/stream`

### Interfaces/Types

```typescript
import { ComponentType } from "react";

export interface NavRoute {
    path: string;
    label: string;
    icon: ComponentType;
}

// routes.config.ts exports this array — consumed by both routing setup and sidebar nav
export const routes: NavRoute[] = [
    { path: "/stream",      label: "Daily Stream",  icon: Activity },
    { path: "/patterns",   label: "Patterns",      icon: LineChart },
    { path: "/work-items", label: "Work Items",    icon: ListTodo },
    { path: "/teams",      label: "Teams/Spaces",  icon: Users },
    { path: "/settings",   label: "Settings",      icon: Settings },
];
```

### Key Decisions

| Decision | Rationale | Alternatives |
| --- | --- | --- |
| Single `PlaceholderView` for all routes | All 5 destinations are out-of-scope for this epic; one component avoids duplication | Individual placeholder per route (unnecessary until views exist) |
| `NavRoute` array is the single source of route definitions | Both the router (`Routes`/`Route`) and the sidebar (`NavItem` list) iterate the same array — guarantees they stay in sync | Separate route config for router vs. sidebar |
| `<Navigate to="/stream" />` at root `/` | HLD spec: default route is `/stream` (Daily Stream) | Landing page, or leaving `/` unhandled |
| Icons imported from `lucide-react` | Matches HLD tech stack decision; consistent icon set | Custom SVG components |

### Implementation Notes

- `routes.config.ts` is a pure data module — no React imports beyond `ComponentType`. This makes it importable anywhere without side effects.
- `PlaceholderView` can receive the current route label via `useParams` or by looking up the matched route. Simplest approach: use React Router's `useLocation` + find the matching NavRoute to display its label.
- In `app.tsx`, the structure is: `BrowserRouter` → `AppShell` (from Task 3) → inside AppShell, `MainCanvas` renders `<Outlet />`. The `Routes`/`Route` declarations sit directly inside `BrowserRouter` wrapping `AppShell` as the layout route.
- Icon imports: `Activity`, `LineChart`, `ListTodo`, `Users`, `Settings` from `lucide-react`.

## Acceptance Criteria

- [ ] `NavRoute` interface is exported with `path`, `label`, `icon` fields
- [ ] 5 routes are defined: `/stream`, `/patterns`, `/work-items`, `/teams`, `/settings`
- [ ] Each route entry includes the correct lucide-react icon
- [ ] `PlaceholderView` renders a message identifying the current section
- [ ] `BrowserRouter` wraps the application in `app.tsx`
- [ ] Navigating to `/` redirects to `/stream`
- [ ] Each defined route path renders `PlaceholderView` without errors
-   [ ] All existing tests pass
-   [ ] New functionality has test coverage (if applicable)

## Estimated Effort

4-8 hours (half day to full day)