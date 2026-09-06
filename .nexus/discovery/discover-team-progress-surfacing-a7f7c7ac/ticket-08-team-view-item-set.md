---
title: "Which work items does the team-wide view list?"
type: council
surface: "team channel post"
status: resolved
blocked_by: none
claimed_by: sameera
claimed_at: 2026-09-06T04:20:00Z
---

## Question

Which work items make up the set the team-wide view lists? [asked: "surface the overall project progress to the team as a whole"]

The content ruling made the view a list of work items, so the set has to be defined before
anyone can build the list. Ripples reads no work tracker. This discovery placed tracker
integrations beyond its destination. Nothing outside the agent hands Ripples a project. The
candidates are the items people have already talked to Ripples about in their 1:1 check-ins,
a set the team declares once and maintains itself, or something else. Decide which source is
authoritative. Also decide what happens to an item nobody has mentioned in weeks: does it
leave the set, or does it stay in the set as unknown?

The set carries a size constraint that is part of the same decision. Ten to thirty rows fit
inside a chat message. A set that outgrows a message needs paging. Paging is one of the
things that forces a hosted page, which ticket 01 priced as the expensive path.

## Corrected premise — 2026-09-06

The question was first written as "which work items does the team-wide view list, when nothing
outside Ripples enumerates a project". Nothing in the repository contradicted that clause, and
no resolved ticket had established an enumerator, so the question was drafted around its
absence. The lead has since stated that one exists: a team's items are a GitHub project, the set
is each person's assigned sprint tasks, and the team lead maintains it. The title has been cut
back to the question itself and the trailing clause removed.

## Why it blocks

The view's content is decided and its subject is not, so nobody can write a stub for building
the list. A stub has to say what the list is a list of. This decision also gates the build-and-host
ruling. The size of the set determines whether a chat message can carry the view.

## Evidence

**`nxs-pm`** — The set should be emergent, not declared, because a roster is a form and the
product's own principles forbid one: "the record is a byproduct of a conversation people
want to have, never a form." A roster is a setup ceremony followed by a maintenance chore
that the most conscientious person does and abandons in week three, and the product context
says time-to-first-value has to be short with no onboarding support. It also inverts the
adoption motion — whoever maintains the roster owns the view, which in practice is the lead,
and ticket 04 already ruled the lead never receives the view alone. And a roster is items
with assigned owners, stored, maintained by someone other than the owner, which is a
person-to-items structure at rest and reads to a works council as task allocation.

**`nxs-pm`** — An emergent set would enter at ticket 03's preview turn, which already exists,
and leave through three doors: the owner declares it done or dropped; the owner says stop
tracking it; or the agent asks twice, gets nothing, and drops it after a calendar floor. One
anonymous line would report the drops without naming reasons, because a removal, an age-out
and a backed-off item have to render identically or the line becomes a way to read back-offs.
Expected failure modes: two people naming one job twice under different words; a ghost row
from a passing mention; a quiet engineer's item that never exists to the team at all; and a
person's whole set going unknown together while they are on holiday, which a reader assembles
into a fact about that person.

**`nxs-architect`** — The either/or in the question is the wrong frame. The real choice is who
owns the roster and where its maintenance rides. A roster maintained out of band is viable —
it bounds the set and makes the project explicit — but it needs a maintenance surface, and
ticket 06 bars interactive controls on team-facing surfaces, so maintenance becomes either
parsed channel text with shared-mutable-state contention or an editing page, which is the
hosted deployable ticket 01 priced as expensive. It has no forcing function, so it goes stale
in both directions: dead items accumulate as unknown rows, and real work never gets added and
is invisible.

**`nxs-architect`** — Whichever source wins, identity needs a key. A normalized URL a person
pasted is an exact deterministic key that costs nothing, needs no tracker integration and no
API read, and it must be scoped per team or one team's channel publishes another team's
person's words. Without a URL, the agent may propose a match and a human confirms it; it must
never merge on similarity, because a duplicate is visible and cheap while a false merge is
invisible and puts one person's verbatim words under another person's item.

