---
title: "When does the team-level view appear and who receives it — pushed by the agent on a trigger, or opened on demand?"
type: council
status: resolved
blocked_by: [ticket-02-team-view-content.md]
claimed_by: sameera
claimed_at: 2026-09-05T19:50:41Z
---

## Question

Does the agent send the team-level view, or does a person go and open it? And when it is
sent, who is on the receiving end — the whole squad, the lead, or both? [asked: "how this interaction needs to look like"]

If it is pushed, name the trigger: a fixed schedule, a stall crossing a playbook threshold,
an escalation, or someone asking the agent in the channel. If it is standing, say what keeps
it from being the dashboard the README rejects.

The audience half is not a detail. The product context says the lead is not the agent's main
interlocutor. Escalate is the only ladder level that routinely reaches them. A
scheduled team-wide summary sent to the lead reaches them constantly, which contradicts that.
So either the audience is the squad, or that statement changes.

## Why it blocks

Delivery decides how much gets built. A daily channel post is a scheduler entry and a message
template. A surface people open is a hosted page, an authentication story, and a reason to
open it. Both are defensible. They are not the same amount of work.

## Evidence

### From `nxs-pm` — the product perspective

Recommends a weekly scheduled post into the squad's channel plus an on-demand ask in that same
channel, with cadence, day and local hour as playbook values.

A pull-only surface is the dashboard the README rejects. The charge there is not that a board
renders state — it is that boards "answer it for whoever opens them. Most weeks, nobody does." A
surface with no arrival is exactly that. It also starves the check-in. Ticket 03 made a person's own
words the content of a team row. If no one reads those words, the daily
check-in becomes a form submitted to a void.

Three properties keep a scheduled post from being that dashboard. It arrives in a channel the squad
already reads. Every row carries what Ripples already did and whether it worked — that is action,
not state. And nothing appears in the post about a work item the agent has not
already raised with its owner, which keeps "the agent tells you before it tells your manager" true
for a surface that is not an escalation.

On audience: the squad, and the product-context statement stands. The lead reads the post because
they are in the channel, not because Ripples sent it to them. A recurring lead-addressed digest is
the artifact that makes an IC re-read the tool as management instrumentation, and what follows is
performative answering, which is invisible in the record.

Refutes a daily post on four counts. Daily republication lets a reader reconstruct the
person-anchored view the data model bans, because on a small squad everyone knows whose item is
whose. It raises the daily social stake of answering, which affects the back-off rate. By the
fifth identical post of the week, people stop reading it. And its one unique benefit, freshness, is already free from
the on-demand ask.

Gives up: freshness by default, a worse experience for the lead persona, and individual wins that
age before the next post.

### From `nxs-architect` — the technical perspective

Recommends the same shape and prices push and pull as one build rather than two, because the
composer, the record read and the delivery call are shared.

The load-bearing claim: the scheduled post should run no model turn. Ticket 02 fixed the content and
ticket 03 forbade re-wording it, so what remains is a deterministic assembly of rows from the
record. That takes the session identity question, the model-error failure mode and AgentCore Runtime
out of the post's critical path.

Push adds no deployable, because the messaging endpoint already needs a proactive path for the 1:1
check-in. It adds three pieces of state: a conversation-reference store per team scope, a marker
recording that this team was posted for on this local date, and a registry holding the team's
channel, timezone, cadence and post time. Pull adds no state at all, because an inbound activity
carries its own conversation reference. A hosted page is a second deployable, a second origin, a tab
single-sign-on exchange and a second thing to patch, against a product that assumes no onboarding
support.

On the schedule: one static UTC rate expression firing every fifteen to thirty minutes, with the
handler reading the registry and posting for the teams now at their local post time. One schedule
per team would make registering a team a control-plane operation and put infrastructure mutation
inside application code.

Names an ordering constraint: the post must fire after that team's check-ins have closed, otherwise every
row shows yesterday's statement. It is the terminal stage of one per-team pipeline, not an
independent job scheduled later.

