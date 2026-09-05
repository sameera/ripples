---
stack: Primary Technology Stack
version: 2.0.0
last_updated: 2026-09-05
---

# Technology Stack

Ripples v2 is a clean slate. The v1 tree (Nx monorepo, React 19 + Vite, Fastify 5,
DynamoDB) was removed in `b9389a0 chore: clean up for v2` and is **not** the v2 stack.

v2 is an **AWS Strands Agents** agent on **Amazon Bedrock**, hosted on **Bedrock
AgentCore Runtime**.

Only what is listed under "Decided" is settled. Everything under "Open" is deliberately
undecided and must not be assumed by any agent or epic.

## Decided

### Agent SDK

- **Framework**: [Strands Agents](https://strandsagents.com/) — AWS's open-source,
  model-driven agent SDK. Agents are constructed in code (`new Agent({ ... })`); there is
  **no** filesystem auto-discovery, so the project layout is ours to choose.
- **Language**: TypeScript, `@strands-agents/sdk`. **Node.js 22+.**
- **Tool schemas**: Zod. A tool is `tool({ name, description, inputSchema, callback })`.
- **Streaming**: `agent.stream(prompt)` yields an async iterator of turn events.

TypeScript is the younger half of the SDK — Python landed first and carries more
integrations (see the AgentCore Memory note below). Check the TypeScript API surface
against the docs rather than assuming parity with a Python sample.

### Models

- **Provider**: Amazon Bedrock, via Strands' `BedrockModel`. Credentials come from the
  standard AWS chain (task role in AgentCore Runtime); region is explicit.
- **Default model**: `global.anthropic.claude-sonnet-4-6` — the SDK default, reached
  through a cross-region inference profile.
- **Access path**: the Bedrock `ConverseStream` API, which `BedrockModel` wraps. Prompt
  caching is a `cacheConfig` option on the model, not something to hand-roll.

### Hosting — AgentCore Runtime

- **Runtime**: [Amazon Bedrock AgentCore Runtime](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/)
  (GA since October 2025) — a managed, framework-agnostic serverless agent runtime with
  per-session isolation and long-running sessions.
- **Container contract**: an **ARM64** Docker image in **ECR**, serving on port `8080`
  (override with `PORT`), exposing exactly two endpoints:
  - `GET /ping` → `{"status": "Healthy", "time_of_last_update": <unix ts>}`
  - `POST /invocations` → the agent turn; binary payload in, JSON out.
- **Session identity**: `runtimeSessionId` is **client-generated** and passed on
  `InvokeAgentRuntimeCommand`. It is the join key between a conversation and its memory.
- **Deploy**: `bedrock-agentcore-control create-agent-runtime` / `update-agent-runtime`.

### Memory

Two distinct things, and they must not be conflated:

- **Conversational memory** is [AgentCore Memory](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html).
  Short-term memory gives within-session continuity; long-term memory extracts across
  sessions via built-in strategies — **semantic**, **summary**, and **user preference** —
  scoped by `actorId` / `sessionId` namespaces.
- **The execution record** — work items, ripples, signals, interventions, outcomes,
  playbooks — is separate application state. AgentCore Memory is **not** its store: it is
  model-extracted, namespace-scoped and conversation-shaped, while the record is
  cross-session, queryable, and must be exactly what a human declared. Its persistence is
  an open decision below.

**Known gap**: Strands' `AgentCoreMemorySessionManager` is **Python-only**. In TypeScript,
AgentCore Memory is reached directly through `@aws-sdk/client-bedrock-agentcore` behind a
custom `SessionManager`. Strands TypeScript does ship `SessionManager` (file and S3
backends) plus append-only UUIDv7 snapshots, so the seam exists — the AgentCore binding
is what we write.

### Scheduling — the daily loop

- **Amazon EventBridge Scheduler**, one schedule per recurring job, invoking the agent
  runtime. Cron expressions are **UTC**; per-team local time is computed in the handler.

### Sandboxed execution

- AgentCore's built-in **Code Interpreter** and **Browser** tools for model-generated or
  untrusted work. Do not build a sandbox, and do not run first-party integration logic
  in one.

### Outbound integrations and credentials

- **AgentCore Gateway** turns existing APIs (OpenAPI / Smithy specs) and Lambda functions
  into managed MCP tool servers, with inbound and outbound auth.
- **AgentCore Identity** holds the agent's workload identity and brokers OAuth (including
  2LO) to third-party systems. Third-party tokens are never project secrets.

### Observability

- **AgentCore Observability** → Amazon CloudWatch, surfaced in the GenAI Observability
  dashboard: session count, latency, duration, token usage, error rates, plus OTEL spans
  for turns and tool calls.

### Development

- **Language**: TypeScript with explicit type annotations; double quotes; 4-space indent;
  explicit semicolons.
- **Local run**: the same Express server the container runs — `POST /invocations` against
  localhost, with AWS credentials from the local profile.

## Open

Not decided. Do not infer from v1 or from a Strands sample.

- **Complex orchestration — LangGraph.** Strands ships its own multi-agent patterns
  (Graph, Swarm, Workflow, agents-as-tools), and AgentCore Runtime hosts LangGraph
  equally well, so the choice stays open rather than pre-paid. **Trigger for revisiting**:
  an intervention flow that needs explicit state-machine control, durable interrupt /
  resume for human-in-the-loop, or cyclic replay that Strands' Graph cannot express
  without fighting it. Until that trigger fires, use Strands' own primitives.
  Note that LangGraph.js trails LangGraph Python in ecosystem depth.
- **Persistence for the execution record.** No database chosen. AgentCore Memory is not
  a candidate (see Memory above).
- **The Microsoft Teams channel.** Teams stays the primary conversational surface, but
  AWS provides no managed channel adapter. A Teams bot needs an Azure Bot Service
  registration with an HTTPS messaging endpoint, which we host and which calls the agent
  runtime. The shape of that endpoint, and how Adaptive Cards are rendered, is undecided
  and is real work.
- **Infrastructure as code.** AWS CDK in TypeScript keeps the stack one language, but
  nothing is chosen; the raw `bedrock-agentcore-control` CLI calls are the documented path.
- **AWS region**, and whether the deployment is single-region.
- **Web UI** — whether Ripples ships its own frontend, and on what framework.
- **Work-tracker integrations** — Jira, Linear, GitHub Issues are named as read/write
  targets in the README; none is implemented or chosen as first.
- **Testing stack** — unit, integration, and agent-behavior evals. AgentCore has an
  evaluations capability; whether we use it is undecided.
- **Package manager and repo shape** — monorepo vs single package.
- **Cheaper model for high-volume paths** (e.g. Claude Haiku 4.5 for routine check-ins).
