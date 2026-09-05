---
title: "What may a team-wide view contain, when progress is self-declared and neither a person nor a team may be scored?"
type: council
status: open
blocked_by: none
claimed_by:
claimed_at:
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
