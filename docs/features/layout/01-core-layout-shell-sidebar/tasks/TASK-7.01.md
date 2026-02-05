---
title: "TASK-7.01: Sidebar State Management"
labels: [frontend]
parent: #7
project: sameera/ripples
---

## Summary

Create the Jotai atoms that govern sidebar collapse state with automatic localStorage persistence. This establishes the single source of truth for sidebar state that all layout components will subscribe to. Implements sidebarCollapsedAtom (persisted boolean) and toggleSidebarAtom (write-only toggle action).

## Dependencies

-   Blocked by: None
-   Blocks: TASK-7.03, TASK-7.04

## Git Workspace

-   Worktree: `../ripples-worktrees/7`
-   Branch: `feat/7-core-layout-shell-sidebar`

## Low-Level Design

### Files

- `apps/web/src/state/sidebar.ts` — Create: Jotai atoms for sidebar collapse state with localStorage persistence via atomWithStorage

### Interfaces/Types

```typescript
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Persisted atom — reads/writes localStorage key synchronously
export const sidebarCollapsedAtom = atomWithStorage<boolean>(
    "ripples:sidebar:collapsed",
    false
);

// Write-only toggle — components that only toggle avoid re-renders on read
export const toggleSidebarAtom = atom(
    null,
    (get, set) => {
        set(sidebarCollapsedAtom, !get(sidebarCollapsedAtom));
    }
);
```

### Key Decisions

| Decision | Rationale | Alternatives |
| --- | --- | --- |
| `atomWithStorage` for persistence | Built-in synchronous localStorage sync; prevents FOUC on initial render (NFR-3) | Custom useEffect + useState (requires manual sync, risks FOUC) |
| localStorage key `ripples:sidebar:collapsed` | Namespaced to avoid conflicts; matches HLD spec exactly | Generic key like `sidebar-collapsed` |
| Write-only `toggleSidebarAtom` | Components that only toggle (e.g., CollapseToggle button) avoid re-rendering on state reads | Single atom with useAtom in all consumers |

### Implementation Notes

- `atomWithStorage` hydrates synchronously from localStorage on first access — this is critical for NFR-3 (no FOUC). The sidebar width is correct on the very first frame.
- No Jotai Provider is needed. Atoms are imported and used directly with `useAtom` / `useSetAtom`.
- The toggle atom uses the `(get, set)` write pattern: `get` reads current value, `set` writes the inverse.
- Default value `false` means sidebar is expanded on first visit (no localStorage entry).

## Acceptance Criteria

- [ ] `sidebarCollapsedAtom` defaults to `false` when localStorage has no entry for `ripples:sidebar:collapsed`
- [ ] `sidebarCollapsedAtom` reads the persisted boolean from localStorage on initialization
- [ ] Writing to `sidebarCollapsedAtom` updates localStorage synchronously
- [ ] `toggleSidebarAtom` flips the current collapsed state
- [ ] Both atoms are exported from `apps/web/src/state/sidebar.ts`
-   [ ] All existing tests pass
-   [ ] New functionality has test coverage (if applicable)

## Estimated Effort

< 4 hours