---
title: "TASK-7.04: AppSidebar & NavItem"
labels: [frontend]
parent: #7
project: sameera/ripples
---

## Summary

Build the sidebar container with the navigation item list and the collapse toggle button, and the individual NavItem component that renders an icon, label, active-state highlighting, and a tooltip (shown only in collapsed mode). Wire AppSidebar into AppShell, replacing the placeholder div. This is the most interaction-rich task in the epic.

## Dependencies

-   Blocked by: TASK-7.01, TASK-7.03
-   Blocks: TASK-7.05

## Git Workspace

-   Worktree: `../ripples-worktrees/7`
-   Branch: `feat/7-core-layout-shell-sidebar`

## Low-Level Design

### Files

- `apps/web/src/app/sidebar/AppSidebar.tsx` — Create: Sidebar container; maps over `routes` array to render `NavItem` components; renders `CollapseToggle` button at the bottom; reads `sidebarCollapsedAtom` to pass `collapsed` prop
- `apps/web/src/app/sidebar/NavItem.tsx` — Create: Individual nav item using `NavLink` from react-router-dom; renders icon + label; conditionally renders `Tooltip` when collapsed; applies active-state class via NavLink's `className` callback
- `apps/web/src/app/layout/AppShell.tsx` — Modify: Replace the sidebar placeholder div with `<AppSidebar />`

### Interfaces/Types

```typescript
import { ComponentType } from "react";

interface NavItemProps {
    path: string;
    label: string;
    icon: ComponentType;
    collapsed: boolean;
}

// AppSidebar has no props — reads state internally and iterates routes
// CollapseToggle is inlined in AppSidebar (single button, no separate component)
```

### Key Decisions

| Decision | Rationale | Alternatives |
| --- | --- | --- |
| `NavLink` from react-router-dom for each item | Provides `isActive` in `className` callback — automatic active state without manual URL comparison | `Link` + `useLocation` + manual string match |
| Tooltip only rendered/visible when `collapsed === true` | HLD FR-5: tooltips appear on hover in collapsed mode only; avoids noise in expanded mode | Always render tooltip, hide via CSS |
| Collapse toggle at sidebar bottom | HLD design spec explicitly positions toggle at bottom | Top position, floating overlay |
| Icons from lucide-react (reusing NavRoute.icon) | Zero additional imports; `NavRoute` already carries the icon component | Separate icon map or custom SVGs |
| `data-testid` attributes for E2E targeting | HLD E2E spec uses `[data-testid="nav-patterns"]` and `[data-testid="sidebar-toggle"]` selectors | CSS class-based selectors (fragile to styling changes) |
| Labels hidden with `overflow: hidden` + width transition | Sidebar column width is animated by AppShell grid; text clips naturally as column narrows; no separate label animation needed | Separate `opacity` fade on label text |

### Implementation Notes

- **AppSidebar structure**: `<nav>` with `aria-label="Main navigation"`, containing a `<ul>` of `<NavItem>` components and a collapse toggle `<button>` at the bottom.
- **CollapseToggle**: Uses `useSetAtom(toggleSidebarAtom)` — write-only, so this button never re-renders due to collapse state reads. Icon: `ChevronLeft` (expanded) / `ChevronRight` (collapsed) from lucide-react, or a single `PanelLeft` icon that flips.
- **NavItem active state**: NavLink's `className` prop receives `({ isActive })`. When active, apply a distinct background (e.g., Tailwind `bg-muted` or a custom active class). The `data-testid` should reflect the path segment: `nav-stream`, `nav-patterns`, `nav-work-items`, `nav-teams`, `nav-settings`.
- **Tooltip in collapsed mode**: Use a simple `title` attribute or a lightweight Tooltip wrapper (from shadcn/ui if available). The tooltip should appear on hover over the icon when `collapsed === true`. When `collapsed === false`, do not render the tooltip at all to avoid accessibility noise.
- **Icon centering**: In collapsed mode (56px width), icons should be horizontally centered. Use `flex items-center justify-center` on the NavLink container.
- **Sidebar overflow**: The sidebar column may have many items in the future. Set `overflow-y: auto` on the nav element to support scrolling within the sidebar independently.
- **data-testid values**: sidebar → `"sidebar"` (on the `<nav>`), each nav item → `"nav-{path-segment}"`, toggle → `"sidebar-toggle"`.

## Acceptance Criteria

- [ ] Sidebar renders all 5 navigation items with icons and labels
- [ ] The currently active route is visually highlighted in the sidebar
- [ ] Collapse toggle button is visible at the bottom of the sidebar
- [ ] Clicking the toggle collapses the sidebar to icon-only mode (56px)
- [ ] Clicking the toggle again expands the sidebar to full mode (240px)
- [ ] Tooltips appear on icon hover when the sidebar is collapsed
- [ ] Tooltips do not appear when the sidebar is expanded
- [ ] Clicking a nav item navigates to the correct route without closing the sidebar
- [ ] `data-testid` attributes are present: `sidebar`, `nav-stream`, `nav-patterns`, `nav-work-items`, `nav-teams`, `nav-settings`, `sidebar-toggle`
-   [ ] All existing tests pass
-   [ ] New functionality has test coverage (if applicable)

## Estimated Effort

1-2 days