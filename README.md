# 🌊 Ripples

**An AI Scrum Master that keeps work moving.**

Ripples is an open-source **agentic delivery driver** — an agent with long-term
**execution memory** that talks to your team every day, notices when work stops
moving, and does something about it.

Most tools tell you **where work is**.
Ripples keeps it **going**.

---

## Why Ripples Exists

Every team already has the signal. It lives in standups, async updates, and
Slack threads. The problem was never capture — it was that noticing requires
someone to look, and intervening requires someone with time.

So the honest questions go unanswered:

- Is this work actually progressing day to day?
- Where is execution quietly stalling?
- What keeps getting _intended_ but never _done_?
- Why does risk only become obvious right before a slip?

Kanban boards and issue trackers answer a narrower question — _what stage is
this work in?_ — and they answer it for whoever opens them. Most weeks, nobody
does. And no board has ever unblocked a ticket.

Ripples closes that loop. It watches, it asks, and it acts.

---

## The Core Idea

**Progress is temporal — and someone has to chase it.**

Execution reality shows up as _small daily changes_, or the absence of them.
Ripples captures those changes as **daily deltas**, anchors them to real work
items, and builds a durable record of how work actually unfolds.

That record is the agent's memory. It's what makes the agent worth talking to.

A bot with no memory nags. An agent that remembers can say:

> "Auth refactor hasn't moved in four days. Last Tuesday you said you were
> blocked on the API contract from platform. Still the same blocker, or a new one?"

Then follow it up. Then go find the platform owner.

---

## Why Not Just a Dashboard

A dashboard is a reasonable first instinct here, and it's the wrong shape for
the problem.

| | A dashboard | Ripples |
|---|---|---|
| How you use it | You open it | It finds you |
| Who notices stalls | Someone, eventually | The agent, the day it happens |
| Who unblocks | Whoever has time | The agent tries first, then routes |
| Data entry | You write updates | You answer questions |
| Value of the record | It _is_ the product | It's what makes the agent credible |

Visibility is necessary. It just isn't sufficient. A signal nobody acts on is
noise with better formatting.

---

## What the Agent Actually Does

Ripples runs a continuous loop against every active work item.

**1. Check in — conversationally**

Not a form. A short, specific, async conversation in the channel people already
live in. The agent knows what you said yesterday, so it asks the next question,
not the same one.

**2. Notice — quietly**

The agent watches for the patterns humans miss until it's too late:

- Days passing without meaningful movement
- Intent repeated without completion
- Confidence trending down while status stays "In Progress"
- Blockers that recur across different work items — usually a systemic problem
- Work that goes silent instead of going wrong

**3. Intervene — proportionally**

This is the part a dashboard can't do. Interventions escalate only as far as
they need to:

| Level | The agent… | Example |
|---|---|---|
| **Notice** | Records the signal, says nothing | Third quiet day logged |
| **Ask** | Checks in with the owner | "Still blocked on the same thing?" |
| **Assist** | Does the small unblocking work | Drafts the follow-up, finds the dependency owner, files the missing ticket, proposes a 15-minute call |
| **Connect** | Brings the unblocker in | Opens a thread with both people and the relevant history |
| **Escalate** | Surfaces to a human lead | Full timeline, what was already tried, what's actually needed |

Most interventions end at **Ask**. That's the point — the cheapest intervention
that works is the right one.

**4. Remember**

Every exchange becomes part of the execution record. The agent gets better at
your team specifically: who unblocks what, which blockers are real, how long
"almost done" usually means here.

---

## What Ripples Is

- An **AI Scrum Master** for async and distributed teams
- A **conversational standup** that adapts instead of repeating
- An **execution memory** that outlives any single sprint or tool
- An **active unblocker** — not a reporter of blockers

It sits _alongside_ Jira, Linear, GitHub Issues, and Slack. It does not replace
them. It reads from them, and it acts through them.

---

## What Ripples Is _Not_

An agent that talks to people and watches their work is exactly the thing that
becomes creepy if it's built carelessly. So the boundaries are part of the
design, not the marketing:

Ripples is intentionally **not**:

- A performance surveillance tool
- A metric, KPI, or scorecard dashboard
- A Kanban or Scrum process replacement
- A bot that pings you until you answer
- A system that infers progress from activity alone
- An agent that acts on people's behalf without them knowing

Concretely, that means:

- **Every intervention is visible to the person it's about.** No silent reports.
- **Escalation is a last resort and is announced first.** The agent tells you
  before it tells your manager.
- **The agent explains its reasoning on request.** "Why are you asking me this?"
  always has an answer.
- **Anyone can tell it to back off**, on a work item or entirely, and it respects that.
- **Confidence and blockers are self-declared.** Nothing is scored from keystrokes,
  commit counts, or hours online.

No scorecards. No hidden judgment. No green/red theater.

---

## The Model

Ripples is built on a small set of primitives.

- **Work Items** — stories, tasks, incidents, objectives
- **Days** — the atomic unit of visibility
- **Ripples** — daily deltas: what changed, what was intended, what blocked
  progress, how confident this feels
- **Stagnation** — days passing without meaningful movement
- **Signals** — patterns the agent detects across ripples and across items
- **Interventions** — an action the agent took, at which level, and what happened
- **Outcomes** — did the intervention unblock the work, and how long did it take
- **Playbooks** — the team-specific, editable rules that decide when the agent
  acts and how far it goes

Interventions and outcomes close the loop: the agent's own effectiveness is part
of the record, and you can audit it.

---

## Design Principles

- **Act, don't report**
  A signal nobody acts on is noise with better formatting.
- **Cheapest effective intervention**
  Ask before assisting. Assist before connecting. Connect before escalating.
- **Work-anchored, not people-anchored**
  Updates and interventions attach to work, not individuals.
- **Explicit intent over inferred activity**
  Humans declare progress. The agent asks. It never assumes from telemetry.
- **The human keeps the veto**
  The agent proposes, drafts, and routes. People decide.
- **Legible by default**
  Every action the agent takes is inspectable, explainable, and reversible.
- **Psychological safety by design**
  Visibility without performative pressure. An agent that people avoid is a
  failed agent.

---

## Who Ripples Is For

- Teams doing async or distributed work
- Engineering, product, design, and ops teams
- Teams without a dedicated Scrum Master — or with one stretched across five squads
- Managers who want _early_ signals, not week-late surprises
- Anyone tired of discovering problems only at the demo

---

## Why Open Source

An agent that talks to your team, reads your work, and decides when to escalate
has to be trustworthy. Trust here is not a claim you make in a pitch deck — it's
a property of code people can read.

Ripples is open source so teams can:

- Inspect exactly when and why the agent acts
- Edit the playbooks instead of accepting someone else's idea of "stalled"
- Keep the execution record in their own infrastructure
- Avoid black-box judgment about their work
- Extend it without vendor lock-in

If you can't read the rules the agent follows, you shouldn't let it talk to your team.

---

## Open Design Questions

These are genuinely undecided. Opinions welcome:

- How much autonomy should **Assist** have by default — draft-only, or send?
- Should the agent be one voice for the team, or per-person?
- How does the agent earn the right to escalate without becoming a snitch?
- What's the right way to say "this blocker is not real" without gaming the system?

---

## Status

Ripples is at the design stage. The model is settled enough to build against;
the code is being written now. Setup instructions land with the first working cut.

The model is opinionated. The ideas are deliberate.
Feedback, issues, and contributions are very welcome.

---

## In One Sentence

> **Ripples is an AI Scrum Master with a long memory — it notices when work stops
> moving, and it does something about it before the slip.**
