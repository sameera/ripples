---
title: "Must team-wide surfacing assume the app can be installed into the team, or must it degrade when the tenant forbids custom app upload?"
type: council
status: open
blocked_by: none
claimed_by:
claimed_at:
---

## Question

Every team-facing surface Ripples creates requires one thing before anything else: a human
must install the Ripples app into that team. In many organisations, an administrator controls
whether that is allowed. Does Ripples require that install and stop when it is refused, or
does team-wide surfacing carry a second path that works without it? [inferred]

If team-wide surfacing carries a second path, the only one that exists is a Power Automate Workflows incoming
webhook. A team member creates the webhook themselves and hands us the URL for it. The webhook needs no Azure
subscription, no app package and no administrator. The webhook is also one-way: no button reaches us, no
identity comes back, and no reply can be read.

Decide one of three. Require the install, and treat a tenant that forbids it as a team Ripples
cannot serve. Ship the webhook as a declared lesser mode, and document what a team gets from it. Or
build the team-wide view so that it never depends on a reply in the first place, which makes the
webhook a delivery detail rather than a lesser mode.

## Why it blocks

Whether a degraded path exists changes the goal count. Requiring the install makes team-wide
surfacing one feature. A declared lesser mode makes it two. The same view appears rendered and
delivered twice, with a setup path of its own. A team's backlog then needs a second stub that
nobody has written yet. The decision also controls whether a team-wide surface may contain a button at all.
That choice then governs the build-or-host ruling.

## Evidence

The install gate exists. How often it stops teams is unmeasured. Uploading a custom Teams app is
governed by a Teams app setup policy that an administrator controls. Organisations do turn it
off. No public source states how many. We recorded this finding on the surface-inventory
ticket's verification pass. Microsoft's own documentation supplied the evidence. Reading more
documentation will not settle the frequency.
