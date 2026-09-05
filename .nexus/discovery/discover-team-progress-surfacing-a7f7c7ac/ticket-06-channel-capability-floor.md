---
title: "What may the team-surfacing design assume of a conversational platform, so a second one can be added as an adapter?"
type: council
status: resolved
blocked_by: [ticket-01-teams-surface-inventory.md]
claimed_by: sameera
claimed_at: 2026-09-05T20:14:07Z
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

## Evidence

### `nxs-pm` — 2026-09-05

The floor costs the product nothing, because ticket 02 already spent what a card would buy.
Cards carry layout, tables, colour and buttons; ticket 02 banned scores, trends, colours,
red-amber-green, sorting, grouping, paging, filtering and history, and said the content fits a
plain markdown message. So the floor is not a sacrifice made for a hypothetical second platform —
it is a description of what the content ruling already decided.

The portability promise is derived from the open-source trust story rather than asserted on its
own. A tool sold on "no vendor lock-in" that requires a Microsoft shop has swapped one lock-in for
another. The persona is distributed software teams, and Slack owns that segment; Teams-first was a
distribution bet recorded in the product context, not a statement about who the product is for.

On the sharp case — ticket 03's preview-and-withhold with no buttons — a button cannot do the main
job. The affordance is "correct the wording or withhold", and correcting wording is free text by
definition, so a button implements only the withhold half. The person is already mid-conversation
typing sentences about their own work, so the marginal cost of typing a correction is near zero.
And a one-tap approve trains reflexive tapping, which defeats the reason the preview exists: the
person is meant to read the row. Friction is the feature here.

What must be enforced in code is not a widget but a deterministic escape hatch: reserved literal
words matched before any model turn, in the agent rather than the adapter, named in the preview
turn each time a row is shown, and working at any later point in the conversation. A withhold that
depends on a model correctly reading "eh, maybe don't put that bit in" is probabilistic, and a
probabilistic escape hatch is not a floor. This is a correctness requirement on Teams too —
portability revealed it rather than created it.

A webhook-only sink is a category error for a product whose claim is act, don't report. It cannot
serve the unparameterised ask, so half of ticket 04 silently does not exist there, and it publishes
a person's row somewhere the agent cannot hear them answer. The softer version — a webhook mirror
beside a real channel — is worse: two places to keep consistent, and a stale mirror republishes a
statement someone has since withheld.

Richness pays for itself nowhere in team surfacing. The view has no interaction, no state, no
branching and no controls; a card would improve typography and nothing else. The one speculative
case is the Connect level contacting an unblocker who never opted in — the intervention ladder's
territory, not this discovery's.

Named cost: demo polish. A plain message reads as unfinished beside Geekbot or DailyBot to an
enterprise buyer. Accepted because the motion is team-adopted rather than sold, but it is the loss
the perspective was least comfortable with.

Asked of the architecture perspective: does "no capability query on the adapter interface" hold in
practice, or is there a case where the agent must know the platform before composing?

### `nxs-architect` — 2026-09-05

Answered the capability-query question: it holds, and it holds better as a type than as a rule. The
outbound union for a group destination admits no interactive shape, so a team-facing button is
unrepresentable rather than merely forbidden.

Made the decisive argument for a structured seam over markdown, and it is a correctness argument
rather than a portability one. Markdown is itself a platform detail — Teams renders `**bold**` and
`[text](url)`, Slack mrkdwn renders `*bold*` and `<url|text>`, Discord and Google Chat differ
again. Rows carry verbatim human statements, which contain `*`, `_`, backticks, `#` and bare URLs,
and escaping rules differ per dialect. Escaping at compose time means escaping for one platform and
mangling the person's words on every other. Ticket 03 permits mechanical truncation and forbids
re-wording; silently eating a person's asterisks fails the property that makes the record credible.

Warned off the other intermediate representation: a portable rich-message layout language that
translates Block Kit to Adaptive Cards. The seam carries the domain view model, which ticket 02
froze and which is therefore small and stable. A presentation language would be neither, and would
need the capability negotiation the boundary exists to prevent.

