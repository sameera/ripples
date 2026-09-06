---
title: "Which channel does a team's scheduled post land in, at what local hour, and who decides both?"
type: council
status: resolved
blocked_by: none
surface: "the post-install welcome and the destination claim"
claimed_by: sameera
claimed_at: 2026-09-06T03:15:15Z
---

## Question

The delivery ruling puts the scheduled post into one channel the squad already reads, at a local
hour a playbook holds. Neither value has a source yet. [asked: "surface the overall project progress to the team as a whole"]

An app installed into a team is reachable in every channel of that team. With no designated channel
the scheduled post either goes nowhere or goes to all of them. So one channel has to be named per
team, and something has to name it: the person installing the app answers a question, or the
deployment takes whichever channel the app was installed into, or the value sits in a playbook file
the team edits.

The local hour is the same registry entry and the same trade-off. The schedule fires on UTC and the
handler computes local time, so the hour is stored data whichever way this goes. What is undecided is
whether a team is asked for the local hour at install or handed a default they can change later.

Decide both, and decide who supplies them.

## Why it blocks

Until this is settled the scheduled post has no address. It also decides whether team surfacing
carries an install-time configuration step at all, which is the difference between a backlog stub
that is one schedule entry and one that includes an onboarding exchange. The product context treats
time-to-first-value as the constraint that decides adoption for self-hosted tools and assumes no
onboarding support, so an added install question is a real cost. So is a wrong default: a post in a
channel nobody reads, or at an hour that lands overnight for half the team.

## Evidence

**`nxs-pm`** — Read the product context, the conduct standard, and tickets 04, 07, 08 and 10.

Reported that Microsoft's own add-to-team dialog carries a channel field, that the resulting
install activity sets `conversation.id` to the channel the installer selected, and that General
is only the fallback when they select nothing. Cited Microsoft's statement that this id
"represents the channel where the user intends for the bot to operate". Concluded that an
install-time question re-asks a question the platform already asked, and that a playbook-held
channel is unusable because a Teams channel identifier is a string of the form
`19:5b6cd8e2f1a94...@thread.tacv2` that nobody hand-edits.

Also reported that apps carrying bots reached general availability in private and shared
channels during 2026, added per channel with a channel-owner consent control, and that a
team-level install still does not reach them. Ticket 07's premise holds; its consequence does
not.

Argued Monday late afternoon on two forced constraints: ticket 04 makes the post the last stage
of the check-in cycle, so a morning post prints the previous day's statement on every row; and
the product's first principle is act, don't report, so a Friday post arrives after the week's
chance to act is spent. Argued that the timezone should be the earliest-starting locale in the
squad, because ticket 04 bars at-mentions so no notification fires, which makes the only thing
the hour controls whether both halves of a split squad read the post on one working day.

Named its own ruling as close, and said it collapses to the picker if the install event does not
carry a chosen channel.

**`nxs-architect`** — Read the stack document, both standards, and tickets 01, 04, 07 and 08.
Reported that the repository has no `src/` and no `schedules/`, so nothing it says is verified
against source.

Contradicted the product perspective on the load-bearing fact, at high confidence. A Teams bot's
install scope is the team, not a channel. The human picks a team; the bot is then reachable in
every standard channel of it. General's thread id is identical to the team id, which is why the
install activity's `conversation.id` equals `channelData.team.id`. So "the channel the app was
installed into" is not a value the payload carries — it is always General wearing a different
name, and a weekly post sent there fails silently, because the send succeeds and nobody reads
it. Believed the newer dialog's channel field binds tabs rather than the bot, at medium
confidence.

Said both readings are settled by the same twenty-minute check: install a bot-only app into a
real tenant and dump the raw `installationUpdate` and `conversationUpdate` payloads. The same
session confirms whether `getTeamChannels` returns, whether private channels are enumerated, and
whether the client-info entity carries a timezone.

Reported that a proactive channel post a week after the install needs the channel id with any
`;messageid=` suffix stripped, a `serviceUrl` refreshed from the most recent inbound activity
rather than pinned at install, and the tenant id. Reported that channel enumeration costs
nothing new — it runs on the bot credential the endpoint already holds, with no Graph client and
no admin consent — and refused the picker on ceremony cost rather than on feasibility, which it
named as the weaker-looking and therefore honest reason.

