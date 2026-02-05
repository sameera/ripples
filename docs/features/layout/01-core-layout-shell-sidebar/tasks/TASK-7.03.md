---
title: "TASK-7.03: AppShell & MainCanvas Layout"
labels: [frontend]
parent: #7
project: sameera/ripples
---

## Summary

Implement the root CSS Grid layout shell that splits the viewport into a sidebar column and a main content column, and the MainCanvas scrollable container that hosts the React Router Outlet. AppShell reads sidebar collapse state to animate the grid column widths. MainCanvas provides independent vertical scrolling while the sidebar remains fixed.

## Dependencies

-   Blocked by: TASK-7.01, TASK-7.02
-   Blocks: TASK-7.04, TASK-7.05

## Git Workspace

-   Worktree: `../ripples-worktrees/7`
-   Branch: `feat/7-core-layout-shell-sidebar`

## Low-Level Design

### Files

- `apps/web/src/app/layout/AppShell.tsx` — Create: Root layout component; CSS Grid with two columns driven by `--sidebar-width` custom property; reads `sidebarCollapsedAtom` to toggle the property and set `data-collapsed` attribute
- `apps/web/src/app/layout/MainCanvas.tsx` — Create: Scrollable content container with `overflow-y: auto` and `height: 100vh`; renders `<Outlet />` from react-router-dom
- `apps/web/src/app/app.tsx` — Modify: Replace current app body with `<AppShell />` as the layout route component

### Interfaces/Types

```typescript
// AppShell — no props; state is read from Jotai atom
// Renders: sidebar slot (placeholder div in this task, replaced by AppSidebar in Task 4) + MainCanvas

// MainCanvas — no props
// Renders: <Outlet /> from react-router-dom

// CSS custom property contract (consumed by Tailwind / inline style):
//   --sidebar-width: "240px" | "56px"
```

### Key Decisions

| Decision | Rationale | Alternatives |
| --- | --- | --- |
| CSS Grid with `--sidebar-width` custom property | Single animated property controls column width; future-proof for Epic 02 third column | Flexbox with margin (less clean column semantics) |
| `data-collapsed` attribute on shell root | CSS-only state binding for the grid; avoids JS-computed inline styles in production | Inline style with JS-computed width values |
| `transition: grid-template-columns 150ms ease-out` | Matches HLD NFR-1 (150–200ms); `ease-out` feels snappier than `ease` | No transition (instant resize); `ease-in-out` (slower feel) |
| Sidebar column as `position: sticky; top: 0; height: 100vh` | Keeps sidebar anchored while MainCanvas scrolls independently | `position: fixed` (taken out of flow, complicates grid) |
| Placeholder div for sidebar in this task | Keeps Task 3 scope to layout structure only; Task 4 replaces with AppSidebar | Build AppSidebar and AppShell in the same task (too large) |

### Implementation Notes

- **Grid definition** (Tailwind + inline CSS custom property):
  - Default: `grid-template-columns: 240px 1fr` via `--sidebar-width: 240px`
  - Collapsed: `--sidebar-width: 56px` set when `data-collapsed="true"`
  - Apply `transition-property: grid-template-columns; transition-duration: 150ms; transition-timing-function: ease-out` — Tailwind does not support transitioning grid columns natively, so use an inline `style` object or a Tailwind plugin config.
- **Scroll isolation**: MainCanvas has `overflow-y: auto; height: 100vh`. The sidebar column div has `overflow-y: auto; height: 100vh; position: sticky; top: 0` so it never scrolls with the page.
- **Zero CLS**: Because `atomWithStorage` hydrates synchronously, `--sidebar-width` is correct on the first render. No layout shift occurs.
- **Performance hint**: Add `will-change: grid-template-columns` to the shell only during the transition (or use CSS `contain: layout` on children) to prevent full-page recomposition. This can be a follow-up refinement if needed.
- The `data-collapsed` attribute is a string `"true"` or `"false"` (React converts booleans to strings for data attributes). CSS selectors use `[data-collapsed="true"]`.

## Acceptance Criteria

- [ ] AppShell renders a two-column CSS Grid layout filling the full viewport height
- [ ] Sidebar column width is 240px when expanded, 56px when collapsed
- [ ] MainCanvas fills the remaining horizontal space (1fr)
- [ ] MainCanvas scrolls independently — sidebar column remains fixed/sticky
- [ ] Grid column widths transition smoothly over 150–200ms when collapse state changes
- [ ] `data-collapsed` attribute reflects the current sidebar state
- [ ] No layout shift (CLS = 0) on initial render or state transitions
- [ ] Layout renders correctly at desktop viewport (≥1024px)
-   [ ] All existing tests pass
-   [ ] New functionality has test coverage (if applicable)

## Estimated Effort

4-8 hours (half day to full day)