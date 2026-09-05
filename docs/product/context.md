---
product: Ripples
version: 1.0.0
last_updated: 2026-09-05
stage: pre-launch (design stage; v2 clean slate)
---

# Product Context

Canonical product context for Ripples. Personas live here; epics reference them rather
than re-tabulating. Technical context lives in [`../system/stack.md`](../system/stack.md);
the agent's binding conduct rules live in
[`../system/standards/agent-conduct.md`](../system/standards/agent-conduct.md).

## Product Overview

Ripples is an open-source **AI Scrum Master** — an agentic delivery driver with long-term
execution memory. It talks to a team every day, notices when work stops moving, and does
something about it.

- **Category**: open-source team-ops / developer tool. Agentic, not a chat bot.
- **Users**: async and distributed software teams — engineering, product, design, ops.
- **Problem**: the signal already exists in standups and threads. Noticing it requires
  someone to look; intervening requires someone with time. Neither happens.
- **Position**: sits *alongside* Jira, Linear, GitHub Issues and Teams. Reads from them,
  acts through them, replaces none of them.

<!-- Inferred from README.md; category and positioning confirmed by the v2 scope answer. -->

## Vision & Strategy

**Act, don't report.** A signal nobody acts on is noise with better formatting.

The wedge is the intervention ladder. Every incumbent in the async-standup space collects
and summarizes; none of them intervenes. Ripples' bet is that the durable execution record
is not the product — it is what makes the agent credible enough to be worth answering.

**Distribution is trust-led.** Self-hosted open source, adopted by the team that runs it,
not sold to their manager. The code being readable *is* the trust story: "if you can't read
the rules the agent follows, you shouldn't let it talk to your team."

**Motion**: pure OSS, self-hosted. Teams deploy their own instance to their own AWS
account and keep the execution record in their own infrastructure. No hosted offering,
no multi-tenancy requirement.

<!-- Motion confirmed by the user; single-tenant assumptions are safe. -->

## Anti-goals

Ripples is deliberately **not**:

- A performance surveillance tool.
- A metric, KPI or scorecard dashboard.
- A Kanban or Scrum process replacement.
- A bot that pings you until you answer.
- A system that infers progress from activity alone.
- An agent that acts on people's behalf without them knowing.

Two further boundaries are **scope constraints, not preferences** — they are what keeps
Ripples out of EU AI Act high-risk classification (see Regulatory & Compliance):

- **Never evaluates a person, allocates tasks, or feeds performance, promotion or
  termination decisions.** Enforced in the data model: the record is work-anchored, with
  no person-scoped aggregate.
- **Never infers emotional state.** Confidence is self-declared or absent.

Do not recommend work that crosses either line, however useful it looks.

## Personas

### Primary — the IC being asked

The engineer, designer or ops person who owns a work item and gets the daily check-in.

- **Job to be done**: tell someone where I actually am, without writing a status report
  and without being judged for a slow week.
- **Pains**: standup theater; being asked the identical question every morning; the sense
  that admitting you are stuck is a mark against you.
- **What good looks like**: a short, specific question that shows the agent remembers
  yesterday. Answering costs under a minute.
- **Failure mode**: they start ignoring it, or answering it performatively. Both are the
  product failing, not the user.

### Primary — the stretched lead / absent Scrum Master

The team lead, EM or Scrum Master spread across several squads — or the team that has none.

- **Job to be done**: know which work is quietly dying, early enough to do something.
- **Pains**: week-late surprises; problems that surface at the demo; no time to chase
  every item; boards that answer "what stage is this in" and nothing else.
- **What good looks like**: they hear about a stall from Ripples before they would have
  noticed it, with the history already assembled.
- **Note**: this persona installs Ripples and feels the pain, but is *not* its main
  interlocutor. Escalate is the only level that routinely reaches them.

### Secondary — the unblocker

The dependency owner on another team, brought in at the Connect level.

- **Job to be done**: understand what is being asked of me, in one read, without
  archaeology.
- **Pains**: being pulled into a thread with no context; being chased by a bot they never
  installed and have no relationship with.
- **Why they matter**: Connect fails entirely if this person finds Ripples intrusive.
  They never get checked in on and never opted in — treat every contact as a first
  impression.

<!-- The unblocker persona is inferred from the Connect level in README.md; it is not
     named there, but the level cannot work without designing for them. -->

## Domain & Industry Context

Async and distributed software teams. The market is crowded at the "check-in bot" layer —
Geekbot, Standuply, DailyBot, Spinach, Troopr, Kollabe — and effectively empty at the
"acts on it" layer. Table stakes in the segment: async scheduled check-ins, chat-native
delivery, tracker integration, summaries. None of that is differentiation.

Microsoft Teams as the first channel implies Microsoft-shop organisations: likelier
enterprise, likelier to have IT review, and in the EU likelier to have works-council
(Betriebsrat / ondernemingsraad) consultation requirements before any tool that touches
individual work is switched on.

## Industry Benchmarks

Used for RICE estimates only.

