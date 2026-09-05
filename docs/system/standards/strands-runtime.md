---
standard: Strands + AgentCore Runtime
category: architecture
applies_to: ["strands", "bedrock", "agentcore", "typescript"]
description: Which Strands or AgentCore primitive owns which job, and which platform affordances are off-limits.
---

# Strands + AgentCore Runtime

Strands and AgentCore each offer several places to put the same logic. This file records
which one wins, so an agent reading the tree does not have to guess from precedent.
Framework mechanics visible in any existing source file are deliberately absent here.

References: <https://strandsagents.com/docs/> and
<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/>.

See [`../stack.md`](../stack.md) for what the stack settles and what it leaves open.

## Decisions

### Tool vs. skill vs. sub-agent

**Decision**:
- A **tool** is a typed action with a side effect or an external read — Zod `inputSchema`,
  one exported tool per file.
- A **skill** is a procedure the model follows: a `SKILL.md` directory under the skills
  root, surfaced by name and description and loaded on demand. Anything that is multi-step
  judgment about *how to intervene* is a skill, never prose in the system prompt.
- A **sub-agent** is for work needing fresh conversation history or a narrower tool set.

The system prompt stays small: it pays context cost on every turn.

**Rationale**: Ripples' intervention logic is large and mostly conditional. Loading it
always would crowd out the execution record, which is the thing that makes the agent worth
talking to. Progressive disclosure is the whole point of the skills shape.

**Caveat**: the vended skills plugin is documented on the Python SDK. If the TypeScript
SDK does not expose it, implement the same progressive-disclosure shape — metadata in the
prompt, full instructions behind a tool call — rather than inlining the procedure.

**Exemplar**: none yet.

### The daily loop is an EventBridge schedule, not in-process timing

**Decision**: Recurring work is an Amazon EventBridge Scheduler schedule that invokes the
agent runtime. Do not implement recurring behavior by having a request handler decide
"is it time yet", and do not hold a timer inside a session.

**Rationale**: AgentCore Runtime sessions are per-conversation and not a scheduler. Time
logic hidden inside a handler is untestable and invisible in CloudWatch.

**Exemplar**: none yet.

### Schedules are UTC — team-local time is application logic

**Decision**: Cron expressions are evaluated in UTC. Any "9am for this team" behavior is
computed inside the handler, from stored team timezone data.

**Rationale**: A local-time cron expression silently drifts by an hour twice a year, in
the direction of messaging people outside working hours.

**Exemplar**: none yet.

### `runtimeSessionId` is derived, never random

**Decision**: The session id passed to `InvokeAgentRuntimeCommand` is derived
deterministically from the conversation it belongs to — the channel conversation plus the
team. Do not generate a fresh random id per invocation. The scheduled daily loop resumes
the same person's session id it would use for an inbound message.

**Rationale**: The session id is the join key for AgentCore Memory. A random id per call
gives every turn its own memory namespace, which is exactly the "bot with no memory" the
product exists to not be. Quickstart samples use `Date.now() + Math.random()`; that is
sample code, not our contract.

**Exemplar**: none yet.

### AgentCore Memory holds the conversation; the execution record does not live there

**Decision**: Conversational continuity — within a session and across sessions — is
AgentCore Memory's job, through its built-in strategies. The durable product record
(work items, ripples, signals, interventions, outcomes, playbooks) is separate
application state and is never written to AgentCore Memory.

**Rationale**: Memory records are model-extracted and namespace-scoped. The execution
record must be exactly what a human declared, queryable across people and time, and
auditable. Extraction is the wrong write path for a record whose credibility is the
product.

**Exemplar**: none yet — see the open persistence decision in [`../stack.md`](../stack.md).

### Built-in AgentCore tools are for untrusted execution only

**Decision**: Use AgentCore Code Interpreter and Browser for model-generated or untrusted
work. Do not run first-party integration logic in them — that belongs in a typed tool or
behind AgentCore Gateway.

**Rationale**: Those tools are managed sandboxes. Putting durable integration work in one
buys isolation you do not need and loses the typing and observability a tool gives you.

**Exemplar**: none yet.

### Third-party access goes through Gateway and Identity

**Decision**: Reads and writes against Jira, Linear, GitHub Issues and similar go through
an AgentCore Gateway target, with credentials brokered by AgentCore Identity. Do not put a
third-party OAuth token or API key in an environment variable.

**Rationale**: Ripples acts on a person's behalf against systems that already know who
they are. Identity keeps the acting principal explicit and revocable; an env-var token
makes every action the deployment's, which breaks the audit story in the conduct standard.

**Exemplar**: none yet.

## Prohibitions

- **Never** reach a model through a provider SDK or a provider API key. Bedrock via
  Strands' `BedrockModel` is the only path (see [`agent-conduct.md`](agent-conduct.md)).
- **Never** encode team-local time in a cron expression.
- **Never** store third-party tokens or channel signing secrets in environment variables
  or the repo.
- **Never** assume the TypeScript SDK has a Python sample's API. Python landed first;
  `AgentCoreMemorySessionManager` is one confirmed gap. Check before porting.
- **Never** write the execution record into AgentCore Memory.
- **Never** add LangGraph without the trigger stated in [`../stack.md`](../stack.md) being
  met — Strands' own Graph, Swarm and Workflow patterns come first.
- **Never** treat a Strands or AgentCore API as frozen. Both moved fast through 2025–2026;
  the TypeScript SDK is the youngest surface.

## Checklist

- [ ] Recurring behavior lives in an EventBridge schedule, not a request handler.
- [ ] Local-time behavior computed in the handler, not in the cron expression.
- [ ] `runtimeSessionId` derived from the conversation, not randomly generated.
- [ ] System prompt unchanged, or the addition genuinely applies to every turn.
- [ ] Product record written to application storage, not AgentCore Memory.
- [ ] Third-party credentials brokered by AgentCore Identity, not env vars.
