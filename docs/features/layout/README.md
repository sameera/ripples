---
feature: Layout
---

Below is a recommended **UX architecture and layout shell** for Ripples, optimized for high-signal engineering teams, desktop-first usage, and realistic implementation with shadcn/ui. This intentionally avoids view-level content and focuses on the navigational and structural frame that everything else will live inside.

---

## 1. Primary Layout Structure

### Recommended Pattern: **Hybrid Shell**

**Persistent sidebar + top utility bar + main canvas + optional contextual pane**

This balances orientation, depth, and calmness. Ripples is a sensemaking tool, not a task router, so the layout should feel stable and spatially consistent over time.

### Desktop Structure

**Core regions**

1. **Left Sidebar (Primary Navigation)**
   - Persistent on desktop
   - Narrow by default, icon + label
   - Collapsible to icon-only mode
   - Anchors the product mentally, especially important for a time-based canvas

2. **Top Utility Bar**
   - Lightweight, low-contrast
   - Houses global actions, scope, and search
   - Does not compete with the canvas

3. **Main Canvas Area**
   - Dominant region
   - Full-height, scroll-managed independently
   - This is where the “ripples” visualization lives

4. **Right Contextual Pane (Optional, Toggleable)**
   - Appears only when needed
   - Shows metadata, filters, insights, or selected work item context
   - Never required for primary navigation

This layout supports narrative flow left to right, with increasing specificity.

### Mobile Structure

On mobile, the layout collapses into a **canvas-first experience**:

- Sidebar becomes a drawer (`Sheet`)
- Top bar becomes the primary control surface
- Contextual pane becomes a bottom sheet or full-screen modal
- Canvas remains the default visible surface at all times

---

## 2. Navigation Model

### Global vs Contextual Navigation

**Global Navigation (Sidebar)**
Persistent, stable, and low frequency.

Suggested items:

- Daily Stream
- Patterns
- Work Items
- Teams / Spaces
- Settings

These represent _modes of sensemaking_, not tasks.

**Contextual Navigation**

- Filters, time range, team selection
- Work item focus
- View-specific toggles

These live outside the sidebar and should not pollute it.

### Sidebar Behavior

**Desktop**

- Persistent
- Collapsible (full ↔ icon-only)
- Width should be narrow enough to not steal canvas space
- Use shadcn/ui `Sidebar` pattern or a custom layout using `ResizablePanelGroup` if future resizing is desired

**Mobile**

- Sidebar becomes a `Sheet` from the left
- Triggered via hamburger icon in the top bar
- Auto-closes on navigation

### Top Navigation Bar

Yes, but intentionally minimal.

**Desktop Top Bar contains**

- Global search entry point
- Current scope indicator (team, project, time window)
- User menu (profile, preferences, theme toggle)

**Mobile Top Bar contains**

- Hamburger menu
- Search icon
- Scope indicator (compressed or iconified)
- Overflow menu for user actions

The top bar should never become a second navigation hierarchy.

---

## 3. Search and Discovery

### Does Ripples need global search?

Yes. Engineers expect fast, keyboard-driven discovery.

Search is essential for:

- Work items
- Historical ripples
- Teams or spaces

### Desktop Search

- Always available via keyboard shortcut
- Invoked using shadcn/ui `Command`
- Triggered from:
  - Top bar search input (read-only placeholder)
  - Cmd/Ctrl + K

The `Command` palette should be modal, centered, and scope-aware.

### Mobile Search

- Icon-triggered in the top bar
- Opens full-screen `Dialog` or `Sheet`
- Same underlying `Command` pattern, adapted for touch

Search should never compete visually with the canvas when inactive.

---

## 4. Visual System and Color Palette

### Base Assumption

Start from **shadcn/ui defaults**, which already align well with engineering tools.

### Recommended Palette Direction

- **Primary**: Muted blue or blue-gray
  - Used for selection, focus, and primary actions

- **Neutrals**: Broad gray scale
  - Most of the UI should live here

- **Accent**: Subtle teal or indigo
  - Used sparingly for emphasis or state

- **Semantic colors**:
  - Use only where meaning is explicit
  - Avoid red/green binaries that imply judgment

### Color Usage Principles

- Canvas is mostly neutral
- Color indicates _state or focus_, not performance
- Avoid heatmaps or alarmist tones by default
- Dark mode is first-class, not an afterthought

### Light and Dark Mode

- Identical layout and hierarchy
- Contrast tuned for long reading and scanning
- Avoid pure black backgrounds, prefer dark gray surfaces

---

## 5. Component-Level Guidance (shadcn/ui)

### Core Structural Components

- `Sidebar`
  - Desktop persistent
  - Mobile via `Sheet`

- `NavigationMenu`
  - Used inside sidebar

- `Sheet`
  - Mobile navigation
  - Contextual panes

- `Command`
  - Global search

- `Tabs`
  - Used sparingly for sub-views within a mode

- `Card`
  - For secondary surfaces, not the canvas

- Layout primitives
  - `ScrollArea`
  - `Separator`
  - `ResizablePanelGroup` (optional future extensibility)

### Responsive Behavior Highlights

| Component    | Desktop                  | Mobile                  |
| ------------ | ------------------------ | ----------------------- |
| Sidebar      | Persistent               | Drawer (`Sheet`)        |
| Top Bar      | Utility strip            | Primary control surface |
| Search       | Keyboard-first `Command` | Full-screen modal       |
| Context Pane | Right side               | Bottom sheet or modal   |

---

## Desktop Layout Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Top Utility Bar                                              │
│ [ Search ]   [ Team ▾ ]                     [ User ▾ ]      │
├───────────────┬─────────────────────────────┬───────────────┤
│               │                             │               │
│  Sidebar      │        Main Canvas          │ Context Pane  │
│               │     (Daily Ripples)         │ (Optional)   │
│  • Stream     │                             │               │
│  • Patterns   │                             │               │
│  • Work       │                             │               │
│  • Teams      │                             │               │
│               │                             │               │
└───────────────┴─────────────────────────────┴───────────────┘
```

---

## Mobile Layout Diagram

```
┌─────────────────────────────┐
│ ☰   Ripples        🔍   ⋮   │
├─────────────────────────────┤
│                             │
│        Main Canvas           │
│     (Daily Ripples)          │
│                             │
│                             │
└─────────────────────────────┘

Sidebar → slides from left (Sheet)
Context → bottom sheet or full-screen modal
Search → full-screen Command dialog
```

---

## Reasoning for Key Decisions

- **Persistent sidebar on desktop** reinforces spatial memory and calm usage over time.
- **Canvas dominance** aligns with narrative-first design, everything else supports it.
- **Optional context pane** allows depth without clutter.
- **Command-based search** matches engineering muscle memory.
- **Mobile simplification** preserves intent, not parity.

Ripples should feel like a quiet observatory, not a dashboard. The layout must recede so that temporal patterns can surface naturally.

---

## Optional Extensibility Notes

- Right contextual pane can later host:
  - AI-assisted summaries
  - Drift explanations
  - Cross-team comparisons

- Sidebar can support plugin-style extensions without rework.
- Command palette can evolve into the primary power-user interface.