**`nxs-architect`** — Lifecycle status must change only on a human declaration, never on a
timer, or silence becomes inferred progress. Render-time derivation runs on stored timestamps,
stored enums and playbook numbers only — no text comparison and no model turn — which is what
ticket 04's deterministic assembly requires. The person-to-items traversal is load-bearing
either way: the check-in composer walks it daily. The invariant that protects it belongs in
`agent-conduct.md` before the traversal ships.

## Superseded resolution — recorded 2026-09-05, superseded 2026-09-06

This ticket asked which work items the view lists **when nothing outside Ripples enumerates a
project**. That premise was wrong. The lead states that a team's item set is a GitHub project —
each person's assigned sprint tasks — and that the team lead maintains it. The ruling below was
made against a condition that does not hold, so it is superseded in full by the resolution that
follows it. It is kept because two later tickets were decided on top of it and a reader needs to
see what they were reading.


- **Decided:** The team-wide view lists a roster the team declares and maintains. There is one
  roster per team destination, and it is the only source of the set.

    ```text
    Weekly post, #squad-delivery

      Ripples  Project roster, 31 items.
               31 listed of 31 active.

                 auth refactor - PROJ-412
                 "waiting on the security review"
                 Sam . 2 Sep

                 onboarding copy
                 Dana . no statement, asked twice

                 data migration
                 Lee . no statement, asked twice

                 <26 more rows>

      Set: the team declares the roster once and maintains it.
      Nothing enters or leaves through a check-in. A silent item
      stays on the roster as unknown until someone removes it.
    ```

  An item enters when a person in the channel adds it, naming it and its owner. It leaves when
  a person removes it. Both acts are typed text in the same channel the view lands in. Inbound
  text from a group destination is clause 3 of ticket 06's floor, so roster maintenance needs no
  capability that team surfacing is not already paying for, and it needs no button, no form and
  no page.

  This does not reopen what ticket 06 closed. Buttons, dialogs and forms stay banned on the team
  surface, and nothing in the channel may change what a row says — a statement is still the
  person's own, edited only in their 1:1. Adding and removing a roster item changes which items
  the view lists, and it is typed text, which the floor already carries.

  **A check-in never adds an item and never removes one.** A statement made in a 1:1 attaches to
  a roster item and fills that item's statement slot under ticket 03's rules. A statement about
  work that is not on the roster is recorded and used in that person's own conversation, and
  never reaches the team view.

  **Silence never removes anything.** An item nobody has spoken about stays on the roster and
  renders as unknown, with no date, until a person removes it. Every roster item is printed:
  the two counts ticket 02 mandates are equal, and their being equal is how a reader knows
  nothing was held back from the list.

  **Size is bounded at the door, not at render.** The roster carries a ceiling that is playbook
  data. An add that would take the roster past it is refused in the maintenance exchange, which
  says what has to come off first. Nothing is truncated at render and nothing is paged, so the
  view stays inside ticket 01's plain-message floor and the scheduled post stays the
  deterministic assembly ticket 04 requires.

  **The roster settles identity and the team boundary as a side effect.** A human names each
  item once, so two people describing the same work cannot produce two rows, and no similarity
  matching is needed anywhere in the system. An item belongs to the roster it was added to, so a
  person who works with two teams is never asked which team an item is for.

- **Why:** An item set that assembles itself from whatever people happened to mention is a set
  nobody owns and nobody can correct. The roster is a thing the team agrees on and can point at,
  and the act of agreeing is what makes the view's rows recognisable to the people reading them.
  The roster also removes the two hardest mechanical problems in the emergent design — one job
  named twice by two people, and deciding which team an item belongs to — by making a human name
  each item once, which is cheaper than any matching rule and is correct rather than probable.
  Silence not removing a row is ticket 02's unknown row carried through: the absence of a
  statement is a fact about the record, and dropping a row for silence would be Ripples deciding
  that work stopped mattering because nobody talked about it. Maintenance rides the channel's
  inbound text path because that path is already inside the capability floor; putting it on an
  editing page would buy the second hosted deployable for a job that a typed sentence does.

