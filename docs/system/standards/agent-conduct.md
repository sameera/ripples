---
standard: Agent Conduct
category: architecture
applies_to: ["agent", "strands", "channels", "schedules", "tools"]
description: The non-negotiable constraints on when the Ripples agent may act, what it may infer, and what it must make visible.
---

# Agent Conduct

These are product-defining constraints, not style preferences. Ripples is an agent that
talks to people about their work; the boundaries are the design. Code that violates one
of these is wrong even when it passes review on every other axis.

Source of truth for the intent behind these rules: `README.md`
("What Ripples Is _Not_", "Design Principles").

> No exemplar paths are listed below — v2 has no implementation yet. The first
> implementation of each area sets the exemplar; add the path here when it lands.

## Decisions

### Intervention escalates only as far as it must

**Decision**: Interventions run a fixed ladder — **Notice → Ask → Assist → Connect →
Escalate**. An intervention starts at the cheapest level that could plausibly work and
moves up only when the level below it has been tried and did not unblock the work.
Skipping levels requires an explicit playbook rule, never agent judgment alone.

**Rationale**: The cheapest effective intervention is the correct one. An agent that
reaches for Escalate is expensive socially, not just computationally, and a team that
learns it escalates early stops talking to it.

**Exemplar**: none yet.

### Playbooks decide when the agent acts, not hardcoded thresholds

**Decision**: The rules that decide whether a work item is stalled, and how far the agent
may go, live in team-editable playbooks. Thresholds ("four days without movement") are
playbook data, not constants in tool code.

**Rationale**: "Stalled" is team-specific and contested. Open source is the trust story;
a team that cannot edit the rule cannot audit the judgment.

**Exemplar**: none yet.

### Progress is self-declared, never inferred

**Decision**: Confidence, blockers and progress come from what a human said. The agent
may read work-tracker state and conversation history to decide *what to ask*; it may
never derive a progress or confidence value from activity signals.

**Rationale**: Inferred progress turns the agent into a surveillance tool and makes its
record wrong in exactly the cases that matter — quiet work that is going fine, and busy
work that is going nowhere.

**Exemplar**: none yet.

### Every action is anchored to a work item

**Decision**: Ripples, signals, interventions and outcomes attach to a work item. There
is no person-scoped record, no per-person aggregate, and no query shape that returns
"how is this person doing".

**Rationale**: Work-anchored, not people-anchored. The data model is what makes the
"no scorecards" promise real; a schema that supports person-level rollups will
eventually be used for them.

**Exemplar**: none yet.

### The agent's own effectiveness is part of the record

**Decision**: Every intervention records its level, what it did, and its outcome —
whether the work unblocked and how long it took. Interventions without a recorded
outcome are an incomplete implementation, not an acceptable shortcut.

**Rationale**: The loop the README promises ("you can audit it") only closes if the
agent's misses are as legible as its hits.

**Exemplar**: none yet.

### Model access goes through Bedrock

**Decision**: Models are reached through Strands' `BedrockModel` against Amazon Bedrock,
named by inference-profile model id. Do not add a provider SDK, and do not manage a
provider API key in the project — credentials come from the runtime's IAM role.

**Rationale**: An IAM role is revocable, auditable and attributable in CloudTrail; a
provider key in the environment is none of those. It also keeps model choice a config
change rather than a code change, and keeps a self-hosting team inside one trust boundary.

**Exemplar**: none yet.

## Prohibitions

- **Never** infer progress, confidence or blockedness from commit counts, keystrokes,
  hours online, message volume, or any other telemetry — it is self-declared only.
- **Never** send a report about a person that the person cannot see. Every intervention
  is visible to the person it is about.
- **Never** escalate without announcing it to the owner first. The agent tells you
  before it tells your manager.
- **Never** ignore a back-off. A back-off on a work item, or globally, is honored until
  the person lifts it — including by schedules and by other channels.
- **Never** act on someone's behalf without them knowing. Assist drafts and proposes;
  the human keeps the veto.
- **Never** produce a score, grade, rating, ranking or red/amber/green status for a
  person or a team. Ripples has no scorecards.
- **Never** let AgentCore Memory's extraction stand in for a declared answer. A semantic
  or summary memory record is the agent's recollection, not the person's statement; a
  progress or confidence value must trace to something a human said.
- **Never** ship an intervention path whose reasoning the agent cannot explain on
  request. "Why are you asking me this?" always has an answer.
- **Never** re-ask a question the record already answers. A bot with no memory nags.

## Budgets

| Budget | Limit | Scope |
| ------ | ----- | ----- |
| Unsolicited messages to one person, one work item | 1 per day | All channels and schedules combined |
| Escalation notice before escalating | Owner notified first, always | Every Escalate-level intervention |

## Checklist

- [ ] Intervention starts at the lowest plausible ladder level, and the level below was tried.
- [ ] Thresholds read from a playbook, not hardcoded.
- [ ] No progress/confidence value derived from activity signals.
- [ ] Record attaches to a work item, not a person.
- [ ] Intervention writes an outcome, not just an action.
- [ ] Back-off state checked before any outbound message, on every channel and schedule.
- [ ] The action can be explained, inspected and reversed.