On a channel ask, the cost a 1:1 does not carry is that the asker is not the subject. The fix is
that the channel view takes no arguments — no person, no date range, no filter. This makes "how is
Priya doing?" unanswerable by construction rather than by the model's judgment. It also prevents the ask
from becoming a query interface that would need history, filtering, and paging.

Demolishes the stall-threshold trigger: "stalled" is the absence of a declaration, and an absence
emits nothing, so the trigger is necessarily a clock sweep evaluating a predicate — which is the
scheduled post with a suppression rule. Posting on the crossing rather than during it needs
edge-triggered state, hysteresis against an item flapping around the threshold, and it storms the
channel when a team edits that threshold. Refuses the escalation trigger on conduct grounds:
Escalate is deliberately the narrowest audience in the ladder, and broadcasting it makes it the
widest.

Rules the conversation-reference store separable from the open execution-record persistence choice —
it is small, low-cardinality, written rarely and read once per sweep — and warns that coupling them
blocks this feature on a question this discovery placed beyond its destination.

Flags four claims it could not verify from the repository: EventBridge Scheduler's support for
`InvokeAgentRuntime` as a universal target, the exact conversation identifier shape for a Teams
channel reply, that an unmentioned channel post generates no per-user notification, and AgentCore
Memory's namespace semantics in the TypeScript path.

Gives up: intelligence on the push path, because a deterministic render notices nothing beyond the
mechanical cross-item blocker line.

## Resolution

- **Decided:** The team-wide view arrives two ways, and both land in one channel the squad already
  reads. Ripples posts it on a schedule, and anyone in that channel can ask for it at any time. It
  is never delivered to a lead on their own.

  The scheduled post is weekly by default. Cadence, day, local hour and whether the post runs at all
  are playbook data, not constants, so a team that wants it daily sets it daily.

  The post is the last stage of that team's check-in cycle, not a job that happens to be scheduled
  after it. A post that fires while the cycle is still open shows yesterday's statement on every row.

  The ask takes no arguments — no person, no date range, no filter — and returns the same view the
  schedule posts. That is what stops "how is she doing?" from being answerable, and it stops the ask
  becoming a query interface, which would need history, filtering and paging and would force the
  hosted page ticket 01 priced as the expensive path.

  Three rules bind every team-facing surface, scheduled or asked for. No surface at-mentions an
  individual; an owner's name is plain text inside a row, which is all ticket 02 allows. No row
  appears about a work item the agent has not already raised with its owner, so the post reports
  handled work and is never the first notice of a problem. And the statement slot is derived on
  every render rather than stored, so a back-off lifted or imposed since the last post is honoured.

  An empty view is posted, reduced to the two counts, what moved since the last view, and one line
  saying nothing needs attention. Silence is reserved for a team with no active work items at all.
  The count of active items that ticket 02 already puts above the list is what separates the two
  cases, so the rule is mechanical rather than a judgment made at render time.

  The scheduled post runs no model turn. Ticket 02 fixed what the view contains and ticket 03 forbade
  re-wording it, so the post is a deterministic assembly of rows from the record.

  Two triggers are refused. A stall crossing a playbook threshold does not post to the team, and
  neither does an escalation.

  The durable store of conversation references that ticket 01 named is a separate concern from the
  execution record's persistence, which this discovery placed beyond its destination. It is small
  key-value state, written when the app is installed and refreshed from later inbound activity, and
  team surfacing does not wait on the database question.

