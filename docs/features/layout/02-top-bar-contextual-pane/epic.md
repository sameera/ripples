---
feature: "Layout"
epic: "Top Bar & Contextual Pane"
created: 2026-01-31
type: enhancement
status: draft
complexity: S-M
estimated_duration: "1-1.5 days"
---

# Epic: Top Bar & Contextual Pane

### Description

This epic completes the desktop layout structure by adding the top utility bar and the optional right contextual pane. The top bar provides a lightweight, low-contrast strip for global actions, scope indicators, and user controls. The contextual pane offers a toggleable space for displaying metadata, filters, insights, or selected item details without cluttering the main canvas.

Together with the core shell and sidebar from Epic 01, this epic establishes the complete four-region hybrid layout: sidebar, top bar, main canvas, and contextual pane. The layout supports narrative flow from left to right with increasing specificity.

### Business Value

- Provides space for global actions (search entry, scope selection) without competing with the canvas
- Enables contextual information display without navigating away from current view
- Creates a complete layout that can accommodate future features (AI summaries, cross-team comparisons)
- Maintains canvas dominance while offering progressive disclosure of detail

### Success Metrics

- Users can access user menu and see current scope from the top bar
- Users can toggle the contextual pane open and closed
- Canvas area correctly adjusts when contextual pane is toggled
- Top bar remains visually lightweight and does not compete with canvas content

---

## User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| Engineer | Software developer using Ripples daily | Quick access to profile, see current context at a glance |
| Team Lead | Engineering manager reviewing patterns | View additional context for selected items without losing overview |

---

## User Stories

### Story 1: View Top Utility Bar

**As a** user,
**I want** a top utility bar visible on desktop,
**So that** I can access global actions and see my current scope at a glance.

#### Acceptance Criteria

- [ ] **Given** I am on any page in the desktop application, **when** the page loads, **then** I see a top bar spanning the width above the main canvas
- [ ] **Given** the top bar is visible, **when** I look at it, **then** I see a search entry point, scope indicator, and user menu area
- [ ] **Given** the top bar exists, **when** I view the page, **then** the top bar appears lightweight and does not visually dominate the canvas
- [ ] **Given** the layout renders, **when** I scroll the canvas, **then** the top bar remains fixed at the top

#### Notes

- Search entry point is a placeholder/trigger for the Command palette (Epic 04)
- Scope indicator shows current team/project/time window context
- User menu contains profile, preferences, theme toggle

---

### Story 2: Access User Menu

**As a** user,
**I want** to access my user menu from the top bar,
**So that** I can manage my profile and preferences.

#### Acceptance Criteria

- [ ] **Given** I am on any page, **when** I click the user menu trigger in the top bar, **then** a dropdown menu appears
- [ ] **Given** the user menu is open, **when** I view it, **then** I see options for Profile, Preferences, and Theme Toggle
- [ ] **Given** the user menu is open, **when** I click outside the menu, **then** the menu closes
- [ ] **Given** the user menu is open, **when** I click a menu item, **then** the appropriate action occurs and the menu closes

#### Notes

- Use shadcn/ui DropdownMenu component
- Actual profile/preferences pages are out of scope; navigation or placeholders are sufficient

---

### Story 3: View Current Scope Indicator

**As a** user,
**I want** to see my current scope (team, project, time window) in the top bar,
**So that** I understand the context of the data I'm viewing.

#### Acceptance Criteria

- [ ] **Given** I am viewing any page, **when** I look at the top bar, **then** I see an indicator showing the current scope context
- [ ] **Given** a scope is selected, **when** the indicator displays, **then** it shows the scope name or label clearly
- [ ] **Given** the scope indicator exists, **when** I click it, **then** I can change the current scope (dropdown or modal)

#### Notes

- Initial implementation can use a simple dropdown for scope selection
- Actual scope data/filtering logic is out of scope; UI structure is the focus

---

### Story 4: Toggle Contextual Pane

**As a** user,
**I want** to toggle a right contextual pane open and closed,
**So that** I can view additional details when needed without permanently losing canvas space.

#### Acceptance Criteria

