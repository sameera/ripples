---
title: "Must team-wide surfacing assume the app can be installed into the team, or must it degrade when the tenant forbids custom app upload?"
type: council
surface: "the 1:1 preview turn when the team has no destination"
status: resolved
blocked_by: none
claimed_by: sameera
claimed_at: 2026-09-06T02:22:01Z
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

## Evidence

Produced by the `nxs-pm` and `nxs-architect` agents on 2026-09-06, run as this ticket's
council against the question verbatim. Evidence, not a resolution.

### From `nxs-pm` — the product perspective

The webhook is not a lesser mode, it is a conduct violation, and that settles it before any
cost argument. Ticket 03's fixed floor lives entirely in the 1:1 — the row is previewed
there and the withholding happens there. The tenant block that forbids the app package
forbids the bot, so it forbids the 1:1, so it forbids the preview and the withholding. What
the webhook would deliver is a report about a person's work that the person never saw and
cannot correct, which `agent-conduct.md` prohibits outright.

The block is the last admin gate, not the first. A team that reaches it has already stood up
an AWS account and an Entra app registration, and tenants that lock custom app upload
generally lock app registration too — so the wall is rarely the binding constraint by the
time a team hits it.

One configuration exists where a webhook view would be worth reading: a team owner has
switched off member app-adding while the tenant still permits the app and the personal-scope
install. There the 1:1 works and statements are real. But that team's fix is one message to
their own team owner, and the person who can create a Power Automate flow in the channel is
usually the person who could add the app.

A declared lesser mode costs more than the doubled goal count. It becomes the product's
public face, because it is the easiest path to reach: an evaluator tries it first, sees the
empty-statement view, and concludes Ripples is a stall report with a Teams webhook — never
meeting the memory loop or the ladder, which are the only two things separating it from
Geekbot.

"A team Ripples cannot serve" is acceptable for an open-source team-led product — nobody paid
and nobody is stranded — but it is not accurate. Ticket 01's research says a tenant blocking
custom app upload can still publish the app through the Teams admin centre. The block is on
self-serve upload, not on Ripples. The honest answer is a documented admin-request page, and
that page is on-strategy rather than a consolation: the admin conversation is where the
readable-code argument is worth the most, and designing a path that avoids ever making it
wastes the product's best answer to "why should I let this talk to my staff".

### From `nxs-architect` — the architecture perspective

The "nearly free" claim is true about the renderer and false about the feature. The renderer
is cheap because ticket 06 already paid for it — a sink is a narrowing of an interface
already set at the bottom, and narrowing is always safe. Above the renderer the sink adds:

- **A destination lifecycle that stops being derived.** There is no install
  `conversationUpdate` to create the entry, no uninstall event to destroy it, and no later
  inbound activity to refresh it from. Every mechanism tickets 01 and 04 rely on to keep the
  registry correct is absent, so the registry becomes hand-maintained state.
- **A capability query, sited on cadence instead of composition.** Ticket 04 justified the
  weekly default by the ask existing. A destination with no inbound half has no ask, so that
  fact has to be visible above the seam — the behaviour matrix ticket 06 refused, entering
  where the type system was not watching.
- **Per-team credential storage that does not exist today.** The webhook URL is the posting
  credential. A leaked conversation reference is inert without the deployment's Entra
  credential; a leaked webhook URL lets anyone post into that channel indefinitely, and it
  cannot be rotated. `strands-runtime.md` prohibits channel signing secrets in environment
  variables or the repo, and AgentCore Identity brokers OAuth, which a bare bearer URL is not.
- **A second setup path with no surface to run it on.** The install path configures itself;
  the webhook URL has to be pasted somewhere, and the two candidates are a hosted page or a
  config file.
- **A test surface that never closes.** The delivery path cannot be exercised end to end
  without a live Power Automate flow in a real tenant. The Bot Framework path has an emulator.

A sink can be admitted without eroding the floor under exactly one rule — it may only attach
to a team that already has a conforming platform. That rule kills it. Where the group
destination works the sink is a mirror, which ticket 06 already refuted; where it does not
work the sink substitutes for a failing floor clause. There is no reachable state where it is
both additive and useful.

**The scope gap is the day-one default, not an edge case.** Personal install and team install
are separate acts by separate people, a team owner can switch off member app-adding, and
private channels do not inherit a team install. So "1:1 works, cannot post to the channel" is
the state of most deployments for some window and of some deployments permanently — and it
argues for a named unconfigured state, not for a sink.

On stale destinations the conversation reference degrades far more safely. It fails
attributably: the Connector returns a status, uninstall and archive emit events, `serviceUrl`
drift is refreshable, and the 1:1 is still open so Ripples can tell a human. A dead webhook
fails silently and unrecoverably — the flow dies with its creator's account, an
incoming-webhook POST can return success while the flow behind it fails, and recovery needs
the original human to repeat the original act unprompted, because there is no way to ask them.

