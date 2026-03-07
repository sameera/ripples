# Information Architecture

> Canonical reference for all Ripples product concepts. All product briefs, feature specs, and design documents must treat this document as the single source of truth. Do not re-define, rename, or re-engineer the entities, relationships, or terminology defined here without updating this document first.

---

## 1. Entity Hierarchy

Ripples organises its data along two axes: a **structural hierarchy** (ownership and grouping) and a **temporal axis** (Day) that cuts across everything.

```
Organization
└── Team
    └── Stream
        ├── Sprint  ←  optional temporal grouping within a Stream
        └── [Work Items]  ←  Work Items may belong to one or more Streams

Work Item  ←  belongs to one or more Streams; accumulates Ripples over time
    └── Ripple (anchored to a Day)

Day     ←  temporal axis; a cross-cutting dimension, not a child of any entity
Sprint  ←  also a temporal lens; a named window of Days within a Stream
User    ←  belongs to one Organization; member of one or more Teams
```

**Reading the hierarchy:**

- An Organization contains one or more Teams.
- A Team contains one or more Streams.
- A Stream optionally contains Sprints and references one or more Work Items.
- A Sprint is a named, bounded time window within a Stream, grouping a subset of Work Items for a defined period.
- A Work Item may belong to one or more Streams and accumulates Ripples over time, one per User per Day.
- Day is the atomic unit of time. Every Ripple is stamped to exactly one Day.
- Stagnation is a derived condition, not a stored entity. It is computed from the absence of approved Ripples on a Work Item over consecutive Days.

---

## 2. Entity Definitions

### 2.1 Organization

| Attribute | Detail |
|-----------|--------|
| **What it is** | The top-level account container. Represents a company, product team, or open-source project that has adopted Ripples. |
| **Key attributes** | Name, slug/identifier, created date, billing/plan tier (future) |
| **Relationships** | Contains zero or more Teams; contains zero or more Users |
| **Cardinality** | A User belongs to exactly one Organization. An Organization has one or more Teams. |

### 2.2 Team

| Attribute | Detail |
|-----------|--------|
| **What it is** | A named group of Users within an Organization. Teams are the primary unit of scope for visibility. A "team" in Ripples mirrors a real engineering or product team. |
| **Key attributes** | Name, description, member list (Users), team leader(s) (Users), parent Organization |
| **Relationships** | Belongs to one Organization; contains one or more Streams; has one or more Users as members; has one or more Users designated as Team Leaders |
| **Cardinality** | An Organization has one or more Teams. A Team has one or more Streams. A User may be a member of more than one Team. A Team has at least one Team Leader. |

**Notes:** The Team is the default scope for the Pulse and Patterns views. When a user opens Ripples, they see their Team's work by default. Team Leaders are responsible for reviewing and approving Retroactive Ripples submitted by members of their Team.

### 2.3 Stream

| Attribute | Detail |
|-----------|--------|
| **What it is** | A logical grouping of Work Items within a Team. A Stream represents a bounded area of work — an initiative, a product area, a service, a quarter's roadmap, or a sustained domain. It is the closest equivalent to a "project" in other tools, but the canonical term in Ripples is **Stream**. |
| **Key attributes** | Name, description, status (active / archived), stagnation threshold (days, default: 3), parent Team |
| **Relationships** | Belongs to one Team; contains zero or more Sprints; references one or more Work Items |
| **Cardinality** | A Team has one or more Streams. A Stream references zero or more Work Items. A Stream has zero or more Sprints. A Work Item belongs to one or more Streams. |

**Notes:** The words "Project" and "Space" are not used. The canonical term is Stream. See Glossary. Each Stream carries its own stagnation threshold, which defaults to 3 Days and may be configured independently per Stream.

### 2.4 Sprint