The adapter is a plain module, not a Strands tool. If outbound delivery is reachable only as a
tool, the scheduled post is forced through a model turn, which ticket 04 forbids. The scheduled
path — schedule, sweep handler, registry, record, compose, deliver — never touches Strands,
AgentCore Runtime or Bedrock at all.

On the inbound path, the rendered view is never returned to the model as tool output for it to
relay, because it will re-word it. The tool returns a receipt.

Seven places a Teams-first build leaks platform detail upward, ordered by rework cost. First and
cheapest to fix: `runtimeSessionId` derived from Teams fields. The runtime standard makes it the
join key for AgentCore Memory, so changing the derivation later is not a refactor but memory loss
for every existing conversation. Then markdown in the composer; storing a Bot Framework
`ConversationReference` as the destination schema, when `serviceUrl` drifts and is Teams-private;
the five-second invoke budget shaping the agent's interface, when Slack's update call and Discord's
interaction window differ; chunking in the composer; at-mention suppression by omission, which a
later Slack adapter author would helpfully undo by resolving an owner name to a mention; and sweep
logic living inside the Teams messaging endpoint.

Flagged a size collision the earlier tickets did not see. Ticket 04 ruled out paging, but that was
decided against Teams' 40 KB message cap. Discord's message limit is roughly 2000 characters and
Slack's text field roughly 4000, so the binding constraint is Discord, and a fifteen-row view
carrying verbatim statements will exceed it.

For ticket 07: a Workflows incoming webhook fails the inbound and stable-handle clauses, so it is
not a platform under this floor. More usefully — the webhook cannot be the fallback for a tenant
that blocks custom app upload, because that same block kills the bot, hence the 1:1, hence every
statement. The webhook would faithfully deliver a view in which every row reads "unknown".

## Resolution

- **Decided:** The floor is a **proactive formatted-text message into a group destination, with a
  reply path back from it**. It has four clauses, and a platform that misses any one of them is not
  a platform Ripples supports:

  1. Proactive send into a durable group destination, unprompted.
  2. Formatted text — bold, line breaks, bulleted lines, inline hyperlinks. No tables, no columns,
     no images, no colour.
  3. Inbound text from that same destination, attributable to a stable actor id.
  4. A destination handle that is stable and storable, and survives a process restart.

  **Two-way conversation is inside the floor.** Receiving a reply is not a platform luxury: the
  unparameterised ask is a functional goal of ticket 04 and is what lets the schedule be weekly
  rather than daily, and ticket 03's read-and-withhold guarantee is a conversation rather than a
  broadcast. The 1:1 check-in needs an inbound path regardless, so requiring one of the team surface
  costs no capability that is not already being paid for.

  **Team-facing surfaces use the floor and nothing above it.** Buttons, card actions, dialogs and
  forms are above the floor. An adapter may use an above-floor primitive **only to render a
  floor-level message better** — the same information, no new interaction, nothing not derivable
  from the view the agent handed it. A Teams adapter rendering the rows as an Adaptive Card table is
  legal. A card with a button is not, and neither is a card carrying anything the adapter could only
  have got by reading the record itself.

  **In a 1:1, an above-floor affordance is allowed only as a shortcut** for something already
  expressible as typed text, hitting the same code path and producing the same record write. One
  affordance is excepted on every platform including the first: **the statement preview gets no
  one-tap approve.** A control that lets a person dismiss the row without reading it destroys the
  only thing the preview was built to produce.

  **What is enforced in code is a deterministic escape hatch, not a widget.** Reserved literal
  words for withholding and backing off are matched in the agent, before any model turn, on every
  channel. The preview turn names those words each time it shows a row, and they keep working later
  in the conversation rather than only in the turn that showed the preview.

  **The seam carries a structured view, never rendered text.** The agent composes a view model —
  the two counts, the rows and their four fields, the recurring-blocker and external-wait lines,
  and what moved — and each adapter renders it into its own syntax. The agent never emits markdown,
  because markdown is itself a platform detail, and because rows carry verbatim human statements
  whose metacharacters would have to be escaped for one dialect and mangled in every other. The
  seam is the domain view model and is **not** a portable layout language: nothing translates one
  platform's rich-message format into another's.

  **The interface carries no capability query.** The agent cannot ask whether a platform has
  buttons, and never learns whether a person tapped or typed. Enrichment is adapter-local and
  invisible above the seam. Adding a platform is writing a renderer and a front door, never editing
  the agent.

  **The boundary.** The adapter owns transport and platform authentication, the mapping from a
  platform identity to a stable person id, the destination handle's private payload, the markdown
  dialect and its escaping, message size limits and splitting, retry and rate-limit behaviour, and
  the platform's own installation concept. The agent owns every read of the execution record, the
  composition of the view, the derivation of the statement slot from back-off state, the message
  budget, session identity, cadence and local-hour computation, and every conduct rule. **Conduct is
  checked above the seam and adapters get no read access to the execution record and no directory
  lookup**, so an adapter cannot violate a conduct rule rather than being asked not to.

  Four consequences follow and are ruled here rather than left to an implementer:

  - **The view renders as stanzas, not a grid.** No floor platform renders a markdown table — and
    neither does a Teams text message, so this binds on platform one and is not a portability tax.
  - **A long view is split into consecutive messages by the adapter.** That is not the paging
    ticket 04 refused, because nothing is navigable: there is no next, no previous, no stored
    position, and the whole view still arrives. The floor does not promise a message of unbounded
    length, and the binding limit is Discord's rather than Teams'.
  - **The unparameterised ask is recognised above the seam**, in a model turn. A literal command
    match inside each adapter would hand every adapter a piece of intent recognition, which is
    agent work leaking downward. This does not disturb ticket 04, which fixed that the *scheduled
    post* runs no model turn; the ask is inbound and already conversational.
  - **The adapter is a plain module, not a Strands tool.** Tools wrap it on the paths that need the
    model. If delivery were reachable only through a tool, the scheduled post would be forced
    through a model turn that ticket 04 forbids.