Priced the install-time question at M and claim-by-mention at S, and gave three reasons beyond
cost. Asking the installer still has to ask somewhere, and that somewhere is General, so the
picker relocates the readership problem rather than removing it. The installing human's identity
is not reliably carried on a team-scope install, so "ask the installer" degrades into "take the
first answer from anyone". And a pending-setup state adds a stateful branch to intent
recognition, where inbound text already means either a roster add or the unparameterised ask.

Ruled one static `rate(15 minutes)` schedule regardless of team count, with a due test that asks
whether a team's local post time for its current local date has passed and no post marker exists
for that pair, rather than testing clock equality. That formulation makes a missed tick
self-healing and makes both daylight-saving transitions non-events. Ruled a stored IANA zone
rather than a UTC offset. Ruled the registry a table rather than a singleton, because team count
is unbounded by construction and a singleton can only overwrite or ignore the second team, both
silently.

Flagged three open clarifications: the default day is a product call it would not make; whether
the one-time welcome post sits inside the conduct message budget; and whether moving the
destination needs an authorization rule.

## Resolution

- **Decided:** A channel becomes a team's destination when someone mentions Ripples in it. The
  install event does not name it, and nobody is asked for it.

    ```text
    On install - into whatever channel the platform hands us

      Ripples  Ripples is installed. It is not posting yet.
               In the channel your squad reads, say:

                 @Ripples track "auth refactor" - Sam


    The first mention claims that channel - #squad-delivery

      Priya    @Ripples track "auth refactor" - Sam

      Ripples  Tracking it. The weekly view lands in this channel,
               Mondays 16:00 Europe/Dublin, after check-ins close.

                 auth refactor
                 Sam . no statement yet


    One act names the channel and fills the roster. Nothing posts
    before a human types in the channel they actually read.
    ```

  The install event creates the registry row and buys exactly one message, sent into whichever
  conversation the platform hands back. That message says Ripples is installed, says it is not
  posting yet, and gives the one sentence that turns it on. It is the only use that conversation
  is ever put to.

  **The first mention in a channel claims that channel, and the claim is sticky.** A later mention
  in a different channel is answered by naming the current destination and the one typed sentence
  that moves it, so a destination moves only when someone means to move it. Moving it is a typed
  re-claim from the channel the team wants, which needs nothing above ticket 06's floor.

  **This ruling does not depend on the platform fact the two perspectives disagreed about.** They
  split on whether the install activity carries the channel the installer picked or always carries
  General. Under this ruling the answer changes nothing: the install conversation is used once for
  a welcome and never as the standing destination, so it does not matter which channel it is.
  The check that settles the disagreement is still worth running, but it is a build detail on the
  registry stub rather than a question this discovery waits on.

  **The same act covers a private channel.** Ticket 07 established that a private channel does not
  inherit a team install, and the two perspectives disagreed on whether a bot can be added to one
  at all. A claim arrives from wherever an inbound activity arrives from, so a private channel that
  can deliver a mention is claimable on identical terms, and one that cannot leaves that squad in
  ticket 07's unconfigured state, which is already ruled and already tells them so in the 1:1 every
  day.

  **The local hour is nobody's to supply.** The post fires after that team's check-in cycle closes,
  which ticket 04 already made the post's position in the cycle rather than a separate value. The
  default is Monday, late in the working day. Cadence, day, hour, timezone and whether the post
  runs at all stay playbook values, as ticket 04 ruled them, and the playbook is where a team
  changes them.

  **The timezone is one stored IANA zone per team, defaulting to UTC**, and the claim confirmation
  states the resolved day, hour and zone in words. A wrong default is then visible in the first
  minute rather than discovered in week three. A team split across localities sets the zone to
  where its earliest half starts work, which is what makes both halves read one post on one
  working day.

  **The two values live in two stores, on ticket 06's existing boundary.** The channel handle is
  adapter-owned derived state: written by the messaging endpoint in response to platform activities,
  created on install, filled on the claiming mention, refreshed on every inbound activity, destroyed
  on uninstall. No human types or reads it. The cadence, day, hour and zone are agent-owned playbook
  values a human authors. Both are addressed by one team key that carries the tenant id.

  **The registry is a table, not a single configured value.** Anyone who adds the app to a second
  team creates a second row, and nothing gates that, so a singleton could only overwrite the first
  team or ignore the second. Both are silent failures.

  **One schedule serves every team, whatever the team count.** It fires on a fixed short interval in
  UTC, and each tick asks per team whether that team's local post time for its current local date
  has passed with the cycle closed and no post already marked for that date. It never asks whether
  the clock reads the post hour. A missed tick then posts on the next one instead of dropping the
  week, and both daylight-saving transitions stop being events at all.

  **The welcome post is outside the conduct message budget.** That budget counts unsolicited
  messages to one person about one work item. This message names no person, names no work item, and
  answers a human's own install act.

  **Moving the destination needs no authorization**, on the same terms ticket 08 gave roster
  maintenance: any member of the channel can do it. If roster maintenance ever gains an
  authorization rule, the destination move takes the same one.

  **Ticket 08's roster is keyed to the team, not to the channel handle.** Its phrase "one roster per
  team destination" predates a destination that can move. Read literally against this ruling, moving
  the channel would orphan the roster; it does not.

