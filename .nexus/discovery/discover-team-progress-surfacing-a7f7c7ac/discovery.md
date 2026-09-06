---
destination_accepted: 2026-09-05
feature: "Team Progress Surfacing"
feature_path: docs/features/team-progress-surfacing
status: open
---

# Discovery: Team Progress Surfacing

## Destination

This discovery is done when every functional goal of **team-level progress surfacing** can
be stated as a backlog stub of size M or smaller. A stub of this size includes a one-line goal,
an S or M estimate, and candidate story titles.

In scope for that judgement: what the team as a whole is shown and what triggers it; where
each of those lands, from a 1:1 Teams chat to a channel post to a hosted page; which
surfaces are purely conversational, which need a rendered UI we build, and which of those
need hosting; what an individual said in a 1:1 may appear in a team-wide surface, and what
consent that needs; and who the team-wide surface is for, since the squad and the lead are
different personas.

Beyond it: the individual daily check-in conversation itself, the intervention ladder's
internal behaviour, the persistence choice for the execution record, work-tracker
integrations, and any public web presence.

## Resolved decisions

<!-- Append-only. One line per resolved ticket, order-insensitive. -->

- **Which Microsoft Teams surfaces can a self-hosted Ripples deployment reach a team through, and what does each cost to build, host and operate?** — Every team-facing surface rides the Bot Framework messaging endpoint Ripples already has to run, with a plain markdown message as the floor and cards priced but unchosen; only a URL-backed tab or dialog forces a second hosted deployable. Detail: `ticket-01-teams-surface-inventory.md`
- **What may a team-wide view contain, when progress is self-declared and neither a person nor a team may be scored?** — The view is a point-in-time list of work items carrying the last human statement on each, its date and what the agent already did about it, with the stalled count allowed only as the length of the list beside it. Detail: `ticket-02-team-view-content.md`
- **What may cross from a person's 1:1 check-in into a team-visible surface, and does that person see it first?** — Statements cross to the team view by default in the person's own words, previewed as the exact row inside the check-in exchange, and a withheld or backed-off statement leaves the row standing with its date and an empty statement slot. Detail: `ticket-03-individual-to-team-crossing.md`
- **When does the team-level view appear and who receives it — pushed by the agent on a trigger, or opened on demand?** — Ripples posts the view weekly into one channel the squad already reads and answers an unparameterised ask in that same channel, never delivering it to a lead on their own and never firing it on a stall or an escalation. Detail: `ticket-04-delivery-trigger-and-audience.md`
- **What may the team-surfacing design assume of a conversational platform, so a second one can be added as an adapter?** — The floor is a proactive formatted-text message into a group destination with a reply path back, the seam carries a structured view rather than rendered text, and above-floor primitives may only render a floor-level message better. Detail: `ticket-06-channel-capability-floor.md`

- **Must team-wide surfacing assume the app can be installed into the team, or must it degrade when the tenant forbids custom app upload?** — Ripples requires the install and refuses the webhook, and the degradation it builds instead is the unconfigured state, where check-ins run, nothing posts, and the preview turn says so every time it is shown. Detail: `ticket-07-install-gate.md`

- **Which work items does the team-wide view list, when nothing outside Ripples enumerates a project?** — The view lists a roster the team declares and maintains through typed messages in the channel the view lands in; a check-in never adds or removes an item, silence never removes one, and the roster is bounded when an item is added rather than truncated when the view is rendered. Detail: `ticket-08-team-view-item-set.md`

- **Which channel does a team's scheduled post land in, at what local hour, and who decides both?** — A channel becomes that team's destination when someone first mentions Ripples in it; the install event buys only a one-off welcome message, nobody is asked for the hour, and the post defaults to Monday late in the day from playbook values. Detail: `ticket-09-post-address-and-local-time.md`

## Not yet specified

- Whether a hosted page, if one is built, needs an identity and authorisation model of its
  own or can rely on the host platform's single sign-on. Nothing to state until it is known
  whether a hosted page exists. [inferred]

## Out of scope

- A Power Automate Workflows incoming webhook as a delivery path for the team-wide view,
  whether as a declared lesser mode for a tenant that forbids the app or as an extra
  destination for a team that already has a working bot. Ruled out by the install-gate
  resolution. [inferred]