- **Why:** The floor is free, and that is the whole case for taking it now. Ticket 02 banned scores,
  trends, percentages, colour, red-amber-green, sorting, grouping, filtering, paging and history,
  and ticket 04 made the scheduled post a deterministic assembly with no model turn. Cards buy
  layout, tables and buttons. There is no layout left to buy, no table that survives contact with a
  Teams text message, and no interaction to attach a button to. A capability floor is usually a
  sacrifice against a hypothetical second platform; here it is a restatement of what the content and
  delivery rulings already decided, and it would be a strange thing to decline for free.

  Two-way is in the floor because taking it out reopens a resolved ticket. Without an inbound path
  the ask does not exist, and without the ask the cadence argument collapses back to daily, which
  ticket 04 refuted because five identical posts a week let a reader reconstruct the person-anchored
  view the data model exists to prevent. An outbound-only channel also publishes a person's row
  somewhere the agent cannot hear them, which is the wrong shape for a product whose claim is that
  it acts rather than reports.

  The structured seam is a correctness decision before it is a portability one. Ticket 03 permits
  mechanical truncation and forbids re-wording, and the statements that cross contain asterisks,
  underscores, backticks and bare URLs. Escaping them at compose time means escaping for one
  dialect and corrupting them in every other, and a record that quietly eats a person's punctuation
  is no longer the verbatim record that makes it credible. The portability benefit — a renderer per
  platform instead of a markdown transpiler that has to round-trip escaping — arrives as a second
  reason for a decision the first reason already settles.

  The preview keeps no approve button because the affordance's job is not consent-capture but
  reading. Ticket 03 bought the richer view by showing the person their row instead of asking them
  to trust a policy read once at onboarding, and that trade only pays if the row is actually read.
  A tap is cheaper than a read, so a tap becomes the reflex, and the preview degrades into the
  onboarding notice it replaced. Typing costs a person two seconds inside a conversation where they
  are already typing sentences about their own work.

  Reserved words are matched in the agent, before any model turn, because "always" in ticket 03's
  fixed floor is a claim about availability. A withhold that depends on a model reading an oblique
  sentence correctly is probabilistic, and a probabilistic escape hatch is not a floor. Putting the
  match in the agent also enforces it once for every platform, in one place a self-hosting team can
  read — which is the open-source trust story doing actual work rather than being asserted.

  The interface carries no capability query because a capability query is how platform branching
  climbs into the agent. The moment the composer can ask whether buttons exist, there is a
  behaviour matrix that continuous integration cannot exercise, a feature set that is Teams-only in
  practice, and adapter authors reverse-engineering what the agent expects. Expressed as a type
  instead — a group destination's outbound union admitting no interactive shape — a team-facing
  button is unrepresentable, and no reviewer has to catch it.

  Conduct sits above the seam for the same reason. Back-off, the message budget, the rule that no
  row appears about an item not already raised with its owner, and the ban on at-mentions are all
  enforceable in the composer. Below the seam each of them becomes a thing every new platform can
  break and every new adapter has to be audited for. At-mentions are the clearest case: suppressing
  them by simply not emitting them invites a later adapter author to helpfully resolve an owner's
  name into a mention, so the owner field is typed as display text and adapters are given no
  directory lookup to resolve it with.

