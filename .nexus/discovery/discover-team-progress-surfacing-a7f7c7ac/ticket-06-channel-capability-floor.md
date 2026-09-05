---
title: "What may the team-surfacing design assume of a conversational platform, so a second one can be added as an adapter?"
type: council
status: open
blocked_by: [ticket-01-teams-surface-inventory.md]
claimed_by:
claimed_at:
---

## Question

Microsoft Teams is the first platform Ripples talks through, not the last. Decide the
capability floor the team-facing design may assume. This floor is what any platform
Ripples later supports has to provide. Decide what happens to a feature that needs more
than the floor. [asked: "retain flexibility to move to other conversational platforms"]

Three rulings need one consistent answer:

- Does the design target the simplest message every chat platform can render—text and a
  link—or the richest form the first platform offers, degrading elsewhere?
- Are buttons, approvals, and forms inside the floor or above it? Teams has card actions
  and Slack has block actions. A webhook-only channel has neither and cannot receive a reply.
- Where does the boundary sit in the code? Name what a platform adapter owns and what the
  agent owns. Adding a platform is writing an adapter, not editing the agent.

## Why it blocks

Portability requirements determine what features are built, not just how they are packaged.
A view whose buttons drive the interaction depends on one platform's capabilities. A view
whose content is plain and whose actions happen back in the 1:1 conversation works on other
platforms without changes.

Portability also supports the build-and-host decision: a hosted page is the only team-facing
surface that renders identically on all platforms, because we control the rendering.
