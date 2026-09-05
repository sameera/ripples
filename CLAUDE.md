# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project Overview

Ripples is an open-source **AI Scrum Master** — an agent with long-term execution memory
that checks in with a team daily, notices when work stops moving, and intervenes.

See [`README.md`](README.md) for the product argument and
[`docs/product/context.md`](docs/product/context.md) for personas, anti-goals, metrics and
the v1 scope.

**v2 is a clean slate.** The v1 tree (Nx monorepo, React 19, Fastify, DynamoDB) was removed
in `b9389a0`. Do not carry v1 assumptions forward — it is not the v2 stack.

## Architecture

Ripples is an [AWS Strands Agents](https://strandsagents.com/) agent in **TypeScript**,
running on **Amazon Bedrock** and hosted on **Bedrock AgentCore Runtime**.

Strands has no filesystem auto-discovery — the layout below is our convention, not the
framework's:

- `src/agent.ts` — the `Agent`, its `BedrockModel`, tools and system prompt.
- `src/tools/*.ts` — one typed tool per file; Zod `inputSchema`.
- `src/skills/<name>/SKILL.md` — on-demand procedures. Intervention logic belongs here,
  never in the always-on system prompt, which costs context every turn.
- `src/channels/*` — Microsoft Teams is the primary conversational surface. AWS provides
  no managed Teams adapter; we host the messaging endpoint ourselves.
- `src/server.ts` — the AgentCore Runtime contract: `GET /ping` and `POST /invocations`
  on port 8080, packaged as an ARM64 container in ECR.
- `schedules/*` — EventBridge Scheduler definitions; the daily loop lives here, in UTC.

Conversation memory is **AgentCore Memory**, keyed by a `runtimeSessionId` derived from the
conversation — never randomly generated. The product record — work items, ripples, signals,
interventions, outcomes, playbooks — is separate application state and does **not** live in
AgentCore Memory. Its persistence is not yet chosen.

## Development

The project is not yet scaffolded. It will be a plain Node 22+ TypeScript project:

```bash
npm install @strands-agents/sdk @aws-sdk/client-bedrock-agentcore express zod
```

Running locally means running the same Express server the container runs, with AWS
credentials from the local profile. Update this section once the scaffold lands.

## Technical Patterns and Standards

- **[Technology Stack](docs/system/stack.md)** — what is decided, and what is deliberately
  still open. Read the "Open" section before assuming a database, frontend, test framework, or that
  LangGraph is in play.
- **[Agent Conduct](docs/system/standards/agent-conduct.md)** — the non-negotiable
  constraints on when the agent may act, what it may infer, and what it must make visible.
  Code that violates one of these is wrong regardless of quality.
- **[Strands + AgentCore Runtime](docs/system/standards/strands-runtime.md)** — which
  Strands or AgentCore primitive owns which job, and which platform affordances are
  off-limits.

## Code Style

- Double quotes for strings.
- 4-space indentation, spaces not tabs.
- TypeScript with explicit type annotations, except for long generics that add no clarity.
- Explicit semicolons; do not rely on automatic semicolon insertion.
- No AI generation notices or attribution comments in generated code.

## In-flight decision stubs

When you make a non-obvious implementation choice — you picked between viable approaches —
append a stub to your per-user scratch inside the epic's queue entry, **at the moment of
choosing**, not later:

```
.nexus/queue/epic-<epic-issue-number>/<your-username>/decisions-<branch>.md
```

- `<epic-issue-number>` — the GitHub issue number of the epic your story belongs to.
- `<your-username>` — your GitHub login (`gh api user --jq .login`; fall back to a slug of
  `git config user.name`).
- `<branch>` — current branch with `/` → `-`. Append-only; one file per branch.

```markdown
## <date> — <short decision title>
- **Choice:** <what was chosen>
- **Why:** <one sentence>
- **Refuted alternative:** <the viable option not taken, or "none">
```

**Resolving `<epic-issue-number>`** — do this silently; a stub in the wrong folder is worse
than none. Find your story issue (the number in the branch name, or the issue the open PR
closes), `gh` its **parent epic issue**, and take that number; else **write nothing**.
Resolution is issue-only — never look for a queue entry, an `epic.md`, or a matching
directory name: the entry is born at close, at this same `epic-<epic-issue-number>` directory.

This scratch is committed — ordinary commits carry it through the PR. It is a pre-checkpoint
hint the lead-run stages (hld, analyze, close) mine and verify against the diff, never
load-bearing; the distiller deletes the whole entry post-merge, so never link these paths.
Working notes go beside it as `notes-<branch>.md`. Obvious choices get no stub.