- **Why:** The claiming mention is free because it is an act ticket 08 already requires. The roster
  is declared by typed messages in the channel the view lands in, and the view lists nothing until
  someone declares the first item, so there is no reachable state where a team has a roster and no
  destination. Claiming the destination on that same message costs one write on an activity the
  endpoint already receives and already parses.

  It also fires at the moment of most knowledge rather than least. At install, the person adding the
  app may not know which channel the squad will settle on, and the roster does not exist. At the
  first mention, someone is standing in the channel they actually read, naming the first piece of
  work. The act that configures the destination is the act that populates it.

  The install-derived destination lost on the disputed fact and would have lost anyway. If the
  architecture perspective is right, it ships the weekly post into General for most teams and fails
  silently — the send succeeds, the API returns success, and nobody reads it. This discovery has
  refused the silent-failure shape in every prior ticket, and ticket 07 refused the webhook partly
  because the one path with no inbound half is the one whose silence cannot be detected. Even if the
  product perspective is right about the payload, the value it captures is a dialog field a hurried
  lead clicked past, which resolves to General when they click nothing.

  Nobody is asked for the hour because there is nothing left to ask. Ticket 04 made the post the
  last stage of the check-in cycle, which fixes it late in the day; a morning post prints the
  previous day's statement on every row. Monday rather than Friday follows the product's first
  principle: the view lists work that is quietly dying, and a Friday post arrives after the week's
  chance to act is spent, which makes it the report the README argues against. Monday leaves four
  working days.

  The distributed-team case is smaller than it looks because ticket 04 bars at-mentions on every
  team-facing surface. No notification fires, so a post that lands outside someone's hours is
  sitting at the top of the channel when they arrive, which is where it should be. What the hour
  actually controls is whether both halves read it on the same working day, and setting the zone to
  the earliest-starting locale is what guarantees they do.

  Two stores rather than one because the two values have different authors and different lifecycles.
  A channel handle is a string no human can author or verify, so a playbook holding one guarantees a
  team eventually holds a stale handle they cannot debug. A local hour in derived state is reverted
  by an uninstall and reinstall, which silently undoes a team's deliberate choice. Ticket 06 already
  put the destination handle's payload below the seam and cadence and local-hour computation above
  it, so this is that boundary applied rather than a new one.

  The due test is a comparison against stored local time rather than a clock equality because
  equality drops a week whenever a tick is missed, throttled or delayed, and because a spring-forward
  gap means the post hour never occurs while a fall-back repeat means it occurs twice. Stating it as
  "has this team's time for this local date passed, and is there no post marked for it" makes a
  missed tick self-healing and makes both transitions non-events, which is why the interval length
  is a latency choice rather than a correctness one.