- **Refuted alternative:** A set that emerges from the 1:1 check-ins — an item joins when its
  owner names it at ticket 03's preview turn, leaves when they say done or dropped, and drops
  after two unanswered asks with one anonymous line reporting the drops. Both council
  perspectives argued for it, and its case is real: it needs no setup step, it is maintained by
  the person doing the work inside a conversation that already happens, and its size is bounded
  by what people are paying attention to rather than by an inventory that only grows. It lost on
  ownership. An emergent set enters an item on one person's passing mention, under a name nobody
  else recognises, and two people describing one job produce two rows that only a similarity
  match or a human correction can join — so the team reads a list it never agreed to. It also
  makes silence delete a row, which is the same inference ticket 02 refused when it ruled a
  silent item unknown rather than stalled.

- **Left open, and not this ticket's:** the roster has no forcing function. That is the whole of
  the refuted case and choosing the roster does not answer it — a roster can rot in two
  directions at once, accumulating items that finished months ago and missing work that started
  last week. What keeps it current is a decision of its own, and it is now precisely statable
  because the roster exists to be kept current.

- **Resolved by:** sameera on 2026-09-05

## Resolution

- **Decided:** The team-wide view lists a team's GitHub project, at its current sprint. Every
  item in that sprint is a row, whether or not anyone is assigned to it. Ripples reads the board
  and never writes to it.

    ```text
    Weekly post, #squad-delivery - synced from the sprint board

      Ripples  Sprint 24 board, 9 items.
               9 listed of 9 in the sprint.

                 auth refactor - #412
                 "waiting on the security review"
                 Sam . 2 Sep

                 onboarding copy - #418
                 Dana . no statement, asked twice

                 search reindex - #421
                 no assignee . nobody has been asked

                 <6 more rows>

    Every sprint item is a row. An item with no assignee has
    nobody to raise it with, so it prints as a row Ripples has
    never asked anyone about, and says so in place of a date.

    The two counts stay equal, which is how a reader knows the
    list held nothing back.
    ```

  **The set is the board's, and Ripples does not maintain it.** An item enters the view when it
  enters the sprint and leaves when it leaves the sprint. Nobody types an item into Ripples,
  nobody types one out, and no message to Ripples on any surface changes which items the view
  lists. The team lead changes the set by changing the board, in GitHub, where they already
  work.

  **A check-in still never changes the set.** A statement made in a 1:1 attaches to a sprint item
  and fills that item's statement slot under ticket 03's rules. A statement about work that is
  not in the sprint is recorded and used in that person's own conversation, and never reaches
  the team view. This clause survives the premise change unaltered, and it now costs nothing to
  hold, because there is no path by which a conversation could edit a board Ripples only reads.

  **Silence still never removes a row.** An item nobody has spoken about stays in the view and
  renders as unknown, with no date, for as long as it is in the sprint. Ticket 02's unknown row
  is unchanged.

  **An unassigned item is a row with an empty owner slot.** It carries the item and its number,
  no owner, no statement, and, in place of a date, the fact that nobody has been asked. This is
  one stated exception to ticket 04's rule that no row appears about a work item the agent has
  not already raised with its owner. The rule exists so the post is never the first notice of a
  problem to the person who owns it; an item with no assignee has no such person, so the rule
  protects nobody and blocks the row for no one's benefit. Sprint work nobody has picked up is
  frequently the work most likely to be in trouble, and it is the one class of item the 1:1
  loop cannot reach at all.

  **Both of ticket 02's counts are read from the board, and they are equal.** The count of items
  listed and the count of items in the sprint are the same number, because every sprint item is
  printed. Their being equal is how a reader knows nothing was held back.

  **The identity problem is gone rather than solved.** An item is a GitHub issue, so it has a
  number, a title and a URL that the platform already guarantees are unique. Two people
  describing one job cannot produce two rows, no similarity matching is needed anywhere, and
  ticket 02's requirement that a row carry a link to its work item is satisfied by the issue URL
  without anything being authored.

  **The size ceiling is gone with it.** A sprint is bounded by the team that planned it, so the
  view is bounded by an act that already happens. There is no ceiling to configure, no refusal
  to write, and still no truncation and no paging at render.

  **The sync is read-only, and write-back is deferred deliberately.** Ripples posts no comment,
  moves no status, changes no assignee and closes no issue. What a person declares lives in
  Ripples' own record and reaches the team through the weekly post. Writing a declared blocker
  back to the issue is a real option and is recorded as out of scope rather than dismissed: it
  is the agent acting on a person's behalf somewhere their whole company reads, which needs a
  consent rule of its own on top of ticket 03's.

