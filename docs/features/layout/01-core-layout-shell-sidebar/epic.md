---
feature: "Layout"
epic: "Core Layout Shell & Sidebar"
created: 2026-01-31
type: enhancement
status: draft
complexity: M
estimated_duration: "1.5-2 days"
link: "#7"
---

# Epic: Core Layout Shell & Sidebar

### Description

This epic establishes the foundational layout infrastructure for the Ripples application. It implements the primary desktop layout shell using a hybrid pattern with a persistent left sidebar that serves as the main navigation anchor. The sidebar provides spatial consistency and mental orientation for users working with a time-based canvas.

The implementation creates a stable structural frame that all other UI components will live inside. By establishing the core shell first, subsequent features (top bar, contextual pane, mobile responsiveness) can be layered incrementally without architectural rework.

### Business Value

- Provides the foundational UI structure that enables all subsequent feature development
- Establishes consistent navigation patterns that reduce user cognitive load
- Creates a calm, spatially stable interface appropriate for a sensemaking tool
- Enables team to build features in parallel once the shell exists

### Success Metrics

- Users can navigate between main sections using the sidebar
- Sidebar collapse/expand state persists across page navigation
- Layout correctly allocates space between sidebar and main canvas
- No layout shift or visual jank during state transitions

---

## User Personas

| Persona   | Description                                 | Primary Goals                                               |
| --------- | ------------------------------------------- | ----------------------------------------------------------- |
| Engineer  | Software developer using Ripples daily      | Quick access to different views, minimize context switching |
| Team Lead | Engineering manager reviewing team patterns | Navigate between team-level and individual views            |

---

## User Stories

### Story 1: View Persistent Sidebar Navigation

**As a** user,
**I want** a persistent sidebar visible on desktop,
**So that** I always know where I am in the application and can quickly navigate to other sections.

#### Acceptance Criteria

- [ ] **Given** I am on any page in the desktop application, **when** the page loads, **then** I see a sidebar on the left side of the screen
- [ ] **Given** the sidebar is visible, **when** I look at it, **then** I see navigation items: Daily Stream, Patterns, Work Items, Teams/Spaces, and Settings
- [ ] **Given** I am viewing a section, **when** I look at the sidebar, **then** the current section is visually highlighted
- [ ] **Given** the sidebar exists, **when** the page renders, **then** it does not overlap or obscure the main canvas area

#### Notes

- Sidebar should use shadcn/ui NavigationMenu component internally
- Icons should accompany labels for quick visual recognition

---

### Story 2: Collapse Sidebar to Icon-Only Mode

**As a** user,
**I want** to collapse the sidebar to icon-only mode,
**So that** I have more horizontal space for the main canvas when needed.

#### Acceptance Criteria

- [ ] **Given** the sidebar is in full mode, **when** I click the collapse toggle, **then** the sidebar collapses to show only icons
- [ ] **Given** the sidebar is in icon-only mode, **when** I click the expand toggle, **then** the sidebar expands to show icons and labels
- [ ] **Given** the sidebar is collapsed, **when** I hover over an icon, **then** I see a tooltip with the navigation item label
- [ ] **Given** the sidebar collapses or expands, **when** the transition occurs, **then** the main canvas smoothly adjusts to fill available space

#### Notes

- Consider keyboard shortcut for toggle (e.g., Cmd/Ctrl+B) as future enhancement
- Animation should be smooth but quick (150-200ms)

---

### Story 3: Persist Sidebar State Across Navigation

**As a** user,
**I want** my sidebar collapse preference to be remembered,
**So that** I don't have to re-collapse it every time I navigate or refresh.

#### Acceptance Criteria

- [ ] **Given** I collapse the sidebar and navigate to another section, **when** the new page loads, **then** the sidebar remains collapsed
- [ ] **Given** I collapse the sidebar and refresh the browser, **when** the page reloads, **then** the sidebar remains collapsed
- [ ] **Given** I expand the sidebar, **when** I perform any navigation, **then** the sidebar remains expanded

#### Notes

- State should be persisted to localStorage
- Consider React Context or lightweight state management for sharing state

---

### Story 4: Navigate Between Application Sections

**As a** user,
**I want** to click sidebar items to navigate to different sections,
**So that** I can access various views of my work.

#### Acceptance Criteria