- **Refuted alternative:** Ask the installer, with a channel picker in their own 1:1. It is the
  strongest option and both perspectives took it seriously. It is right every time, it produces a
  value a human consciously chose rather than a default wearing a decision's clothes, and ticket 06
  permits the control because a 1:1 is not a team-facing surface. Channel enumeration is not the
  obstacle: it runs on the bot credential the endpoint already holds, with no Graph client, no admin
  consent and no second token.

  It lost three times. It relocates the readership problem rather than removing it, because the only
  conversation the install hands back is the one it was invented to avoid, so the question is asked
  in General. The installing human's identity is not reliably carried on a team-scope install, which
  degrades "ask the installer" into taking the first answer from anyone and makes redirecting a
  team's destination an unauthenticated act. And a pending-setup state adds a stateful branch to
  intent recognition, where inbound text in a claimed team already means either a roster add or the
  unparameterised ask — it needs an expiry, a re-ask that costs an unsolicited message, and a
  re-entry path for changing the value later, which the claim already provides for free.

- **Second refuted alternative:** Take the destination from the install event and let a typed
  sentence move it later. It is the cheapest of the three and the only one configured before anyone
  types. It lost because it rests on a field the two perspectives could not agree exists, and the
  reading that says it does exist still resolves to General whenever the installer clicks past the
  field — which is the modal case for someone evaluating a tool between two meetings. It buys a
  configured-looking state that is wrong for a large share of teams, and its wrongness is invisible
  until someone notices the post is landing somewhere nobody reads.

- **Third refuted alternative:** Hold the channel in the playbook file beside the cadence. It keeps
  every human-facing value in one place a team already edits. It lost on the shape of the value: a
  Teams channel identifier is not a string anyone authors, and making the playbook hold a channel
  *name* instead requires a resolver and a directory read to recover an identifier the platform
  already hands us on every inbound message.

- **Left open, and not this ticket's:** the raw install payload has not been observed. Both
  perspectives argued from documentation and reached opposite conclusions, and the same twenty-minute
  check settles all of it — install a bot-only app into a real tenant, dump the install activities,
  call the channel-enumeration API, and look for a timezone on the client-info entity. It is a
  verification step on the destination-registry stub, and this ruling was chosen so that it is not a
  blocker.

- **Also not this ticket's, and evidence for ticket 10:** claim-by-mention makes the first roster
  item the act that turns team surfacing on, which means a team that installs and never types one
  gets nothing at all, indefinitely, with no completion event and nothing to tell them setup was
  never finished. Ticket 10 was written about a roster that rots over time. It now also owns the
  roster that was never started.

- **Also not this ticket's:** whether the app manifest has to declare private and shared channel
  support for Ripples to appear in those pickers. It is a packaging line on the registry stub, not
  a decision.

- **Resolved by:** sameera on 2026-09-06

## Amendment — 2026-09-06

Ticket 08 was reopened and re-resolved after the lead corrected its premise: a team's item set is
a GitHub project's current sprint, read by Ripples and maintained by the team lead on the board.
Two parts of this ruling were written against the superseded set and need restating. Everything
else here stands.

**The claiming act is no longer a roster add.** This ruling made a channel the team's destination
on the first mention of Ripples in it, and used `@Ripples track "auth refactor" - Sam` as the
sentence that does it, because ticket 08 required that act anyway. There is no such act now —
nobody types an item into Ripples. The ruling itself is unchanged: the first mention of Ripples
in a channel claims that channel, the claim is sticky, and a later mention elsewhere is answered
by naming the current destination and the sentence that moves it. What has to change is the
sentence the welcome message teaches, and the welcome message is the only place it appears.

**The reasoning that no team can hold a roster without a destination is gone.** It read: the view
lists nothing until someone declares the first item, so a team cannot have a roster and no
destination. A board exists before anyone mentions Ripples anywhere, so a team can now hold a
full sprint and no destination at all. The ruling survives on its other grounds — the claim fires
at the moment of most knowledge, in the channel the squad actually reads, and the
install-derived destination fails silently into General — but this particular argument no longer
supports it.

**Ticket 08's authorization conditional has fired.** This ruling said moving the destination needs
no authorization on the same terms ticket 08 gave roster maintenance, and that if roster
maintenance ever gained an authorization rule the destination move would take the same one. The
set is now maintained by the team lead, in GitHub, under GitHub's own permissions. Whether that
carries over to claiming or moving a channel is not settled here, and it belongs with the ticket
that decides which board is a team's and who names it.
