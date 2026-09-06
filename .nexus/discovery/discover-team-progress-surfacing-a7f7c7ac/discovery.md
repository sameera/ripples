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

- **Which work items does the team-wide view list?** — The view lists a team's GitHub project at its current sprint, every item in it a row whether or not anyone is assigned; Ripples reads the board and never writes to it, so a check-in still changes nothing and silence still removes nothing. Detail: `ticket-08-team-view-item-set.md`

- **Which channel does a team's scheduled post land in, at what local hour, and who decides both?** — A channel becomes that team's destination when someone first mentions Ripples in it; the install event buys only a one-off welcome message, nobody is asked for the hour, and the post defaults to Monday late in the day from playbook values. Detail: `ticket-09-post-address-and-local-time.md`

- **Which GitHub project and iteration is a team's, who names it, and with what authority?** — The board is a playbook value beside the cadence, resolved by one deployment-scoped read-only GitHub App and announced into the claimed channel on every load; the current sprint is derived and never stored, a project with no iteration field is refused rather than widened to its backlog, and a team with no board runs nothing at all. Detail: `ticket-12-which-board.md`


## Not yet specified

- Whether a hosted page, if one is built, needs an identity and authorisation model of its
  own or can rely on the host platform's single sign-on. Nothing to state until it is known
  whether a hosted page exists. [inferred]

## Out of scope

- Restricting who may name a team's board, or who may claim and move a post destination, to a
  team lead. Ruled out by the board resolution, which makes the board a change to the deployment
  by whoever operates it and leaves the channel acts unauthorized. A lead role is a person-scoped
  configuration surface, which ticket 04 already refused. [inferred]
- Reading a team's board through a personal access token of either kind, and any per-team
  credential. Ruled out by the board resolution in favour of one deployment-scoped read-only
  GitHub App. [inferred]
- Reading every open item in a project when it has no iteration field, and the ceiling,
  truncation and paging an unbounded backlog would bring back. Ruled out by the board resolution,
  which refuses the project and says why. [inferred]
- An interface for editing a team's playbook. Already out of scope, and the board resolution
  leans on it: a board changes by the same act that changes a cadence. [inferred]
- Creating, installing, rotating and alarming on the deployment's GitHub App credential. It is
  the same class of work as operating the Entra client credential, which is deployment operations
  rather than surfacing. What is not out of scope is the choice of one deployment-scoped identity
  over a per-person token, because it decides whether the weekly post renders the same for every
  reader. [inferred]

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
- Work-tracker integrations with Jira or Linear as sources for the team-level view. GitHub is no
  longer among them: the lead states that a team's item set is a GitHub project, at each person's
  assigned sprint tasks, so reading one is the item-set resolution rather than an integration
  ruled beyond the destination. [asked: "each person's assigned sprint tasks"]
- Writing anything back to the GitHub project — a comment carrying a declared blocker, an
  assignee change, a status move, a close. The sync is read-only, and this is recorded as
  deferred rather than dismissed: it is the agent acting on a person's behalf somewhere their
  whole company reads, which needs a consent rule of its own on top of ticket 03's. [inferred]
- Maintaining the item set through typed messages to Ripples — an add sentence, a drop sentence,
  and the exchange that answers them. Ruled out by the item-set resolution, which puts the set on
  a board Ripples only reads. [inferred]
- A ceiling on how many items the team view may list, and the refusal that would name what has to
  come off first. A sprint is bounded by the team that planned it. [inferred]
- Keeping the team view's item set current — an age-out, a nudge to remove finished items, or a
  line in the post naming items nobody has spoken about for a long time. A board is kept current
  because the team plans and works off it. What is not covered by this: whether Ripples says
  anything when a person's statement is about work that is not in the sprint, which is a ticket
  of its own. [inferred]
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
  owner names it and dropping after unanswered asks. Ruled out by the item-set resolution.
  [inferred]
- Dropping an item from the team view because nobody has spoken about it — an age-out, a
  dormancy threshold, or any timer that changes an item's membership. Ruled out by the item-set
  resolution, which makes membership the board's and nothing else's. [inferred]
- Truncating or paging the team view at render, and the line that would tell a reader rows
  were cut. The sprint bounds the view instead. [inferred]
- Matching two similarly named work items to each other — a pasted-URL identity key, a
  model-proposed match a human confirms, or a merge that joins two rows into one. An item is a
  GitHub issue with a number and a URL, so nothing in the system needs to match anything.
  [inferred]
- A page or a form for editing the team view's item set. Ruled out by the item-set resolution,
  which leaves the set on the GitHub board the team already edits. [inferred]
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