- [ ] **Given** the contextual pane is closed, **when** I click the pane toggle, **then** the pane slides open from the right
- [ ] **Given** the contextual pane is open, **when** I click the pane toggle, **then** the pane slides closed
- [ ] **Given** the pane opens or closes, **when** the transition occurs, **then** the main canvas smoothly adjusts width
- [ ] **Given** the pane is open, **when** I view it, **then** it displays a content area ready for contextual information

#### Notes

- Pane toggle could be in the top bar or at the canvas edge
- Consider shadcn/ui Sheet or custom panel with ResizablePanelGroup for future width adjustment
- Pane content is placeholder; actual content driven by view context is out of scope

---

### Story 5: Persist Contextual Pane State

**As a** user,
**I want** my contextual pane open/closed preference to be remembered,
**So that** I don't have to re-open it every time I navigate.

#### Acceptance Criteria

- [ ] **Given** I open the contextual pane and navigate to another section, **when** the new page loads, **then** the pane remains open
- [ ] **Given** I close the contextual pane and refresh the browser, **when** the page reloads, **then** the pane remains closed
- [ ] **Given** I toggle the pane state, **when** I perform any navigation, **then** my preference is preserved

#### Notes

- Use same state management approach as sidebar collapse (localStorage + context)

---

### Story 6: Maintain Canvas Dominance

**As a** user,
**I want** the main canvas to remain the dominant visual region,
**So that** the ripples visualization has maximum space and focus.

#### Acceptance Criteria

- [ ] **Given** both sidebar and contextual pane are expanded, **when** I view the layout, **then** the canvas still occupies the majority of horizontal space
- [ ] **Given** the contextual pane is open, **when** I view it, **then** its width is constrained to not exceed 30% of viewport width
- [ ] **Given** all layout regions are visible, **when** I view the page, **then** the canvas content is not cramped or unusable

#### Notes

- Default pane width should be modest (240-320px)
- Consider max-width constraints to protect canvas space

---

## Dependencies

| Dependency | Type | Description | Status |
|------------|------|-------------|--------|
| Epic 01: Core Shell & Sidebar | Internal | Layout shell and state management must exist | Required |
| shadcn/ui DropdownMenu | Internal | For user menu component | Unknown |

## Assumptions

- Layout shell from Epic 01 is complete and provides the structural container
- State management pattern from Epic 01 can be extended for pane state
- Top bar height is fixed and modest (48-56px)
- Contextual pane width has reasonable default and max constraints

## Out of Scope

- Mobile top bar behavior (covered in Epic 03)
- Mobile contextual pane as bottom sheet (covered in Epic 03)
- Search functionality and Command palette (covered in Epic 04)
- Actual scope filtering logic and data
- Actual contextual pane content (metadata, insights, etc.)
- Resizable pane width (future enhancement)

## Open Questions

None - requirements are clear from the Feature brief.

---

## Appendix

### Complexity Assessment

**Assessed by**: nxs-architect
**Rating**: S-M (Small to Medium)
**Timeline Estimates**:

| Scenario | Duration | Assumptions |
|----------|----------|-------------|
| Best Case | 1 day | Components straightforward, minimal layout edge cases |
| Likely Case | 1.5 days | Minor styling adjustments, pane animation tuning |
| Worst Case | 2 days | Complex pane interactions, state sync issues |

**Complexity Drivers**:

- Integration with existing shell layout
- Pane toggle animation and canvas resize coordination
- Multiple interactive elements in top bar

### Glossary

| Term | Definition |
|------|------------|
| Utility Bar | Lightweight top strip for global actions, distinct from navigation |
| Contextual Pane | Right-side panel showing context-specific information |
| Scope | The current filter context (team, project, time range) |

### Related Documents

- [Layout Feature Brief](https://github.com/sameera/ripples/tree/main/docs/features/layout/README.md) - Parent Feature Brief
- [Epic 01: Core Layout Shell & Sidebar](https://github.com/sameera/ripples/tree/main/docs/features/layout/01-core-layout-shell-sidebar/epic.md) - Prerequisite epic
- [Epic 03: Mobile Responsive Layout](https://github.com/sameera/ripples/tree/main/docs/features/layout/03-mobile-responsive-layout/epic.md) - Mobile adaptation
- [Epic 04: Command Palette & Keyboard Nav](https://github.com/sameera/ripples/tree/main/docs/features/layout/04-command-palette-keyboard-nav/epic.md) - Can parallel with this or Epic 03