- Serving a tenant that forbids custom app upload through any second delivery mode. The
  documented path is asking that tenant's administrator to publish the app, which ticket 01
  established remains open to them. [inferred]
- Operating the deployment's Entra client credential — choosing a certificate over a client
  secret, and alarming before it expires. Requiring the install makes the 1:1 and team
  surfacing lapse together and silently when it does, which makes it real work, but it is
  deployment operations rather than surfacing. [inferred]
- Delivering the team-wide view to a lead alone — a direct message, a lead-only channel,
  or a variant of the view shaped for them. Ruled out by the delivery resolution, which makes
  the lead read it from the squad's channel instead of receiving it separately. [inferred]
- A team-wide post triggered by a stall crossing a playbook threshold, or by an escalation. Ruled out
  by the delivery resolution. [inferred]
- A metrics rendering of the team-wide view — burndown, velocity, completion percentage,
  sprint health, a red-amber-green status, or a stall count that trends week over week. Ruled
  out by the content resolution, which allows a count only as the length of a list printed
  with it. [inferred]
- The individual daily check-in conversation and how its questions are generated. [inferred]
- The internal logic of the intervention ladder, including when Ask becomes Connect and when
  Connect becomes Escalate. [inferred]
- The persistence choice for the execution record. It is open in the stack document and is
  a decision of its own. [inferred]
- Work-tracker integrations with Jira, Linear or GitHub Issues as sources for the team-level
  view. [inferred]
- Building a second conversational platform. Microsoft Teams is the first surface and the
  only one this discovery prices. What is not out of scope is portability: every ruling here
  must leave a second platform addable as an adapter rather than a redesign, which is its own
  ticket. [asked: "Teams is only the first surface for this"]
- A user interface for editing playbooks. [inferred]
- A public marketing site. [inferred]
- A separate preview or approval message sent outside the check-in exchange. It is a second
  unprompted message about the same work item on the same day, which the conduct standard's
  message budget does not allow. [inferred]
- A portable rich-message layout language — a format the agent emits that translates into
  Adaptive Cards on one platform and Block Kit on another, with the agent asking an adapter what it
  can render. Ruled out by the capability-floor resolution, which puts the domain view model on the
  seam and gives the interface no capability query. [inferred]
- Interactive controls on a team-facing surface — buttons, dialogs, forms, and acknowledging a
  work item or changing what its row says from the channel the view lands in. Ruled out by the
  capability-floor resolution. Adding or removing a roster item is not covered by this: it is
  typed text, which is clause 3 of the floor, and it changes which items the view lists rather
  than what any row says. [inferred]
- An item set that emerges from what people mention in their 1:1 check-ins, joining when its
  owner names it and dropping after unanswered asks. Ruled out by the roster resolution.
  [inferred]
- Dropping an item from the team view because nobody has spoken about it — an age-out, a
  dormancy threshold, or any timer that changes an item's membership. Ruled out by the roster
  resolution, which lets only a person remove an item. [inferred]
- Truncating or paging the team view at render, and the line that would tell a reader rows
  were cut. The roster is bounded when an item is added instead. [inferred]
- Matching two similarly named work items to each other — a pasted-URL identity key, a
  model-proposed match a human confirms, or a merge that joins two rows into one. A human
  names each roster item once, so nothing in the system needs to match anything. [inferred]
- A page or a form for editing the roster. Ruled out by the roster resolution, which puts
  roster maintenance on the channel's inbound text path. [inferred]
- An install-time configuration question for team surfacing — a channel picker, a setup
  exchange, or any pending-setup state between installing the app and the first post. Ruled
  out by the destination resolution. [inferred]
- Naming the destination in a playbook file, and the channel-name resolver and directory read
  a hand-authored channel name would need to become an identifier. Ruled out by the
  destination resolution. [inferred]
- Enumerating a team's channels to offer a list to pick from. The call costs nothing beyond
  the bot credential the messaging endpoint already holds, and it is refused with the picker
  it exists to serve. [inferred]
- Serving more than one Microsoft tenant from one deployment. One deployment is one AWS
  account, one bot registration and one tenant, and going multi-tenant is a different product
  motion from the self-hosted one the product context commits to. [inferred]
