# Product Context

> Generated via /nxs.product-context — Last updated: 2026-01-31

## Product Overview

**Ripples** is an open-source execution visibility layer that helps teams and managers understand real progress — not just task state.

- **Category**: B2B SaaS / Team Tooling
- **Model**: Open-source core (likely open-core or services model later)
- **Position**: Complementary layer alongside Jira, Linear, GitHub Issues, Slack

### Core Value Proposition

Most tools show *where* work is. Ripples shows *how* work is moving.

Execution reality shows up as small daily changes — or the lack of them. Ripples captures those changes as daily deltas, anchors them to work items, and renders them as a time-based canvas teams can reason about.

### Core Primitives

- **Work Items** — stories, tasks, incidents, objectives
- **Days** — the atomic unit of visibility
- **Ripples** — short daily updates (what changed, what was intended, what blocked, confidence level)
- **Stagnation** — days passing without meaningful movement

---

## Vision & Strategy

### Vision

Teams discover execution problems before they become surprises. The honest signal from daily work — currently fleeting and lost in Slack threads and standups — becomes visible, persistent, and actionable.

### Strategic Bet

The richest execution signal already exists in human updates (standups, async check-ins). The gap isn't *collection* — standup bots do that. The gap is *persistence and visibility over time*, anchored to actual work.

### Current Focus (MVP Stage)

1. Nail the core update → visibility loop
2. Validate with 1-2 early teams
3. Prove the "execution memory" value prop

<!-- TODO: Verify these priorities with founder -->

---

## Anti-Goals

Ripples is intentionally **not**:

| Anti-Goal | Rationale |
|-----------|-----------|
| Performance surveillance tool | Visibility without judgment; psychological safety by design |
| Metric or KPI dashboard | Narrative first, not scorecards |
| Kanban or Scrum replacement | Sits alongside, not instead of |
| Standup bot that nags people | Humans declare progress; no automated pestering |
| System that infers progress from activity | Explicit intent over inferred activity |

**No scorecards. No hidden judgment. No "green/red" theater.**

---

## Personas

### Primary: Engineering/Product Manager

**Role**: Engineering Manager, Product Manager, Team Lead

**Goals**:
- Spot execution drift before it becomes a missed deadline
- Understand where work is stalling without micromanaging
- Get early signals on blockers and risk

**Jobs to Be Done**:
- "Help me see which work items haven't moved in days"
- "Show me patterns of stagnation across my team's work"
- "Give me confidence that things are progressing without reading every Slack thread"

**Pain Points**:
- Discovers problems only when deadlines slip
- Has to chase updates manually or rely on status meetings
- Standup logs are chronological noise, not insight

**Current Alternatives**:
- Reading Slack threads and standup bot dumps
- Manual check-ins and status meetings
- Jira/Linear dashboards (show state, not movement)

### Secondary: Team Member (IC)

**Role**: Engineer, Designer, Product team member

**Goals**:
- Share progress without performative overhead
- Surface blockers without escalation drama
- Maintain visibility without surveillance anxiety

**Jobs to Be Done**:
- "Let me quickly note what moved today on this task"
- "Flag that I'm stuck without making it a big deal"
- "Show my work is progressing without proving my productivity"

**Pain Points**:
- Standups feel performative
- Updates disappear into Slack
- Visibility tools feel like surveillance

<!-- Inferred from README positioning on psychological safety -->

---

## Domain & Industry Context

### Segment

- **Primary**: Distributed/async software teams (engineering, product, design)
- **Adjacent**: Ops teams, agencies, any team doing project-based work

### Industry Dynamics

- Remote/hybrid work is the norm; async communication increasing
- "Return to office" pressure creates tension around visibility and trust
- Existing tools optimize for state management, not execution visibility
- Standup bots are widespread but signal is lost after collection

### Compliance & Regulatory

| Requirement | Status | Applies When |
|-------------|--------|--------------|
| SOC 2 Type II | Not required for MVP | Enterprise sales, handling customer data |
| GDPR | Likely applies | EU users; daily updates may contain PII |
| Data retention policies | TBD | If persisting work updates long-term |

<!-- No health/financial data expected; regulatory posture is lightweight for MVP -->

---

## Competitive Landscape

### Direct Competitors: Standup Bots

| Competitor | Strength | Weakness (Ripples' Opportunity) |
|------------|----------|--------------------------------|
| Geekbot | Slack-native, widespread adoption | Signal is chronological and quickly lost |
| DailyBot | Multi-platform, mood tracking | Updates not anchored to work items |
| Standup Alice | Simple, async-friendly | No visibility over time |

**Ripples' differentiation**: Not a collection bot — an execution memory layer. Signal persists and is anchored to work.

### Indirect Competitors: Kanban/Project Tools

| Competitor | Strength | Weakness (Ripples' Opportunity) |
|------------|----------|--------------------------------|
| Jira | Enterprise standard, deep workflow | Shows position, not movement; dashboards are state-based |
| Linear | Dev-loved, fast UX | Same state-vs-movement gap |
| Taiga | Open-source, agile-native | Traditional board view |
| Trello | Simple, visual | No temporal visibility |

**Ripples' differentiation**: Sits alongside these tools. They answer "what stage is work in?" — Ripples answers "is it actually moving day to day?"

---

## Success Metrics

### North Star Metric

**"Surprises prevented"** — teams discovering blockers/stagnation before they cause deadline slips.

*Proxy metrics for MVP*:
- Time from stagnation start → manager awareness
- % of work items with daily update coverage

### Impact Thresholds (for RICE scoring)

| Impact Level | User Reach | Definition |
|--------------|------------|------------|
| High | >20% of users | Core loop functionality |
| Medium | 5-20% of users | Important but not blocking |
| Low | <5% of users | Nice-to-have, edge cases |

### Effort Justification (MVP stage)

| Effort Level | Max Investment | Appropriate For |
|--------------|----------------|-----------------|
| High | ~2 weeks | Core primitives (ripples, work items, day view) |
| Medium | ~1 week | Important integrations, key UX |
| Low | ~2-3 days | Polish, secondary features |

<!-- Calibrated for pre-launch MVP stage; adjust as scale increases -->

---

## Product Principles

1. **Narrative first, diagnosis second**
   Humans think in stories. Patterns emerge later. Don't lead with dashboards.

2. **Work-anchored, not people-anchored**
   Updates attach to work items, not individuals. Reduces surveillance dynamics.

3. **Explicit intent over inferred activity**
   Humans declare progress. Automation can assist but not replace that signal.

4. **Psychological safety by design**
   Visibility without performative pressure. No hidden judgment.

---

## Company Scale

| Dimension | Current State |
|-----------|---------------|
| Stage | Pre-launch, building MVP |
| Team size | Solo/small team <!-- TODO: Verify --> |
| Users | 0 (pre-launch) |
| Funding | Unknown <!-- TODO: Verify if relevant --> |

### Scoping Implications

- Focus on core loop validation, not scale
- Avoid premature optimization
- Build for 1-2 design partner teams initially
- Open-source positioning means community feedback matters early
