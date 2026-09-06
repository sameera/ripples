---
title: "When a person's 1:1 statement is about work that is not in the sprint, does Ripples say so?"
type: council
status: open
blocked_by: none
surface: "the preview turn's negative case"
claimed_by: sameera
claimed_at: 2026-09-06T03:33:45Z
---

## Question

A person talks in their check-in about work that is not in the team's sprint. Ticket 08 rules
that the statement is recorded, used in that person's own conversation, and never reaches the
team view. Does Ripples tell them that, or does it stay quiet? [inferred]

Ticket 03 already promises a person sees the exact row before it posts. The question is what the
preview says when there is no row — whether "nothing about that crosses to Monday's view"
is part of what Ripples already owes the person, or a remark about their work that nobody asked
for. If it does say something, the wording decides whether it reads as a service or as pressure
to get their work onto the board. [inferred]

## Superseded question — replaced 2026-09-06

This ticket was written as "what keeps the declared roster current, when nothing forces a person
to maintain it?" It existed because ticket 08's first ruling made a team declare and maintain its
own list of work items, and gave that list no forcing function. The lead then corrected ticket
08's premise: the item set is a GitHub project, at each person's assigned sprint tasks, maintained
by the team lead. A sprint board is kept current because the team plans and works off it, so the
rot this ticket was written about is not Ripples' to fix. Two parts of the original question do
survive the change, and they went to different places. Work that is not on the board at all is
still invisible to the team view, and that is the question above. A team that never finishes
setup is now a team with no board configured, which belongs to the ticket that decides which
board is a team's.

## Why it blocks

The preview turn is a surface, and this decides what it says in a case that will happen most days
for most people. Saying nothing is a decision too, and it is the one that leaves a person to
discover on Monday that a week of work is absent from the view their team reads.

## Evidence

> The two council perspectives below were gathered against the superseded question — a roster the
> team declares and Ripples has to keep current. Read them with that in mind. What still applies
> is the argument over whether Ripples should volunteer that work is off the list, which is the
> question this ticket now asks, and the two answers to it are set out in full.


### Product perspective — `nxs-pm`

The two directions of rot are not symmetric, so they do not share a mechanism. A stale item is
visible rot: it prints every week as an unknown row, a reader can see it, and the fix is one
typed sentence. What is missing is a prompt at the moment of reading. A missing item is
invisible rot: nobody can read an absence, and the only place in the system where Ripples ever
learns that unrostered work exists is the 1:1 check-in. Say nothing there and the second
direction has no detection path anywhere, ever.

Neither costs a message. A line in the weekly post is a conditional block inside a post that
already ships and addresses nobody. A turn inside the check-in is an extra turn in an exchange
the agent already opened, which ticket 03 established is free. The scarce currency is turns in
the check-in, because answering in under a minute is what the reply rate rests on.

Recommended: a currency line at the foot of the weekly post, plus a turn in the check-in when
someone talks about work that is not on the roster. Five rules make the post line safe. It asks
a bookkeeping question and never a progress one — "is this still live", never "why has this not
moved". It excludes withheld and backed-off items, because ticket 03 made those render
identically and a line that swept them in would become a way to read back-offs. Its threshold
is a playbook day count rather than a post count, since a team on daily cadence would fire it
in three days. It does not appear when nothing qualifies. And it names items, never owners:
the owner names are already in the rows above, and collecting them into a list is what would
make it a naughty list.

The off-roster turn carries a load-bearing last line — that Ripples will keep asking about the
work either way. Without it the turn reads as "publish this or I forget you", which manufactures
the publish-everything pressure ticket 03 spent its ruling avoiding. Its frequency guard is one
mention per person per playbook window, deliberately per person rather than per item: an
unrostered mention has no identity, and a per-item guard would smuggle back the matching
ticket 08 removed from the system.

A separate 1:1 turn about a person's own long-silent items is refused twice over. It duplicates
the check-in, because asking someone about their silent item is the check-in. And it puts the
ask in the wrong room: the remedy is a channel act, so a private ask produces homework the
person has to carry to another surface.

The never-started roster is a different answer and not close. It is not rot; it is a failed
installation with a silent signature. No channel claimed means no roster, no roster means the
check-in has nothing to ask anybody, so the 1:1 loop never starts either — the install returned
success and the product is dead with no error anywhere. None of the rot mechanisms can reach
it, because they all ride a surface that does not exist yet. Recommended: two reminders into
the install conversation, the second announcing that it is the last, then permanent silence.
A reminder sequence that announces its own end is the only version that is not the bot that
pings you until you answer. A team that claimed a channel and later emptied its roster must
never restart them; it has demonstrably used the thing.

Costs. The post line is near zero directly, with one real indirect risk: collecting the
longest-silent items into a highlighted list reads as public pressure in a way that thirty
scattered rows do not, and that decay is invisible in the data. The off-roster turn is the
expensive one — it lengthens the check-in on the exact axis the product sells, and its worst
reading is that work is not real until it is on the team roster. That is where a back-off is
most likely. The never-started reminders cost the north-star metric nothing, because nobody is
answering anything yet.

What would falsify each: roster removals within seven days of a post that carried the line
versus one that did not; roster adds within 48 hours of a check-in that carried the turn; and
the reply rate on the next check-in after one that carried the turn, which is the closest
available proxy for the invisible decay and should be a launch gate.