- [ ] **Given** I am on any page, **when** I click "Daily Stream" in the sidebar, **then** I navigate to the Daily Stream view
- [ ] **Given** I am on any page, **when** I click "Patterns" in the sidebar, **then** I navigate to the Patterns view
- [ ] **Given** I am on any page, **when** I click "Work Items" in the sidebar, **then** I navigate to the Work Items view
- [ ] **Given** I am on any page, **when** I click "Teams/Spaces" in the sidebar, **then** I navigate to the Teams view
- [ ] **Given** I am on any page, **when** I click "Settings" in the sidebar, **then** I navigate to the Settings view
- [ ] **Given** I click a navigation item, **when** navigation completes, **then** the sidebar remains open (does not auto-close on desktop)

#### Notes

- Routes may initially render placeholder content; actual views are out of scope
- Navigation should use React Router or equivalent

---

### Story 5: Establish Main Canvas Container

**As a** developer,
**I want** a designated main canvas container that fills remaining space,
**So that** view content has a predictable, responsive area to render in.

#### Acceptance Criteria

- [ ] **Given** the layout shell renders, **when** I inspect the DOM, **then** there is a main content area adjacent to the sidebar
- [ ] **Given** the sidebar is expanded, **when** the layout renders, **then** the canvas fills the horizontal space not occupied by the sidebar
- [ ] **Given** the sidebar is collapsed, **when** the layout renders, **then** the canvas expands to fill the additional space
- [ ] **Given** the canvas has content taller than the viewport, **when** I scroll, **then** only the canvas scrolls (sidebar remains fixed)

#### Notes

- Canvas should use CSS Grid or Flexbox for layout
- Independent scroll management is critical for the ripples visualization

---

## Dependencies

| Dependency      | Type     | Description                                           | Status  |
| --------------- | -------- | ----------------------------------------------------- | ------- |
| shadcn/ui setup | Internal | shadcn/ui components must be installed and configured | Unknown |
| React Router    | Internal | Routing library for navigation                        | Unknown |
| Tailwind CSS    | Internal | Already configured per project stack                  | Known   |

## Assumptions

- shadcn/ui components (Sidebar, NavigationMenu, Tooltip) are available or can be added
- The application uses client-side routing
- localStorage is available for persisting UI preferences
- Desktop breakpoint is 1024px or wider

## Out of Scope

- Mobile sidebar behavior (covered in Epic 03)
- Top utility bar (covered in Epic 02)
- Right contextual pane (covered in Epic 02)
- Command palette / search (covered in Epic 04)
- Actual view content for navigation destinations
- Keyboard shortcuts for sidebar toggle

## Open Questions

None - all requirements are clear from the Feature brief.

## Implementation Plan

See [tasks.md](./tasks.md) for the detailed task breakdown and dependency graph.

---

## Appendix

### Complexity Assessment

**Assessed by**: nxs-architect
**Rating**: M (Medium)
**Timeline Estimates**:

| Scenario    | Duration | Assumptions                                                            |
| ----------- | -------- | ---------------------------------------------------------------------- |
| Best Case   | 1.5 days | shadcn/ui components work out-of-box, state management straightforward |
| Likely Case | 2 days   | Minor component customization, testing layout edge cases               |
| Worst Case  | 3 days   | Significant sidebar customization, complex state sync issues           |

**Complexity Drivers**:

- Multiple interconnected components (Shell, Sidebar, NavMenu)
- Layout state management with persistence
- Smooth CSS transitions for collapse/expand

### Glossary

| Term           | Definition                                                         |
| -------------- | ------------------------------------------------------------------ |
| Shell          | The outer layout container that holds sidebar, top bar, and canvas |
| Canvas         | The main content area where primary views render                   |
| Collapsed mode | Sidebar showing only icons without labels                          |

### Related Documents

- [Post-Implementation Report](https://github.com/sameera/ripples/tree/main/docs/features/layout/01-core-layout-shell-sidebar/PIR.md) - Implementation summary and key decisions
- [Layout Feature Brief](https://github.com/sameera/ripples/tree/main/docs/features/layout/README.md) - Parent Feature Brief
- [Epic 02: Top Bar & Contextual Pane](https://github.com/sameera/ripples/tree/main/docs/features/layout/02-top-bar-contextual-pane/epic.md) - Depends on this epic
- [Epic 03: Mobile Responsive Layout](https://github.com/sameera/ripples/tree/main/docs/features/layout/03-mobile-responsive-layout/epic.md) - Depends on this epic
- [Epic 04: Command Palette & Keyboard Nav](https://github.com/sameera/ripples/tree/main/docs/features/layout/04-command-palette-keyboard-nav/epic.md) - Can parallel after Epic 02