| Attribute | Detail |
|-----------|--------|
| **What it is** | A named, time-boxed iteration within a Stream. A Sprint defines a bounded window of Days and the subset of Work Items the team is committing to within that window. Sprints are optional — teams that do not use iteration-based planning may never create them. When present, a Sprint acts as an alternative scoping lens to an arbitrary time range. |
| **Key attributes** | Name (e.g. "Sprint 12"), goal / description (optional), start date, end date, status (planned / active / completed), parent Stream, Work Items included |
| **Relationships** | Belongs to one Stream; references zero or more Work Items from that Stream; spans a contiguous range of Days |
| **Cardinality** | A Stream has zero or more Sprints. A Sprint belongs to exactly one Stream. A Work Item may appear in zero or more Sprints. A Sprint spans a contiguous set of Days (defined by start and end date). |

**Notes:** Sprints do not own Work Items — they reference them. A Work Item continues to exist in its Stream(s) regardless of whether it appears in any Sprint. Sprint membership is an association, not a transfer of ownership. A Work Item may appear in multiple Sprints simultaneously or across time (e.g. carry-over, multi-sprint epics).

### 2.5 Work Item

| Attribute | Detail |
|-----------|--------|
| **What it is** | A discrete unit of work being tracked in Ripples. Work Items are the anchors for all Ripples. They represent stories, tasks, incidents, objectives, or any bounded unit of effort a team is executing against. |
| **Key attributes** | Title, description, type (story / task / incident / objective / other), status, owner (User), member Streams (one or more), external reference (e.g. Jira issue key, Linear ID — future), created date, last Ripple date |
| **Relationships** | Belongs to one or more Streams; may be referenced by zero or more Sprints; has zero or more Ripples; has one optional owner (User) |
| **Cardinality** | A Stream references zero or more Work Items. A Work Item has zero or more Ripples. A Work Item belongs to one or more Streams. A Work Item may appear in zero or more Sprints. |

**Notes:** Work Items are the unit of execution visibility. A Work Item without approved Ripples for multiple consecutive Days is a candidate for Stagnation detection. A Work Item that spans multiple Streams (e.g. a platform initiative touching multiple product areas) is visible in all of its member Streams.

### 2.6 Ripple

| Attribute | Detail |
|-----------|--------|
| **What it is** | A short daily update authored by a User about a Work Item on a specific Day. A Ripple captures the delta of that day: what moved, what was intended, what is blocking, and how confident the author feels. Ripples are the core signal in Ripples. |
| **Key attributes** | Work Item (reference), Day (date), Author (User), what changed (free text), what was intended (free text, optional), blocker (free text, optional), confidence level (low / medium / high), is_retroactive (boolean), approval_status (pending / approved / rejected — retroactive only), approved_by (User — retroactive only), created timestamp |
| **Relationships** | Belongs to one Work Item; belongs to one Day; authored by one User; optionally approved by one Team Leader |
| **Cardinality** | A Work Item has zero or more Ripples. A Day can have zero or more Ripples across all Work Items. A User authors zero or more Ripples. One User can author at most one Ripple per Work Item per Day. |

**Notes:** The term "Ripple" is canonical. It is never called an "update", "standup", "check-in", or "log entry". See Glossary.

A Ripple authored for a Day before the current date is a **Retroactive Ripple**. Retroactive Ripples are permitted but must be flagged and submitted to the Team Leader for approval before they are treated as authoritative. See §2.10 for the Retroactive Ripple workflow.

### 2.7 Day

| Attribute | Detail |
|-----------|--------|
| **What it is** | The atomic unit of temporal visibility in Ripples. A Day is a calendar date. It is not a sprint, not a week, not a cycle — it is a single calendar date. Days are the temporal axis against which all Ripples are plotted. |
| **Key attributes** | Calendar date (ISO 8601), day-of-week, is-weekend flag (for display filtering purposes) |
| **Relationships** | A Day has zero or more Ripples across the entire system (across all Work Items and Users). A Sprint spans a contiguous range of Days. |
| **Cardinality** | Day is a dimension, not a stored entity per se. Every Ripple is stamped to exactly one Day. |

