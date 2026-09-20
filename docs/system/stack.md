---
stack: Primary Technology Stack
version: 2.3.0
last_updated: 2026-09-06
---

# Technology Stack

Ripples v2 is a clean slate. The v1 tree (Nx monorepo, React 19 + Vite, Fastify 5,
DynamoDB) was removed in `b9389a0 chore: clean up for v2` and nothing in it carries forward
by inheritance. Fastify appears again under "Decided" below, chosen on its own merits for
v2 — treat every other v1 choice as absent.

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
- **Default model**: `google.gemma-3-12b-it` — Gemma 3 12B IT, served by Bedrock as a
  managed on-demand model. 128K context window, 8K max output tokens, text and image in,
  text out. This replaces the SDK's own Claude default; it is a deliberate choice, so do
  not let a Strands sample reintroduce the default model id.
- **Access path**: the Bedrock `ConverseStream` API on the `bedrock-runtime` endpoint,
  which `BedrockModel` wraps.
- **Tool calling**: client-side only — which is the only kind Strands' agent loop uses.
  Server-side tool calling is not supported for this model.
- **Structured outputs** are supported on `bedrock-runtime`. Prefer them for any skill that
  must return a typed verdict; do not lean on tool-call fidelity from a 12B model where a
  schema-constrained response will do.
- **In-Region inference only.** Gemma 3 publishes no Geo and no Global cross-Region
  inference profile, so the model id carries no `global.` or `us.` prefix and the
  deployment region is a real choice rather than a default. Supported: `us-east-1`,
  `us-east-2`, `us-west-2`, `eu-west-1`, `eu-west-2`, `eu-central-1`, `eu-north-1`,
  `eu-south-1`, `ap-northeast-1`, `ap-south-1`, `ap-southeast-2`, `ap-southeast-3`,
  `ap-southeast-4`, `sa-east-1`.
- **No prompt caching, no `CountTokens`.** Neither is listed on the model card. Do not
  build a `cacheConfig` path, and do not assume a cached-prefix cost model when estimating
  what an always-on system prompt costs — the only lever is keeping it short, which is
  already why intervention logic lives in skills.
- **What an open-weights judge buys**: Ripples is self-hosted and its trust story is that a
  team can read and run the whole thing. Open weights keep the option of moving inference
  onto a team's own hardware without changing the product. The cost is judgment quality on
  the one call that matters — the M1 gate in the MVP roadmap is what tests it.

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

**Deferred for the MVP.** AgentCore Runtime is not publicly HTTP-addressable — it is reached
by a signed `InvokeAgentRuntime` call — so hosting the agent there forces a second service to
hold credentials and serve HTML. Strands is a library; nothing requires the Runtime. The MVP
therefore runs the agent in-process in the one Fastify app, behind an `AgentGateway`
interface, and still serves `/ping` and `/invocations` so the same image can be pointed at the
Runtime later without a rebuild. **Trigger for revisiting**: the deployment stops being
single-tenant, or needs per-session isolation, managed long sessions or the GenAI
Observability dashboard — or Teams arrives and a public front door has to exist anyway.
See the MVP roadmap for the reasoning.

### HTTP server

- **Framework**: **Fastify 5** on Node 22. One app serves the site's HTML routes and the
  Runtime contract (`GET /ping`, `POST /invocations`) in the same process.
- **Rationale**: JSON Schema validation declared on the route rather than asserted inside
  the handler, native async handlers with no wrapper needed to surface a rejected promise,
  and an encapsulated plugin model that keeps a two-endpoint container from accumulating
  global middleware. The Runtime contract is two paths and a port — it is framework-agnostic,
  so the choice is ours to make on ergonomics.
- **Streaming**: a streamed agent turn is written to `reply.raw`, bypassing the serializer.
  `reply.hijack()` where Fastify must be told the response is no longer its own.

### Web UI

- **Server-rendered from the Fastify app**, with **htmx** for the conversational turn. No
  separate SPA build, no second deploy.
- **Rationale**: the surface is a form, a thread and a list. htmx swaps fragments the server
  already renders, so the check-in preview and the dashboard row come out of one template —
  which makes "the person sees the exact row their statement will produce" a structural
  property rather than something a test has to defend.
- **Refuted**: a React SPA. Alpine AJAX fits equally well but carries a thinner ecosystem.

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

### Persistence for the execution record

- **PostgreSQL.** Work items, ripples, signals, interventions, outcomes and playbooks.
- **Rationale**: the team view is a query over the record, the deployment is single-tenant,
  and a self-hosting team can already run it. AgentCore Memory remains not a candidate, for
  the reasons above.
- **Refuted**: DynamoDB — v1's choice, and the access pattern here is not its shape.

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
- **Local run**: the same Fastify server the container runs — `POST /invocations` against
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
- **The Microsoft Teams channel.** Teams stays the primary conversational surface, but
  AWS provides no managed channel adapter. A Teams bot needs an Azure Bot Service
  registration with an HTTPS messaging endpoint, which we host and which calls the agent
  runtime. The shape of that endpoint, and how Adaptive Cards are rendered, is undecided
  and is real work.
- **Infrastructure as code.** AWS CDK in TypeScript keeps the stack one language, but
  nothing is chosen; the raw `bedrock-agentcore-control` CLI calls are the documented path.
- **AWS region**, and whether the deployment is single-region. Now constrained rather than
  free: the region must be one where Gemma 3 12B is available, because there is no
  cross-Region inference profile to fall back on.
- **Work-tracker integrations** — Jira, Linear, GitHub Issues are named as read/write
  targets in the README; none is implemented or chosen as first.
- **Testing stack** — unit, integration, and agent-behavior evals. AgentCore has an
  evaluations capability; whether we use it is undecided.
- **Package manager and repo shape** — monorepo vs single package.
- **A stronger model for the substance judgment.** Gemma 3 12B is the default for every
  path including `assess-update`. **Trigger for revisiting**: the M1 gate — if the agent's
  substantive/thin call cannot reach 85% agreement against the labelled fixture set, or if
  probe quality is visibly poor, the judgment moves to a larger model and Gemma stays on
  the routine paths. Decide it on the fixture numbers, not on a hunch.
