---
title: "What does the weekly post show when the board cannot be read?"
type: council
status: open
blocked_by: [ticket-12-which-board.md]
surface: "the weekly post when the board cannot be read"
claimed_by:
claimed_at:
---

## Question

The team view is now a render of a set Ripples does not hold. The read can fail — the credential
lapses, the project is renamed or deleted, GitHub is down, the iteration field is gone, or the
rate limit is reached at the moment the post is due. Decide what the team sees. [inferred]

The candidates are: post nothing and stay silent for that week; post the last set Ripples
successfully read, marked as of the date it was read; post only the statements Ripples holds,
without the board's shape around them; or post one line saying the board could not be read and
naming what to check. [inferred]

Ticket 04 reserves silence for a team with no active work items, so silence here would mean
something it already means. Ticket 02 requires each row to carry the date of the last
declaration, which is a per-row date and is not the same as the age of the board read; a stale
render needs a second date the view has never carried. [inferred]

## Why it blocks

A view assembled from a remote system needs its failure state ruled before it is built, because
the failure state is a different render and a different message, not an error path. Deciding it
afterwards means discovering it in production, on the morning the credential expires.