**Notes:** Days are not "created" — they exist as a continuous timeline. The product renders Days on the canvas as a temporal axis. A Day with no approved Ripples on a given Work Item contributes to Stagnation.

### 2.8 User

| Attribute | Detail |
|-----------|--------|
| **What it is** | A person with an account in Ripples. Users author Ripples, own Work Items, and are members of Teams. |
| **Key attributes** | Name, email, role (member / team leader / admin), member Teams, avatar, created date |
| **Relationships** | Belongs to one Organization; member of one or more Teams; authors zero or more Ripples; optionally owns zero or more Work Items; may be designated Team Leader of one or more Teams |
| **Cardinality** | An Organization has one or more Users. A User belongs to exactly one Organization. A User is a member of one or more Teams. A User may be Team Leader of zero or more Teams. |

**Notes on roles:**

- **Member** — the standard role. Authors Ripples, views team data within their Team scope.
- **Team Leader** — inherits all Member capabilities. Additionally reviews and approves or rejects Retroactive Ripples submitted by Members of their Team(s). A Team must have at least one Team Leader. A User may be Team Leader of more than one Team.
- **Admin** — organization-wide administrative role. Manages Teams, Streams, user membership, and system configuration. Admin does not automatically inherit Team Leader responsibilities for any specific Team.

### 2.9 Stagnation

