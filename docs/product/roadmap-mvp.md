---
product: Ripples
document: MVP Roadmap
version: 1.1.0
last_updated: 2026-09-06
status: proposed
---

# MVP Roadmap

The MVP proves one thing: **an agent that refuses to accept a status update until it
says something real.**

Everything below serves that. Where a feature does not, it is parked with a reason.

## The reset

The `discover-team-progress-surfacing` discovery resolved eleven decisions down a
Microsoft Teams path — bot install gates, channel claiming, a read-only GitHub App,
sprint iteration derivation, GitHub-login-to-person mapping. That work assumed the
conversational surface was Teams and the item set was somebody else's board.

Neither assumption holds for the MVP. The surface is a web page Ripples serves. The item
set is a list a designated team lead curates inside Ripples. Both changes remove far more
work than they add, and they let the agent skill be exercised in week two instead of
week eight.

### What survives from the discovery

These resolutions are surface-independent and carry forward unchanged:

| Resolution | Where it applies now |
| --- | --- |
| **Ticket 02** — a team view is a point-in-time list of items carrying the last human statement, its date, and what the agent did; a count is allowed only as the length of that list | The web dashboard's content rules, verbatim |
| **Ticket 03** — statements cross to the team view in the person's own words, previewed as the exact row inside the exchange; a withheld statement leaves the row standing with an empty statement slot | The posting flow and the dashboard's empty state |
| **Ticket 06** — the seam carries a structured view model, not rendered text | The dashboard renders from a domain view model. The seam is an in-process interface now rather than an HTTP hop — still a seam, so a Teams adapter is later work, not a redesign |

### What is reversed

- **A designated team lead now exists.** Ticket 12's out-of-scope list refused a lead role
  as "a person-scoped configuration surface." That refusal was about who may name a
  *GitHub board*. With the item list living inside Ripples, somebody has to own it. The
  lead owns the list; the lead is not shown anything about a person that the person cannot
  see, so the anti-goals hold.
- **Tickets 01, 04, 07, 09, 11 and 12 are parked, not applied.** Teams install gates,
  channel claiming, the weekly scheduled post, the GitHub App, iteration derivation and
  assignee resolution are all out of the MVP. The resolutions stay on file for when Teams
  returns.

## MVP in one paragraph

A team lead lists the work items in play. Each person opens the Ripples site, picks their
name from the roster, and posts an update against an item. The agent reads it and decides
whether it carries a progress indicator. If it does not, the agent asks one specific
follow-up naming what is missing — at most twice — and then accepts whatever it has and
records it honestly. The declaration lands on a team dashboard as one row per item: the
person's own words, the date they said them, and any blocker they named.

## The judgment at the centre

This is the part worth getting right; everything else is plumbing.

**The agent grades the statement, never the person and never the work.** It does not decide
whether progress happened — that would be inferring progress from evidence, which the
conduct standard prohibits outright. It decides whether the person *declared* anything.
A quiet week honestly described is a substantive update. A busy week described as "still
working on it" is not.

### A statement is substantive when it names at least one of

1. **A state change** — something that was not true before is true now.
   *"The migration script runs end to end against staging."*
2. **A named blocker** — a specific thing preventing movement, and who or what owns it.
   *"Waiting on the API contract from platform; asked Tuesday, no reply."*
3. **A revised expectation** — the item is bigger, smaller or later than believed, with
   the reason. *"This needs a schema change I didn't see, so it's not landing this week."*
4. **A completion or an abandonment** — done, or deliberately stopped.

### A statement is thin when it carries only

- Restated intent — *"still working on it", "continuing today"*
- Effort without outcome — *"spent most of the day on it"*
- A status label with nothing under it — *"in progress", "80% done"*
- The previous ripple's substance with no delta

### The push-back rule

- At most **two** follow-ups per session. Then the agent accepts.
- Every follow-up names what is missing and asks for that specifically. It never repeats
  itself and never asks what the record already answers.
- On acceptance with nothing substantive, the record says so plainly — *no substantive
  progress declared* — beside the person's own words. It does not editorialise, does not
  flag the row, and does not tell the lead anything the person did not see.
- The push-back lives entirely inside a session the person opened. Ripples sends no
  unsolicited message in the MVP, which keeps it clear of the conduct budget.

## Agent skills

Intervention logic belongs in skills, never in the always-on system prompt. Four skills
in the MVP:

| Skill | Job | Output |
| --- | --- | --- |
| `assess-update` | Apply the substance rubric to a posted update, in the context of that item's previous ripples | `substantive` \| `thin`, the indicator class matched, and — when thin — the single most useful thing that is missing |
| `probe` | Write one follow-up that asks for exactly that missing thing, citing what the record already holds so it never re-asks | One question, or a decision to stop |
| `record-ripple` | Turn the accepted exchange into a ripple: the person's own words, the date, the indicator class, a named blocker if there is one | One ripple, anchored to a work item |
| `compose-team-view` | Build the dashboard's view model from the ripple record under ticket 02's content rules | One row per item; no trend, no score, no status colour |

