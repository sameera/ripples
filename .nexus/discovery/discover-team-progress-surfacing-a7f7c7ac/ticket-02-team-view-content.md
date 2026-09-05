---
title: "What may a team-wide view contain, when progress is self-declared and neither a person nor a team may be scored?"
type: council
status: resolved
blocked_by: none
claimed_by: sameera
claimed_at: 2026-09-05T18:44:21Z
---

## Question

What is allowed to appear in a view of the whole team's progress? [asked: "surface the overall project progress to the team as a whole"]

The constraints are already written down and they are tight. Progress and confidence are
self-declared, so nothing in the view may be computed from activity. The record attaches to
work items and has no person-scoped aggregate, so the view cannot roll up by person. No
score, grade, ranking or red-amber-green status may appear for a person or a team. And the
README argues that a dashboard is the wrong shape for this problem.

Decide what survives those constraints and is still worth looking at. A count of stalled
work items is a computed number across people — rule on whether that violates the constraints or stays within them.

## Why it blocks

Every other question about this initiative assumes there is something to show. Until the
content is ruled on, nobody can write a stub for building it. The delivery question
cannot be answered either, because a page holding blocked items requires a different
approach than a page holding a burndown.

## Evidence

### Product perspective — `nxs-pm`

A view line is worth carrying only if it names a work item and something to decide about it.
A line with no decision attached is a report, and the product's first design principle is act,
don't report.

On the count: the binding words are "no person-scoped aggregate" and no score "for a person or
a team". A count of stalled work items aggregates over work items, so the first prohibition does
not reach it, and "stalled" is stagnation — a first-class primitive in the model with a
playbook-owned threshold — not a telemetry derivation. The count turns into a team rating at a
specific moment: when it survives without the list under it. A number that persists, trends, or
gets compared across squads acquires a target, and a target on a group of workers is a
performance rating whatever it is called. Under the EU AI Act posture the risk is the use, not
the arithmetic, and a deployer's works council will read a trended stall count as an evaluation.

On audience: the product context already rules that the stretched lead is not the agent's main
interlocutor and that Escalate is the only level that routinely reaches them. A lead-first team
view inverts a trust-led adoption motion that depends on the squad adopting the tool. One
artifact for everyone also makes "never send a report about a person that the person cannot see"
structurally true rather than a policy somebody has to enforce.

On the dashboard argument: the README's table argues two things, and only the use pattern — you
open it versus it finds you — is about standing views at all. That is an argument about primacy,
not existence. The test offered: if nobody ever opened the standing view, nothing should be lost
but backscroll.

Against its own ruling: the user asked for overall project progress and this ruling supplies
neither the word overall nor the word progress. A stalled list never answers whether the release
lands. Everything eligible for it is a problem, and a daily post carrying only bad news is a
thing teams learn to dread — which is why what-moved is mandatory rather than decorative. The
named fallback if a pilot team rejects the list shape is a team-declared milestone, stated by the
team in its own words, never a computed percentage.

### Architecture perspective — `nxs-architect`

A mechanical test for a legal query: the domain, the predicate and the grouping key must all be
work items or time. A person in any of the three, or a predicate reading anything but declared
fields and record timestamps, makes it illegal.

Legal: the latest declaration for a work item; work items filtered by the age of their last
declaration against a playbook threshold; the size of that set and of the active set; the
declared confidence sequence for one item; a blocker grouped by the blocker rather than by who
declared it; interventions and outcomes for an item. Illegal: any grouping or sorting by owner,
including the soft version that renders a legal list under people's names; any predicate over
commits, message volume, response latency or hours online; per-person check-in reply rate, which
is the north-star metric at team level and a productivity score at person level; confidence
aggregated across items or people; any imputed value where a human declared none; and a
team-level tally of ladder levels, which reads as a grade once detached from items.

The count needs one access path — work items indexed on team and last-declared time. No person
is in it, and no person rollup can be extracted from it without adding a join that does not
exist. The dangerous artifact is a different one: an index keyed by owner. The 1:1 check-in
legitimately needs to walk from a person to their items, so that traversal will be built; once it
is materialised as an index, a person rollup is an afternoon's work. The schema raises the cost
of a person rollup from trivial to deliberate, and no further.

Mixed statement ages force the date onto every row: there is no coherent "as of" for a view
assembled from statements made on different days. Three states must stay distinguishable in
storage — declared-no-movement, silent, and backed-off — or ticket 03's ruling becomes
unimplementable. Mixed ages independently kill every average over declared values, since an
average mixes this morning's statement with last Tuesday's and describes no moment. Counts are
immune, because set membership is evaluated once at query time.