| Attribute | Detail |
|-----------|--------|
| **What it is** | A derived condition on a Work Item indicating that it has not received an approved Ripple for a meaningful number of consecutive Days. Stagnation is the product's core signal for risk and drift. It is not authored by a User — it is computed by the system from the absence of approved Ripples. |
| **Key attributes** | Work Item (reference), stagnation start date, consecutive Days without an approved Ripple (count), severity (computed from count relative to the Stream's configured threshold) |
| **Relationships** | Derived from a Work Item, its Streams' stagnation thresholds, and its history of approved Ripples on the Day axis |
| **Cardinality** | A Work Item is either stagnant or not stagnant at any given point in time. Stagnation is not a stored entity; it is a computed view over approved Ripple history. |

**Stagnation threshold:** The threshold is the number of consecutive Days without an approved Ripple before a Work Item is considered stagnant. The default threshold is **3 Days**. The threshold is configurable per Stream. When a Work Item belongs to multiple Streams with different thresholds, the most conservative (lowest) threshold applies. Only approved Ripples count toward breaking a stagnation streak — a pending Retroactive Ripple does not resolve stagnation until it is approved.

### 2.10 Retroactive Ripple

A **Retroactive Ripple** is a Ripple submitted by a User for a Day that has already passed (i.e. the Day is before the current date at the time of submission). Retroactive Ripples are permitted to allow Users to record work that was not logged in real time.

| Attribute | Detail |
|-----------|--------|
| **What it is** | A Ripple authored for a prior Day. Flagged automatically by the system on submission. Requires Team Leader approval before being treated as authoritative for Stagnation and canvas display purposes. |
| **Approval states** | `pending` — submitted, awaiting Team Leader review. `approved` — Team Leader has accepted the Ripple. `rejected` — Team Leader has declined the Ripple. |
| **Effect on Stagnation** | A pending Retroactive Ripple does not resolve stagnation. An approved Retroactive Ripple resolves stagnation retroactively for the Day it covers. A rejected Retroactive Ripple has no effect on stagnation. |
| **Visual treatment** | Retroactive Ripples are visually distinguished on the canvas (regardless of approval state) to preserve the integrity of the real-time signal. The distinction persists even after approval. |
| **Who approves** | The Team Leader(s) of the Teams that own the Streams containing the Work Item. |

---

## 3. Navigation Structure

The sidebar represents modes of sensemaking, not task categories. Each section maps to a primary entity focus and a user intent.

| Sidebar Section | Primary Entity Focus | Secondary Entities | Primary User Intent |
|-----------------|---------------------|-------------------|---------------------|
| **Pulse** | Ripple, Day | Work Item, User, Sprint | See what moved today (and recent days) across all active Work Items within the current scope. The main canvas. Narrative first. |
| **Patterns** | Stagnation, Work Item | Ripple, Day, Sprint | Identify execution drift, recurring blockers, and stagnation trends over time. Diagnosis and insight. |
| **Work Items** | Work Item | Stream, Sprint, Ripple | Browse, search, and manage Work Items within the current scope. Navigate into a specific Work Item to see its full Ripple history. |
| **Teams / Streams** | Team, Stream, Sprint | Work Item, User | Manage organisational structure: teams, streams, sprints, and memberships. Configure the containers that Work Items live in. |
| **Settings** | User, Organization, Team | — | Manage account preferences, integrations, notification behaviour, and system configuration. |

### Intent descriptions

**Pulse** is the default landing view. It renders the temporal canvas: Days across the horizontal axis, Work Items or Ripples rendered against them. The intent is sensemaking at a glance — not task management.

**Patterns** is a diagnostic view. It surfaces derived signals: which Work Items are stagnating, where blockers repeat, what the execution cadence looks like over a longer window. Patterns views are read-only aggregates, not action surfaces.

**Work Items** is the entity browser. It provides a list and detail view for Work Items within the scoped Team, Stream, and Sprint. Users navigate here to find a specific item, review its Ripple history, or perform management actions (create, archive, reassign).

**Teams / Streams** is the structural configuration surface. It is used infrequently (setup and maintenance). Team Leaders and admins use it to define Teams, create Streams, manage Sprints, configure stagnation thresholds, and manage membership.

**Settings** covers preferences and system configuration. It is the lowest-frequency section and is not part of the daily usage loop.

---

## 4. Scope Model

### What is Scope?

Scope is the active filter context that determines which data the application displays. It is surfaced in the **Top Utility Bar** as the scope indicator and applies globally to all views except Settings.

The scope has three independently adjustable dimensions:

| Dimension | What it filters | Default |
|-----------|----------------|---------|
| **Team** | Restricts all data to Work Items, Ripples, and Streams belonging to the selected Team | The user's primary Team |
| **Stream** | Within the selected Team, further restricts data to a single Stream. Optional — if unset, all Streams in the Team are visible. | None (all Streams) |
| **Time Window** | Restricts the Days displayed on the canvas. Can be set as either a **Time Range** (arbitrary date bounds) or a **Sprint** (a named iteration). The two modes are mutually exclusive. | Time Range — last 7 days |

### Scope Hierarchy

Scope is hierarchical and additive. A Team scope always encompasses one or more Streams. A Stream scope is always nested within a Team scope. The Time Window narrows which Days are visible within that structural scope.

```
[Organization]
  └── Team (scope level 1)
        └── Stream (scope level 2, optional)
              └── Time Window (scope level 3)
                    ├── Sprint (named iteration — select a specific Sprint)
                    └── Time Range (arbitrary start/end dates; default: last 7 days)
```

You cannot select a Stream without implicitly selecting its parent Team. You cannot select a Sprint without implicitly selecting the Stream it belongs to (Sprints are scoped to a Stream).

### Time Window: Sprint vs. Time Range

These two modes of time scoping serve different workflows:

| Mode | How it is defined | When to use |
|------|------------------|-------------|
| **Time Range** | Select an arbitrary start date and end date. The canvas renders all Days in that window, regardless of any Sprint boundaries. Work Item filtering is by Stream scope, not Sprint membership. The default window is the last 7 days. | The default mode. Teams not using sprints, or any user looking at a cross-sprint window. "Show me the last two weeks." |
| **Sprint** | Select a named Sprint from the active Stream. The canvas renders the Days between the Sprint's start and end dates, and filters Work Items to those included in the Sprint. | Teams using iteration-based planning (Scrum, shaped cycles). "Show me this sprint's execution." |

When a Sprint is selected as the Time Window, the date range of that Sprint is also implied. Switching from Sprint mode to Time Range mode does not clear the dates — it converts the Sprint's date bounds into an editable date range as a convenience.

### Scope Behaviour by View

| View | Team scope effect | Stream scope effect | Time Window effect |
|------|------------------|--------------------|--------------------|
| Pulse | Shows Ripples from all Streams in Team | Narrows to Ripples from one Stream | Restricts Days and (if Sprint) Work Items shown on canvas |
| Patterns | Shows patterns across all Streams in Team | Narrows patterns to one Stream | Restricts the analysis window |
| Work Items | Lists Work Items from all Streams in Team | Lists Work Items from one Stream | If Sprint selected, filters to Sprint's Work Items |
| Teams / Streams | Shows Teams and Streams for Organisation | N/A | N/A |
| Settings | No scope effect | No scope effect | No scope effect |

### Scope is global, not per-view

When a user changes the Team, Stream, or Time Window scope in the top bar, the change applies to all views immediately. The scope persists across navigation within a session. This is intentional: scope represents "where you are looking" and should not reset when you switch sidebar sections.

---

## 5. Terminology Glossary

This glossary locks down the canonical term for every named concept in Ripples. All product documents, UI copy, code identifiers, and API contracts must use these terms. Synonyms listed are rejected alternatives — do not use them.

| Canonical Term | Rejected Synonyms | Definition |
|----------------|------------------|------------|
| **Ripple** | Update, Check-in, Standup entry, Log entry, Status update, Post | A single daily update authored by a User on a Work Item for a specific Day. |
| **Retroactive Ripple** | Backdated update, Late entry, Amended ripple | A Ripple authored for a Day before the current date, subject to Team Leader approval before taking effect. |
| **Work Item** | Task, Ticket, Issue, Card, Story (as a standalone term) | The bounded unit of work that Ripples attach to. The generic term regardless of type (story / task / incident / objective). |
| **Stream** | Space, Project, Board, Initiative, Area, Workspace (when meaning a grouping of Work Items) | A logical grouping of Work Items within a Team. Not to be confused with **Pulse** (the view). |
| **Sprint** | Iteration, Cycle, Period, Run, Phase | A named, time-boxed set of Days and Work Items within a Stream. Optional — used only by teams that work in iterations. |
| **Team** | Squad, Group, Pod | A named group of Users who share a set of Streams and are the primary scope unit. |
| **Team Leader** | Team lead, Manager, Owner, Lead | A User role within a Team with responsibility for approving Retroactive Ripples submitted by Team members. A Team must have at least one Team Leader. |
| **Organization** | Company, Account, Workspace (when meaning a top-level container), Org | The top-level container for all Teams and Users in Ripples. |
| **Day** | Sprint day, Date, Period | The atomic unit of time. A single calendar date. |
| **Time Range** | Date range, Custom range, Window | An arbitrary start/end date pair used as the Time Window scope mode when no Sprint is selected. Defaults to the last 7 days. |
| **Time Window** | Time filter, Temporal scope, Date filter | The third dimension of scope — either a Sprint or a Time Range — controlling which Days are visible on the canvas. |
| **Pulse** | Daily Stream, Daily Feed, Activity Feed, Timeline, Feed | The primary canvas view showing Ripples plotted against Days. Not to be confused with **Stream** (the entity). |
| **Patterns** | Analytics, Insights, Trends, Reports | The diagnostic view that surfaces derived signals like Stagnation over time. |
| **Stagnation** | Drift, Inactivity, Blocked (as a state), Idle | The derived condition of a Work Item having no approved Ripples for consecutive Days beyond the Stream's configured threshold (default: 3 Days). |
| **Scope** | Filter, Context, View, Lens | The active Team/Stream/Time Window combination controlling what data is displayed. |
| **Contextual Pane** | Side panel, Detail panel, Inspector, Drawer | The optional right-side panel that shows metadata or detail for a selected item without navigating away from the canvas. |
| **Canvas** | Main area, Content area, Viewport, Feed area | The dominant central region of the layout where the Pulse or other primary view renders. |