Two more are deliberately absent: `notice-stall` and `intervene`. Stall detection and the
intervention ladder are the next product, not this one.

## Milestones

Sized for one developer. Each milestone ends in something demonstrable.

### M0 — Walking skeleton · ~1 week

A person picks their name, sees their items, posts text, gets a reply, and the exchange is
stored. The reply may be trivial; the loop is the point.

- Node 22 TypeScript scaffold. **One Fastify 5 app** serves both the site's HTML routes
  and the Runtime contract, `GET /ping` and `POST /invocations`.
- Strands `Agent` on `BedrockModel`, model id `google.gemma-3-12b-it`. Gemma 3 publishes
  no cross-Region inference profile, so the deployment region is pinned here.
- Persistence chosen and schema laid down: `teams`, `people`, `work_items`, `ripples`,
  `turns`.
- Server-rendered pages, htmx for the conversational turn: roster picker, item list,
  composer, conversation thread.
- The item list is seeded from a config file at this stage.

**Exit**: a full round trip runs locally against Bedrock.

### M1 — The substance judgment · ~2 weeks

The wedge. This is the milestone that decides whether Ripples is a product.

- `assess-update` and `probe` as `SKILL.md` procedures.
- `assess-update` returns its verdict as a Bedrock **structured output**, not a tool call.
  A schema-constrained response is the reliable path out of a 12B model.
- The session loop: post → assess → probe → assess → probe → accept.
- `record-ripple` writes the person's words unaltered. The agent never rewrites a
  statement, only quotes it.
- "Why are you asking me this?" answers from the assessment that produced the probe.

**Exit**: a labelled fixture set of ~40 real-shaped updates. The agent's
substantive/thin call agrees with the label on 85% or more, and no fixture run produces a
rewritten statement or a judgment about a person.

This gate is also the go/no-go on Gemma 3 12B as the judge. If it misses, `assess-update`
moves to a larger Bedrock model and Gemma stays on the routine paths — decided on the
fixture numbers, not on a hunch.

### M2 — The team dashboard · ~1 week

- `compose-team-view`; one row per item — item, owner, last statement verbatim, the date
  it was said, any open blocker.
- Ticket 03's preview: inside the exchange, before it lands, the person sees the exact row
  their statement will produce.
- A withheld statement leaves the row standing, with its date and an empty statement slot.
- No burndown, no velocity, no completion percentage, no red/amber/green, no week-over-week
  count.

**Exit**: the dashboard is legible with no explanation, and nothing on it ranks a person.

### M3 — The lead's list · ~half a week

- The designated lead adds items, edits titles, assigns an owner from the roster, and
  closes items — in the UI, not a config file.
- One lead per team, named in deployment config.

**Exit**: a lead can run a sprint's worth of items without touching the filesystem.

### M4 — Memory: the next question, not the same one · ~1.5 weeks

- AgentCore Memory reached through `@aws-sdk/client-bedrock-agentcore` behind a custom
  `SessionManager` — the TypeScript gap the stack document names.
- The session id derived from (team, person, work item), never random. In-process it keys
  AgentCore Memory directly, and it is the same value `InvokeAgentRuntime` would carry as
  `runtimeSessionId`.
- The probe cites the specific previous statement rather than repeating a question.
- The ripple record, not memory extraction, remains the source of every declared value.

**Exit**: on the second day the agent opens by referencing what was actually said on the
first, and no declared value traces to a model-extracted memory.

### M5 — Evals, back-off and deploy · ~1 week

- Behavioural eval suite over the fixture set: substance calls, probe quality, the
  never-infers check, back-off honoured, no scorecard language anywhere in output.
- Back-off, per item and globally, honoured by the site.
- One ARM64 container — the Fastify app with the agent in-process. A pilot team runs it
  with `docker run` or a single Fargate service.
- The `AgentGateway` seam exercised against a stub, so the AgentCore Runtime path stays a
  config change rather than untested code.

**Exit**: a pilot team can install and run it from the README.

**Total: roughly six to seven weeks.**

## Decisions taken with this roadmap

