# 🌊 Ripples

**See how work actually moves—day by day.**

Ripples is an open-source **execution visibility layer** that helps teams and managers understand _real progress_, not just task state.

Most tools tell you **where work is**.
Ripples shows you **how work is moving**.

---

## Why Ripples Exists

Kanban boards, issue trackers, and sprint tools are great at answering:

> “What stage is this work in?”

They’re much worse at answering:

- Is this work actually progressing day to day?
- Where is execution quietly stalling?
- What keeps getting _intended_ but not _done_?
- Why does risk only become obvious right before a slip?

Ironically, the most honest signal already exists—in **daily standups**, async updates, and Slack threads.
But that signal is fleeting, chronological, and quickly lost.

Ripples preserves that signal and makes it visible over time.

---

## The Core Idea

**Progress is temporal, not just positional.**

Execution reality shows up as _small daily changes_—or the lack of them.

Ripples captures those changes as **daily deltas**, anchors them to real work items, and renders them as a time-based canvas you can actually reason about.

Think of it as watching the **ripples on the surface**, instead of staring at a static board.

---

## What Ripples Is

- A **time-centric execution canvas**
- A **work-anchored async standup surface**
- A **shared execution memory** for teams
- A **sensemaking tool** for managers

It sits _alongside_ tools like Jira, Linear, GitHub Issues, or Slack—it does not replace them.

---

## What Ripples Is _Not_

Ripples is intentionally **not**:

- A performance surveillance tool
- A metric or KPI dashboard
- A Kanban or Scrum replacement
- A standup bot that nags people
- A system that infers progress from activity alone

No scorecards.
No hidden judgment.
No “green/red” theater.

---

## How It Works (At a High Level)

Ripples is built around a few simple primitives:

- **Work Items** – stories, tasks, incidents, objectives
- **Days** – the atomic unit of visibility
- **Ripples** – short daily updates answering:
  - What changed?
  - What was intended?
  - What blocked progress?
  - How confident does this feel?

- **Stagnation** – days passing without meaningful movement

From this same data, Ripples can render:

- A **team-friendly daily execution stream**
- A **manager-only pattern view** that highlights drift, blockage, and risk

Teams never “report to a dashboard.”
Managers never read raw standup logs.

---

## Design Principles

- **Narrative first, diagnosis second**
  Humans think in stories. Patterns emerge later.
- **Work-anchored, not people-anchored**
  Updates attach to work, not individuals.
- **Explicit intent over inferred activity**
  Humans declare progress. Automation can assist—but not replace that.
- **Psychological safety by design**
  Visibility without performative pressure.

---

## Who Ripples Is For

- Teams doing async or distributed work
- Engineering, product, design, or ops teams
- Managers who want _early_ execution signals
- Anyone tired of discovering problems too late

---

## Why Open Source

Execution transparency works best when it’s **trusted**.

Ripples is open source so teams can:

- Inspect the model
- Adapt it to their workflows
- Avoid black-box interpretations of their work
- Build on top of it without vendor lock-in

---

## Status

Ripples is under active development.
The model is opinionated. The ideas are deliberate.
Feedback, issues, and contributions are very welcome.

---

## In One Sentence

> **Ripples helps you see how work actually unfolds—one day at a time—before problems turn into surprises.**

---

## Running the Project

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 10+ (`npm install -g pnpm`)
- [Docker](https://docs.docker.com/get-docker/) (for local DynamoDB)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in your organization and Cognito values:

| Variable | Required | Description |
|---|---|---|
| `ORG_NAME` | Yes | Your organization's display name |
| `ORG_TIMEZONE` | No | IANA timezone (default: `UTC`) |
| `COGNITO_USER_POOL_ID` | Yes | Your Cognito User Pool ID (e.g. `us-east-1_Abc123`) |
| `COGNITO_CLIENT_ID` | Yes | Your Cognito App Client ID |

All other defaults in `.env.example` are pre-configured for local development.

### 3. Start local DynamoDB

```bash
docker compose up -d
```

### 4. Bootstrap the database

Creates the `ripples` table and all indexes. Safe to re-run — skips if the table already exists.

```bash
pnpm db:bootstrap:local
```

### 5. Start the development servers

```bash
# API (http://localhost:3000)
npx nx serve api

# Web (http://localhost:4200)
npx nx serve ripples
```

### Connecting to real AWS

Set your AWS credentials (via environment variables, `~/.aws/credentials`, or an IAM role), then run:

```bash
# Remove or unset DYNAMODB_ENDPOINT in .env, then:
pnpm db:bootstrap
```

The bootstrap script uses `AWS_REGION`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` from the environment, or falls back to the AWS credentials chain.