Identity is the one place the sink is clean: ticket 03's floor is discharged inside the 1:1,
and ticket 04 already bars at-mentions and types the owner as display text. One attribution
wrinkle stands — a Workflows post is authored by the flow's creator, so a team would see a
post nominally from a colleague quoting other colleagues verbatim.

Requiring the install keeps team surfacing at four stubs, all M or smaller: destination
registry plus install capture, the deterministic sweep and view composition, the Teams
renderer, and inbound ask recognition. The scheduled post and the ask are separate stubs even
though both are required — they share only the view model, and have different triggers,
failure modes and tests.

## Resolution

- **Decided:** Ripples requires the app to be installed into the team, and ships no second
  delivery path. A tenant that forbids custom app upload is answered by asking its
  administrator, not by routing around them: ticket 01's research established that such a
  tenant can still publish the app through the Teams admin centre, so the block is on
  self-serve upload rather than on Ripples. The requirement ships with a documented
  admin-request page — what to ask a Teams admin for, what the app requests and why, what data
  it touches, that the record stays in the team's own AWS account, and links to
  `agent-conduct.md` and the playbooks so the admin can read the rules instead of trusting a
  claim. It is the enterprise onboarding path, not the failure branch.

  **The Workflows incoming webhook is refused** — as a declared lesser mode, and as an
  optional extra destination for a team that already has a working bot.

  **Team-wide surfacing is not restructured to remove its dependence on a reply.** Ticket 06
  put two-way inside the capability floor and that ruling stands.

  Requiring the install makes the destination registry derived state rather than
  hand-maintained: the entry is created from the team-install `conversationUpdate`, destroyed
  on uninstall, and its `serviceUrl` refreshed from later inbound activity.

  **The degradation Ripples does build is the unconfigured state** — the personal install
  works, the team has no destination. It is a named first-class behaviour rather than an
  error, because personal and team install are separate acts by separate people, a team owner
  can switch off member app-adding, and private channels do not inherit a team install. Check-ins
  run, statements are recorded and the record accumulates; nothing is posted; and the preview
  turn tells the truth about it every time it is shown:

    ```text
    No team destination. The 1:1 check-in, at the preview turn.

      Ripples  This is your row. Nothing posts it yet - Ripples is
               not installed in a team:

                 <work item> - <link>
                 "<statement, verbatim>"
                 <owner> . <date>

               Ask a team owner to add Ripples to your team.
               Reply CORRECT or WITHHOLD to change it.

    Said every time the preview is shown, for as long as it is
    true. Reverts to "here is the row your team will see" the day
    a destination exists.
    ```

  The line costs nothing against the message budget. It sits inside the check-in exchange the
  agent already opened, which ticket 03 established is not an unsolicited message, and it
  clears itself the day a destination exists rather than needing anyone to remember to remove
  it.

- **Why:** The webhook fails on conduct before it fails on cost. The same tenant block that
  forbids the app package forbids the bot, and the bot is the 1:1 — so it forbids ticket 03's
  preview and ticket 03's withholding. What the sink would faithfully deliver is a weekly
  channel post of named work items with named owners and dates, every statement slot empty,
  about people who never saw the row and have no way to correct it. That is a stall board with
  the human statement removed, which is the person-anchored surveillance shape the data model
  exists to prevent, reached from outside the schema. `agent-conduct.md` already forbids
  sending a report about a person that the person cannot see, so this is a prohibited artifact
  before it is a poor one — and Teams-first means it would be shipped first to Microsoft-shop
  enterprises with works councils, the worst audience for it.

  The operational case is second and independently sufficient. The webhook URL is the posting
  credential, it cannot be rotated, and it dies with its creator's account — while
  `strands-runtime.md` prohibits channel signing secrets in environment variables or the repo,
  so storing one demands a per-team secret store on a registry ticket 04 sized as small
  key-value state. An incoming-webhook POST can also return success while the flow behind it
  fails, so the one delivery path with no inbound half is the one whose silence cannot be
  detected. For a product whose stated failure mode is a view nobody receives, an undetectable
  outage is worse than a hard failure, and it arrives at the worst moment — the owner leaving
  is exactly when the team view matters.

  The sink also smuggles the capability query back in. Ticket 04 justified a weekly cadence by
  the ask existing, so a destination with no reply path has no ask, and the agent would have to
  know which kind it is holding. Ticket 06 removed that knowledge from the composer by typing
  it away; re-introducing it on cadence puts the same behaviour matrix somewhere the type
  system is not watching.

  The unconfigured state earns a ruling because it is the common case and the tenant block is
  the rare one. Most deployments will spend some window with a working 1:1 and no channel, and
  some will stay there. It converts to full function the moment someone installs, which makes
  it the reversible ramp the webhook was pretending to be — and it needs no second rendering,
  no secret, no second setup document and no permanent caveat on cadence.

  The preview stays honest because ticket 03 bought the richer team view by showing the person
  their actual row rather than asking them to trust a policy read once at onboarding. "Here is
  the row your team will see" is a false statement while nothing posts it, and a preview that
  says something untrue every day is worth less than the onboarding notice it replaced. Saying
  it once and then reverting to the normal wording keeps the falsehood and drops the fix, which
  is the worse half of both options.