- **Why:** A view nobody receives is the board the README argues against, and the argument is about
  arrival rather than rendering — a board answers "for whoever opens them. Most weeks, nobody does."
  Arrival is also what pays for the check-in. Ticket 03 put a person's own words in the team row, and
  words that land where nobody reads them make the daily question a form submitted to a void, which
  is how the sustained voluntary reply rate decays. The ask is nearly free beside that: it is
  solicited, so it costs nothing against the message budget, it needs no scheduler, and it reuses the
  same render. Having it is what lets the schedule be weekly instead of daily.

  Weekly is the default because daily republication hands a reader the person-anchored view the data
  model exists to prevent. Ticket 02 removed the owner as a column; on a six-person squad, five
  identical posts a week restore it as an inference about who spoke and who did not. Weekly is also
  what the content is shaped for — recurring blockers and items waiting on someone outside the team
  are patterns across days, and one day of deltas is yesterday. The day-shaped job already belongs to
  the intervention ladder, which acts the day something happens. Being wrong about this is cheap:
  cadence is a stored value, so a pilot team that wants daily changes a setting rather than a build.

  The audience is the squad because posting to the shared channel makes "never send a report about a
  person that the person cannot see" true by construction instead of by a policy somebody has to
  enforce. It also keeps the product-context statement intact: the lead is not addressed by the
  agent, and Escalate remains the only level that reaches them directly. They read the post as a
  member of the channel.

  An empty week is still posted because a surface that appears only when there is trouble teaches a
  team to suppress trouble, and an intermittent post is a notification people learn to skip. The
  reduced form still tells a reader three things — the agent ran, the team has this many active items
  and none need attention, and here is what closed. A team with no active items at all is the one
  case where the post carries nothing and its absence means nothing, so silence there costs a reader
  no information and keeps a fresh deployment from posting noise on day one.

  At-mentions are barred for two reasons that land on the same rule. A mention re-creates
  person-addressing at the delivery layer, after ticket 02 removed it from the content. And a post
  that mentions twenty owners is twenty directed messages, which collides with the one-unsolicited-
  message-per-person-per-work-item-per-day budget on top of the check-in that already ran that day.

  The scheduled post runs no model turn because there is nothing left for a model to decide. The
  content set is fixed and the words may not be re-worded, so a model turn would add a failure mode,
  a latency budget and a re-wording temptation in exchange for nothing.

  Both refused triggers fail on proportionality. A stall is an absence of a declaration, and an
  absence emits nothing, so a threshold trigger is not an alternative to a schedule — it is a
  schedule that sometimes stays quiet, bought with edge-triggered state and hysteresis. What it adds
  is that the post's arrival becomes the bad news, which makes the surface a punishment. An
  escalation trigger is worse: Escalate is the narrowest audience in the ladder and is announced to
  the owner first, and broadcasting it to the channel makes the top rung the widest and turns the
  team channel into the place where being stuck becomes public.

  The conversation-reference store is ruled separable because the alternative blocks this feature on
  a decision nobody is making here. It is low-cardinality, written rarely and read once per run, and
  it shares none of the query shapes the execution record needs.

- **Refuted alternative:** Deliver the view to the lead — a direct message, a lead-only channel, or a
  variant shaped for them — and show the squad nothing. It is the strongest option on the table. The
  lead is the persona with the stated pain, knowing which work is quietly dying early enough to act,
  and they are the one who installs Ripples. It lost three times. It makes the surface invisible to
  the people whose words are in it, which is structurally what ticket 03 refused. It requires a lead
  role in the data model — a person-scoped routing concept and a configuration surface to set it —
  which is the first crack in work-anchored, not people-anchored. And it makes adoption manager-led
  against a distribution motion that is explicitly team-led.

- **Second refuted alternative:** A daily post fired after the check-in window closes. It matches the
  product's own atomic unit, it is maximally fresh, and it reinforces every day that answering is
  read. It lost to the person-anchored reconstruction above, and its one unique benefit is
  retrievable for free from the ask.

- **Left open, and not this ticket's:** ticket 02's fourth row field — what Ripples already did about
  an item and whether it worked — needs the intervention ladder, which the product context defers out
  of v1. Whether team surfacing ships with that field empty or waits for the ladder is a sequencing
  question for the epic stage, not a decision about what the view is.

- **Also not this ticket's:** a person who leaves the team keeps a statement in the record, and the
  view is where it stays visible. Erasure is already a stated obligation in the product context, and
  it belongs to the persistence decision this discovery placed beyond its destination.

- **Resolved by:** sameera on 2026-09-05