| Decision | Choice | Why | Refuted alternative |
| --- | --- | --- | --- |
| Item set | A list a designated lead curates inside Ripples | The agent skill is the risk; a tracker integration is known work that delays reaching it | Reading a GitHub project sprint (discovery ticket 08/12) — parked, not dismissed |
| Identity | Operator-seeded roster, name picked, held in a signed cookie | Self-hosted on a trusted network. Zero auth build in the milestone that should be about judgment | GitHub OAuth; email magic link, which adds outbound email as an operational dependency |
| Push-back depth | Bounded at two follow-ups, then accept and record honestly | "An agent people avoid is a failed agent." Unbounded probing is the fastest way to lose the north-star metric | Persist until substantive; flag the row for the lead, which adds a person-visible negative marker |
| Persistence for the execution record | PostgreSQL | The dashboard is a query over the record, the deployment is single-tenant, and a self-hosting team can already run it. Closes the stack document's open item | DynamoDB — v1's choice, and the access pattern here is not its shape |
| Web surface shape | Server-rendered from the same Fastify app, htmx for the conversational turn | The whole surface is a form, a thread and a list. htmx swaps fragments the server already renders, so the M2 preview and the dashboard row come out of one template — "the exact row" becomes structural rather than something a test has to defend | A React SPA — a second build, a second deploy and a duplicated row renderer. Alpine AJAX fits equally well but carries a thinner ecosystem |
| Deployable shape | One: a single Fastify app with the Strands agent in-process, behind an `AgentGateway` interface | AgentCore Runtime is not publicly HTTP-addressable; it is reached by a signed `InvokeAgentRuntime` call (ticket 01). Hosting the agent there forces a second service to hold credentials and serve HTML, whatever the frontend is. Strands is a library and nothing requires the Runtime, so the MVP declines the second deployable and keeps a shorter README — which is M5's exit criterion | Two deployables, the agent on AgentCore Runtime — deferred behind the gateway interface, not refuted |
| Model | `google.gemma-3-12b-it` on Bedrock, on every path | Open weights keep the option of moving inference onto a team's own hardware without changing the product — the same argument as self-hosting the rest. Bedrock-managed, so the conduct rule that model access goes through Bedrock still holds | Claude Sonnet as the judge — held in reserve behind the M1 gate rather than refuted |

### The seam that keeps the option open

The site reaches the agent through one interface rather than over HTTP. The MVP implements
it in-process; a later implementation issues `InvokeAgentRuntimeCommand` against AgentCore
Runtime. The container serves `/ping` and `/invocations` either way, so the same image can
be pointed at the Runtime without a rebuild.

```ts
export interface AgentGateway {
    invoke(req: TurnRequest): Promise<TurnViewModel>;
}
```

Returning to two deployables is then a config change and a second implementation of one
method. That is the property ticket 06 was protecting, kept.

## Deliberately still open

- **Microsoft Teams.** Still the intended primary surface. The discovery's resolutions are
  the design when it returns; nothing in the MVP should make an adapter harder.
- **AgentCore Runtime.** Deferred, not dropped. It returns when the deployment needs
  per-session isolation, managed long sessions or AgentCore Observability's dashboard — or
  when Teams arrives and a public front door has to exist anyway. The `AgentGateway`
  implementation is the whole change.
- **Work-tracker integration.** Which one first, and read-only or read-write.
- **The intervention ladder.** Notice, Assist, Connect and Escalate are all post-MVP.
  Only the equivalent of Ask exists, and only inside a session the person opened.
- **Playbooks.** The push-back bound of two is a constant in the MVP. It becomes playbook
  data when stall thresholds arrive and playbooks earn their file format.
- **The judge model.** Gemma 3 12B is the default everywhere. The M1 gate decides whether
  `assess-update` stays on it.
- **Infrastructure as code**, and the AWS region — now constrained rather than free, since
  it must be a region where Gemma 3 12B is served.

## Risks

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| The push-back reads as pedantic and people stop posting | It kills the north-star metric directly, and it is the failure mode the personas section already names | Two probes maximum; always accept; never rewrite the person's words; the word "thin" never appears in user-facing text |
| Grading statements is heard as grading people | It is the anti-goal the whole product is built around avoiding | Language rules in the skills; the agent asks, it never labels. Evals check output for scorecard language |
| The rubric is subtly wrong and the agent pushes back on genuinely good updates | Every false push-back costs trust that the record cannot buy back | The M1 fixture set exists to catch this before a human sees it. 85% agreement is the gate, not a target |
| A 12B judge is too blunt for the substance call | The easy cases are easy — "spent the day on it" against "the script runs on staging". A hedged, partly-real update is where a smaller model will misfire, and that is most real updates | Structured outputs instead of free-form tool calls; the M1 gate is a go/no-go, not a checkbox; a larger model on `assess-update` alone is the pre-agreed fallback |
| The substance call drifts as models change | The judgment is the product; a silent regression is invisible | The eval suite runs on every model change, and the fixture set is committed |
| In-process hosting gives up what the Runtime managed | Per-session microVM isolation, managed long sessions and the GenAI Observability dashboard all came free with AgentCore Runtime. Single-tenant, trusted-roster and no untrusted code execution is what makes dropping them acceptable — that assumption is load-bearing | The gateway interface keeps the return path cheap; OTEL spans emitted from the app, so observability is wiring rather than a rewrite; revisit the moment the deployment stops being single-tenant |

## Success metrics for the MVP

- **North star, unchanged: sustained voluntary post rate**, week over week, where nobody is
  required to post.
- **Share of sessions reaching a substantive declaration** within the two-probe bound.
- **Probe acceptance** — the share of follow-ups answered rather than abandoned. A falling
  number means the push-back is too aggressive, whatever the first metric says.
- **Back-off rate** — the health warning. A rise here invalidates a gain in any of the others.