- **Refuted alternative:** Ship the webhook as a declared lesser mode and document what a team
  gets from it. It is genuinely viable — it needs no Azure subscription, no app package and no
  administrator, and ticket 06's structured seam makes the renderer a narrowing of an interface
  already at the floor, so the drawing half really is nearly free. It lost on conduct, and then
  again on adoption. A second setup path adds a "which mode am I in?" decision at the moment a
  first-run team has the least context, slowing the majority to serve a minority nobody has
  met. And because it is the easiest path to reach, it becomes what an evaluator tries first —
  so the empty-statement view becomes the product's public face, and the memory loop and the
  ladder, the only two things separating Ripples from Geekbot, never get seen.

- **Second refuted alternative:** Build the team-wide view so that it never depends on a reply,
  which would make the webhook a delivery detail rather than a mode. It is the tidiest of the
  three — one mode, no caveat, no second stub. It lost to ticket 06, which put two-way inside
  the floor: without an inbound path the unparameterised ask does not exist, and without the
  ask ticket 04's cadence argument collapses back to daily, which ticket 04 refuted because
  five identical posts a week let a reader reconstruct the person-anchored view.

- **Third refuted alternative:** Keep the sink, but only as an extra destination for a team
  that already has a conforming platform — additive, never substitutive. It is the version that
  breaks no floor clause, and it defers nothing that would be more expensive later. It lost
  because that rule leaves it with no reachable use: where the group destination works the sink
  is a mirror of it, which ticket 06 already refuted on stronger grounds, and where the group
  destination does not work the sink is substituting for a failing floor clause, which admits a
  below-floor team through a side door.

- **Left open, and not this ticket's:** the admin-request page is a backlog stub at graduation,
  not a decision — but it belongs to team surfacing rather than to setup, because requiring the
  install is what creates it.

- **Also not this ticket's, and evidence for ticket 09:** how many Teams teams one Ripples
  deployment serves decides whether the destination registry is a singleton configuration value
  or a multi-tenant table with its own lifecycle, which is the difference between a small stub
  and a medium one. Whether a pilot squad reads a private or a shared channel matters for the
  same ticket, because neither inherits a team install, so the scope gap is permanent rather
  than transitional for such a team. And of ticket 09's candidate answers, posting into
  whichever channel the app was installed into is the most robust, because it makes the install
  act the configuration and dissolves the private-channel problem.

- **Also not this ticket's:** the zero-install demonstration the webhook would have provided is
  replaced by a local renderer that writes the view model to standard output, which doubles as
  the renderer stub's snapshot-test fixture. That is a build detail travelling onto a stub, not
  a decision.

- **Resolved by:** sameera on 2026-09-06

## Amendment — 2026-09-06

Ticket 08 was re-resolved: a team's item set is a GitHub project's current sprint, and ticket 12
put the board reference in the team's playbook. That breaks one clause of this ruling.

**"Check-ins run, nothing posts" is now scoped to a team that has a board and no destination.**
This ruling described the unconfigured state as one where the valuable half still runs — the
check-in happens, statements are recorded, the record accumulates — and only team surfacing is
absent. That held when Ripples kept its own list of work items, because the check-in did not
depend on team surfacing being configured. It does not hold for a board the check-in reads its
questions from. A team with no board has no item set, so the check-in has no first question, so
nothing runs for that team at all.

**A team with no board is dormant, and that is ruled behaviour rather than a degradation.** The
lead has ruled it: no board, no check-in. Ripples says so once in the claimed channel, states
that it is the last message, and stays silent. The alternative — a check-in that opens anyway and
asks something needing no work item — was refused, because designing a first-run question is the
individual check-in conversation, which this discovery's destination places beyond it.

**The two states are told apart by which surface can carry the notice.** A team with a board and
no destination is this ticket's state, and it announces itself in the 1:1 preview turn every time
the preview is shown, because a 1:1 exists. A team with a destination and no board has no 1:1 to
announce anything in, so its notice lands in the channel. That is why it needed a mechanism of
its own rather than a line in this one.
