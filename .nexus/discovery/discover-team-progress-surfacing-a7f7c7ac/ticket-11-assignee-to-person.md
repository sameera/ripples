---
title: "How does Ripples know which person a sprint item's assignee is?"
type: council
status: open
blocked_by: none
surface: "the identity-link exchange"
claimed_by:
claimed_at:
---

## Question

A row in the team view names a work item and its owner, and the 1:1 check-in asks that owner
about it. The board gives an assignee as a GitHub login. The check-in reaches a person as a
Microsoft Teams user. Nothing joins the two. Decide what does. [asked: "the board names a GitHub login and the check-in reaches a Teams user"]

The candidates are: a mapping the team lead authors beside the board configuration; a
one-question exchange in a person's own 1:1 that asks for their GitHub login the first time an
item is assigned to them; matching on the email address each platform holds, where both are
readable; or a directory read against the tenant. Each has a different failure when it is wrong,
and being wrong means asking the wrong person about someone else's work. [inferred]

Also decide what the view and the check-in do for an assignee nobody can resolve. Ticket 08 rules
that an unassigned item is a row nobody has been asked about; an item assigned to a login Ripples
cannot place is a different state, because a person exists and Ripples cannot reach them.
[inferred]

## Why it blocks

This is the join between the team surface and the 1:1 loop, and the whole product sits on it.
Until it is decided, no stub can say who the check-in asks, and the team view cannot say whose
row is whose. Getting it wrong is not a degraded view — it is Ripples asking one person about
another person's work, which is the failure the conduct standard's work-anchored rule exists to
make impossible.