Cheap on the markdown floor: the row list with one declared line and a date, the two counts, the
cross-item blocker line, a link per item. A squad-sized list of ten to thirty rows sits inside
the message size cap. Spends the card budget: anything tabular, and any per-row button. Forces a
hosted origin: history, filtering, drill-down, and a list long enough to need paging.

Against its own ruling: the row is a person-scoped rollup the reader assembles in their head, and
no schema constraint reaches that. Read three rows and you have a mental grouping by person; read
the view daily for a month and you have a longitudinal one. Omitting the owner is the only
content change that defeats it, and that makes the view unactionable. The mitigation is design
pressure, not enforcement — the fourth field on the row, what the agent already did and whether
it worked, puts the agent's own miss beside the human's silence.

The architect also noted that the posted view is itself an event the record should hold, because
the threshold comes from an editable playbook and the statements age, so "why did Ripples say
this was stalled" needs an answer later.

## Resolution

- **Decided:** The team-wide view is a list of work items at one moment, and it carries five
  things. Each row: the work item and a link to it, the last thing a human declared about it, the
  date they declared it, and what Ripples has already done about it and whether that worked. Above
  the list: two counts, how many items the list holds and how many active items the team has.
  Beside the list: one line for each declared blocker appearing on more than one item, and one
  line for each item waiting on someone outside the team. In the list: items declared unblocked or
  done since the last view, which are mandatory and not decoration. And items Ripples has no
  current statement about, shown as unknown rather than as stalled, and only after the agent has
  asked their owner at least once.

  The owner's name appears inside a row as routing information — who to go and talk to. It is
  never a column, a sort key or a grouping key, and no row's subject is a person.

  The count of stalled items is allowed as the length of a list printed with it, at one point in
  time. It is illegal the moment it can stand without its rows: as a headline on its own, a
  percentage, a colour, a threshold-derived label, a trend, a week-over-week delta, or a
  comparison across teams or sprints. Also banned outright: burndown, velocity, completion
  percentage, sprint health, red-amber-green, streaks, leaderboards, answered-versus-didn't, any
  average or trend of declared confidence, any per-person section or owner column, and any figure
  derived from commits, pull requests or message volume.

  An empty view is a legal state — when no row qualifies, the view has no rows. Whether an empty
  view is posted at all belongs to ticket 04. The content set does not vary by recipient: there is
  one view, and a lead reads the same artifact the squad reads. Who receives it, and when, is
  ticket 04's ruling, not this one's.

- **Why:** Every row names a work item and something to decide about it, which is the one test
  that separates this from a status report. The count is a cardinality over work items — no person
  sits in its predicate, its key or its grouping — and "stalled" reads the absence of a
  declaration, which is a fact about the record rather than a signal read off someone's activity.
  What makes a count dangerous is not the arithmetic but what a reader can do with it: a number
  that survives without its rows gets a target, and a target on a group of workers is a team
  rating under any name. Statements in the view were made on different days, so there is no
  honest "as of" for the whole view and the date has to sit on each row; the same mixing is why
  an average of declared confidence describes no moment in time and cannot be shown. What-moved
  is mandatory because everything else eligible for this view is a problem, and a recurring post
  carrying only bad news is one a team stops reading — which is the product's own stated failure
  mode. All of it fits a plain markdown message, ticket 01's floor: no history, no filtering, no
  paging, so none of this content forces the hosted deployable.

- **Refuted alternative:** A progress summary — a completion percentage, a burndown, or a team
  confidence figure. It is the closest reading of the words the initiative was described in, and
  it is what a lead asking about a project usually wants. It lost three times over. It is a score
  for a team, prohibited outright by the conduct standard. It cannot be computed honestly from
  statements of different ages, so the number would describe no point in time. And a trend needs
  history, history does not fit in a message, and it would force the second hosted deployable that
  ticket 01 priced as the expensive path.

- **Left open, and not this ticket's:** the invariant that protects the person-to-items traversal
  the 1:1 check-in needs — that it may be walked only to compose that person's own conversation,
  that no stored aggregate is keyed by a person, and that no read path returns a measure over a
  person's items. It belongs in the agent conduct standard rather than here, and it is a
  data-model constraint, which this discovery placed beyond its destination.

- **Resolved by:** sameera on 2026-09-05