The strongest case against: doing nothing is stronger than it looks. Thirty-one unknown rows
every week is not a subtle signal, so a line saying some of these look dead tells a team what
they can already see. Nobody has ever let a Ripples roster rot, so the decay curve is
hypothesised and the fix is paid for in the most metric-sensitive conversation in the product.
A bookkeeping nudge is still a nudge, and it is worse than a work nudge because what it wants
is admin. A defensible smaller position is the post line and the never-started reminders now,
with the off-roster turn deferred until a pilot — stated as a deferral with a trigger rather
than left as an omission.

### Architecture perspective — `nxs-architect`

Everything Ripples does here rides a surface that already exists, and the primary mechanism is
not a new message at all: the check-in's standing question about an item changes shape. When an
item crosses a playbook threshold of consecutive asks that produced no declaration, the question
stops being "where are you on this" and becomes "is this still live, or is it finished". A
question is replaced, not added. It does not touch ticket 08, because the person's answer is a
statement rather than a roster edit: it fills the statement slot, crosses verbatim under ticket
03, and lands in ticket 02's mandatory what-moved section. The conduct standard already permits
reading the record to decide what to ask.

The weekly post still needs its line, because removal is a channel act and the prompt to remove
has to land where the remedy is typeable. It sits in the same slot as ticket 02's
recurring-blocker and external-wait lines and renders deterministically from stored counters and
playbook numbers, so ticket 04's no-model-turn assembly holds. The changed question makes the
row honest; the post line is what actually shortens the roster.

The off-roster case belongs in ticket 03's preview turn rather than as a volunteered notice.
The preview already promises a person sees the exact row before it posts; when a statement
attaches to no roster item, the preview says nothing crosses today and gives the sentence that
would put it on the roster. Ripples never volunteers that someone is discussing untracked work
— it reports what will and will not be published, which it already owes. Ticket 07 set the
precedent when it made the unconfigured state say so every time the preview is shown.

The fourth mechanism costs a string. Ticket 08 already bounds the roster at the door and already
requires the refusal to say what has to come off first; make that concrete by naming the
longest-unanswered items. It is the one moment in the system where somebody actively wants
something from the roster.

State. Almost all of it is already implied by resolved rulings: the per-item date of last
declaration, the per-item count of asks that produced no declaration — ticket 08's own drawing
prints "asked twice" — the statement-to-item attachment including its null case, the roster
count against the ceiling, the per-team post marker, and the playbook slots. New state is one
sticky per-team flag for whether a roster item has ever existed, and one per-team marker for a
sent never-started reminder. The weekly line needs no marker at all: it is a recomputed property
of current roster state, like every other row in the post, which is why it is idempotent for
free.

A volunteered off-roster notice needs one thing it cannot have. Detection is not the matching
ticket 08 refused — that was item-to-item similarity, and statement-to-item attribution is
already load-bearing in ticket 03, so marginal detection cost is zero. The cost is idempotency.
Someone working on untracked work mentions it every day, and the suppression key would have to
identify a topic that has no identity by construction, which is the refused matching arrived at
from the other side. A per-person window dodges the key at the price of a message too vague to
act on. Both costs vanish in the preview form, which fires once per exchange by construction.

The never-started state is a different mechanism on all three axes. It cannot use the post,
because ticket 04 reserves silence for a team with no active items, so a line inside a message
that is never sent reaches nobody. It fires on ticket 09's existing sweep as a second per-team
due test — the registry row exists, no roster item has ever been added, the row is older than a
playbook grace period, and no reminder marker exists — with the same self-healing shape as the
post due test. It lands in the install conversation, which is the only conversation that exists,
and it is outside the message budget on ticket 09's own grounds. Recommended: exactly one
reminder, then stop. A recurring reminder into a channel nobody claimed is the anti-goal aimed
at a room with no evidence anyone is in it. The case for zero is close, because the welcome is a
durable artifact still sitting there; one is taken because the re-surface rather than the
content is the value. The durable signal belongs to the operator, who is the only party that can
act on an abandoned install.

Failure modes. The threshold must count unanswered asks rather than elapsed days, and this is
decisive three times over. A backed-off item is never asked about, so its counter cannot
advance, so it can never be named in the channel — an elapsed-days threshold would publicly mark
a back-off and reverse ticket 03's guarantee that a backed-off row and a withheld row look
identical. A company shutdown under an elapsed-days rule produces a first-post-back naming the
whole roster, which is the whole-team-goes-unknown shape ticket 02 already flagged as the point
where a reader assembles a person-level fact. And a brand-new team is free, because a fresh
roster has zero asks against every item. Separately, the counter must treat a withheld
declaration as a declaration and reset — a person answering every day and withholding every day
must never be told their item looks abandoned. The one hole is an orphaned item whose owner left
or never checks in: no asks means no counter growth, so it needs a second clause on a calendar
span that explicitly excludes backed-off items.

The strongest case against: the post line is a report about Ripples' own housekeeping addressed
to a room, and the README's first principle is act rather than report. A separate 1:1 turn is
strong for exactly the reason it was refused — it names one person, about one item they own, at
a moment they are already talking, which is Ask, and Ask is the product. The honest position is
that the changed question is the Ask and simply declines to spend a second message on it, and
that the post line exists only because removal is a channel-scoped act an individual cannot
perform from a 1:1. If telemetry shows the line ignored while the changed question is answered,
the escalation to a dedicated turn is the right move.

One dependency on out-of-scope ground: the changed question assumes the check-in composer asks
about every roster item its owner holds. Whether it enumerates or samples is undecided and
belongs to the check-in conversation, which this discovery placed beyond its destination. If it
samples, an item can be long-unanswered because it was never picked, and the signal measures the
composer rather than the team.