- **Refuted alternative:** Target the richest form the first platform offers, and degrade elsewhere.
  It is what most products in this space do, it makes the Teams build look finished on day one
  against Geekbot and DailyBot, and it defers the portability cost to a team that may never arrive.
  It lost on what it would have to buy. Degrading requires the agent to know what it is degrading
  from, which is the capability query; the query is a behaviour matrix; and the matrix is how a
  second platform stops being an adapter and becomes an edit to the agent — the precise outcome this
  ticket exists to prevent. It also lost on price: since ticket 02 removed everything a card renders
  well, the richest form and the floor display the same information, so the alternative pays the
  portability cost for a difference in typography.

- **Second refuted alternative:** Put markdown on the seam — the agent composes the message text and
  the adapter posts it. It is simpler by one layer, it needs no renderer per platform, and it is the
  obvious shape when only one platform exists. It lost to the verbatim rule rather than to
  portability. Statements crossing from a 1:1 carry markdown metacharacters, dialects differ in how
  those are escaped and in how bold and links are written, and composing for one dialect either
  mangles a person's words on every other platform or forces a transpiler that has to round-trip
  escaping correctly. Ticket 03 made those exact words load-bearing, so corrupting them is not a
  rendering bug.

- **Left open, and not this ticket's:** `runtimeSessionId` must carry the platform in its derivation
  before the first session exists. The runtime standard fixes the derivation as the conversation
  plus the team, which is correct and predates a second platform; the join key it produces is
  AgentCore Memory's namespace, so adding the platform later is not a refactor but memory loss for
  every conversation already held. It is one line, it must land before any namespace is created, and
  it is an amendment to `strands-runtime.md`, which is a document of its own rather than this
  discovery's to edit. It travels onto the stubs at graduation, alongside ticket 03's conduct
  amendment.

- **Also not this ticket's, and evidence for ticket 07:** a Workflows incoming webhook fails the
  inbound and stable-handle clauses, so it is not a platform under this floor — but the delivery-only
  sink question is ticket 07's, and the structured seam makes such a sink nearly free, roughly a
  renderer with no inbound half. Ticket 07 should decide it knowing two things: that the cost is now
  small, and that the webhook cannot serve as the fallback for a tenant blocking custom app upload,
  because that same block kills the bot and therefore the 1:1, so the sink would faithfully deliver a
  view in which every row reads "unknown".

- **Also not this ticket's:** ticket 02's row layout is stated as a list and should be restated as
  stanzas before it becomes a stub, since no floor platform and no Teams text message renders a
  table. That is a wording correction at graduation, not a change to the content set.

- **Resolved by:** sameera on 2026-09-05