| Metric | Benchmark | Why it matters here |
| --- | --- | --- |
| Standup-bot reply rate decay | Falls sharply after the first two weeks | This decay is precisely what the north-star metric is designed to detect |
| Async check-in sustained engagement | Low without a reason to answer beyond compliance | The memory, not the reminder, has to be the reason |
| OSS self-hosted install → sustained use | A small fraction of the hosted equivalent | Time-to-first-value must be short; assume no onboarding support |

<!-- TODO: Verify with real numbers once there is a pilot team. Directionally reliable,
     not precise. -->

## Regulatory & Compliance

**Chosen posture: design to stay out of high-risk.** Ripples does not become a compliant
high-risk employment system; it stays outside the category by scope.

### EU AI Act

**Applies when**: any deployer is in the EU, or the team includes EU-based workers.

- Worker monitoring, task allocation and performance evaluation are **high-risk** uses.
  The Act's free-and-open-source exemption does **not** cover high-risk systems, so being
  OSS is not a defence.
- **Article 5 prohibits** AI that infers emotions in the workplace, outright. Self-declared
  confidence is the design that avoids this; deriving a mood or sentiment value from
  message text would cross into a prohibited practice.
- The anti-goals above are the compliance boundary. Any feature that scores, ranks or
  evaluates a person, or that assigns work, moves Ripples into high-risk and is out of
  scope.

### GDPR

**Applies when**: any deployer is in the EU/UK.

- The execution record contains personal data — it is work-anchored, but authored by
  identifiable people.
- Lawful basis, transparency notices and works-council consultation are the **deployer's**
  obligations. Ripples' obligation is to make them satisfiable: retention controls, export,
  and erasure of a person's contributions.
- Self-hosting keeps the record in the deployer's own infrastructure, which removes the
  processor relationship entirely.

### Not applicable

- **SOC 2** — nothing is hosted by the project. Revisit only if a hosted offering appears.

## Competitive Landscape

| Competitor | What they do | Where Ripples differs |
| --- | --- | --- |
| Geekbot | Async standups in Slack/Teams; summaries | Collects and reports; never acts |
| Standuply | Standups plus retros, planning, tracker integration | Broadest Agile-ops surface; still reporting-shaped |
| DailyBot | Standups, mood tracking, kudos, widest channel support | Mood tracking is the boundary Ripples deliberately will not cross |
| Spinach | AI meeting notes and follow-through | Meeting-anchored, not day-anchored |
| Troopr / Kollabe | Lightweight async check-ins, AI summaries | Same layer; no intervention ladder |

**Table stakes**: scheduled async check-ins, Teams/Slack native, tracker links, summaries.
**Ripples' claim**: the intervention ladder plus an auditable record of its own
effectiveness. No competitor records whether its own nudge worked.

## Success Metrics

**North star: sustained voluntary reply rate.** The share of check-ins answered, week over
week, where nobody is required to answer. It tests the founding constraint directly — an
agent people avoid is a failed agent.

**Supporting metrics:**

- **Ladder distribution** — most interventions should end at **Ask**. A rising share of
  Connect and Escalate means the cheap levels are not working.
- **Intervention → unblock rate** — share of interventions with a recorded unblock
  outcome, and how far up the ladder they had to go.
- **Back-off rate** — how often people tell it to stop. This is the health warning; a
  rising back-off rate invalidates any gain in the other three.

**Impact thresholds** (for RICE):

| Impact | Reach |
| --- | --- |
| High | > 20% of active work items |
| Medium | 5–20% of active work items |
| Low | < 5% of active work items |

**Effort justified**: High impact up to 4 weeks, Medium up to 2 weeks, Low under 1 week.

## Product Principles

Used to resolve trade-offs.

1. **Act, don't report.** A signal nobody acts on is noise with better formatting.
2. **Cheapest effective intervention.** Ask before assisting; assist before connecting;
   connect before escalating.
3. **Work-anchored, not people-anchored.** Updates and interventions attach to work.
4. **Explicit intent over inferred activity.** Humans declare progress. The agent asks.
5. **The human keeps the veto.** The agent proposes, drafts and routes. People decide.
6. **Legible by default.** Every action is inspectable, explainable and reversible.
7. **Psychological safety by design.** Visibility without performative pressure.
8. **The record is a byproduct of a conversation people want to have, never a form.**
   If a feature improves the record at the cost of the conversation, it is the wrong
   feature.

## Company Scale

- **Stage**: pre-launch. Design stage; v2 is a clean slate.
- **Users**: zero.
- **Team**: solo / very small.
- **v1 scope**: daily check-in plus memory, Microsoft Teams only — the conversational loop
  that asks a *different* question tomorrow because it remembers. No detection, no
  intervention ladder, no tracker integration yet.

**Implications for scoping advice**: assume MVP. Single tenant. No migration burden, no
legacy users, no backwards-compatibility constraint. Prefer proving the memory loop over
breadth. Detection, the ladder, playbooks and tracker integration are all deliberately
deferred — do not treat their absence as a gap to fill.
