---
title: "Which team-facing surfaces need a rendered UI we build and host, and which are messages a chat platform can carry?"
type: council
status: open
blocked_by: [ticket-01-teams-surface-inventory.md, ticket-02-team-view-content.md, ticket-03-individual-to-team-crossing.md, ticket-04-delivery-trigger-and-audience.md, ticket-06-channel-capability-floor.md, ticket-07-install-gate.md]
claimed_by:
claimed_at:
---

## Question

Take each team-facing surface the earlier rulings settled on, and put it in one of two
buckets: a message the conversational channel can carry, or a page we write, host and
secure. [asked: "which user interfaces need building"] [asked: "which user interfaces need hosting"]

Rule on the hosted bucket explicitly, including the case where it is empty. Ripples is
self-hosted open source with no hosted offering. A team that has to set up a web service,
terminate TLS, and configure single sign-on before seeing any value will not finish. Weigh
this against what a chat message cannot do: long lists, history, filtering, and anything
a person needs to review.

Portability matters in both directions, so the ruling has to specify which way matters more. A hosted page is
the one surface that is the same on every platform, because it is ours. A message is the
cheaper surface but is rendered by whichever platform carries it, so its richest form differs
per platform and its poorest form is plain text. [asked: "retain flexibility to move to other conversational platforms"]

## Why it blocks

This is the initiative's deliverable. Until each surface is in one bucket, no stub can be
written because "build the team progress view" is one story if it is a message, but several
stories if it is a hosted page with authentication.