- **Why:** The board is maintained because the team works off it, which is the forcing function
  a declared roster never had. Sprint planning already decides what the team is working on, so
  reading that decision costs the team nothing and asks them to keep no second list in step with
  the first. The superseded ruling had to invent a maintenance path, an identity rule, a size
  ceiling and a currency mechanism, and every one of those is a consequence of Ripples holding
  its own copy of a set the team already holds elsewhere.

  Reading rather than writing is what keeps that cheap. A read-only sync has one failure mode —
  the read fails and the view is stale or absent — and it can never damage the artifact the team
  plans against. It also keeps the conduct rule that the agent never acts on someone's behalf
  true by construction rather than by a policy someone has to enforce at each write site.

  Listing every sprint item rather than only the ones Ripples has asked about is what keeps the
  two counts honest. Ticket 02 put both counts above the list, and ticket 08's superseded ruling
  had already established that their being equal is the reader's proof that nothing was held
  back. A view that silently omits unassigned work teaches a reader that the list is a subset
  and gives them no way to know how large a subset, which is worse than a row saying plainly
  that nobody has been asked.

- **Refuted alternative:** Keep unassigned sprint items out of the list and name them on one
  line beside it, in the slot that already holds recurring blockers and items waiting on someone
  outside the team. It is the tidier option and it leaves ticket 04's raised-first rule standing
  with no exception at all, which is worth something — an exception written once tends to be
  cited later for cases it was not argued for. It lost because it makes the two counts differ as
  a matter of routine, and once a reader learns the list is a subset they have to read the counts
  to know what is missing every week, which is a cost paid on every post to avoid writing one
  exception down once.

- **Second refuted alternative:** Show unassigned items only as the gap between the two counts,
  naming none of them. It is the strictest reading of ticket 04 and the quietest post. It lost
  outright: it inverts what ticket 02 built the counts for, turning the proof that nothing was
  held back into the notice that something was, and it sends a reader to the board to find out
  what — which is the tool-switch the weekly post exists to remove.

- **What the premise change costs elsewhere:** ticket 09's claiming act was the first roster-add
  typed in the channel, and there is no such act any more. Its ruling that the first mention
  claims the channel stands; the sentence that does the claiming has to be something else, and
  that is recorded as an amendment on ticket 09. Ticket 09's reasoning that no team can hold a
  roster without a destination is also gone: a board exists before anyone mentions Ripples
  anywhere.

- **Left open, and not this ticket's:** which GitHub project and which iteration are a given
  team's, who names them, and what authority that takes now that the lead alone maintains the
  set. Also how Ripples knows which person a GitHub assignee is, so it can ask them in their
  1:1 — the board names a GitHub login and the check-in reaches a Teams user, and nothing
  connects the two. Also what the weekly post shows when the board cannot be read. All three are
  precisely statable now and each has its own ticket.

- **Resolved by:** sameera on 2026-09-06
