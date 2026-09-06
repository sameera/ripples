---
title: "How does Ripples know which person a sprint item's assignee is?"
type: council
status: resolved
blocked_by: none
surface: "the identity-link exchange"
claimed_by: sameera
claimed_at: 2026-09-06T05:05:00Z
---

## Question

A row in the team view names a work item and its owner, and the 1:1 check-in asks that owner
about it. The board gives an assignee as a GitHub login. The check-in reaches a person as a
Microsoft Teams user. Nothing joins the two. Decide what does. [asked: "the board names a GitHub login and the check-in reaches a Teams user"]

The candidates are: a mapping the team lead authors beside the board configuration; a
one-question exchange in a person's own 1:1 that asks for their GitHub login the first time an
item is assigned to them; matching on the email address each platform holds, where both are
readable; or a directory read against the tenant. Each has a different failure when it is wrong,
and being wrong means asking the wrong person about someone else's work. [inferred]

Also decide what the view and the check-in do for an assignee nobody can resolve. Ticket 08 rules
that an unassigned item is a row nobody has been asked about; an item assigned to a login Ripples
cannot place is a different state, because a person exists and Ripples cannot reach them.
[inferred]

## Why it blocks

This is the join between the team surface and the 1:1 loop, and the whole product sits on it.
Until it is decided, no stub can say who the check-in asks, and the team view cannot say whose
row is whose. Getting it wrong is not a degraded view — it is Ripples asking one person about
another person's work, which is the failure the conduct standard's work-anchored rule exists to
make impossible.

## Evidence

### Product perspective — `nxs-pm`

Recommended a login-to-work-email map in the team's playbook, nested under the board, resolved
against the Teams team roster. Argued that the mechanism matters less than the receipt: all four
candidates produce a join that is silently wrong in the same way, and what makes a wrong join loud
is that the person it names hears about it before any work question arrives and can break it with
one word. Get that right and the choice collapses to authoring cost and permission cost, where the
playbook wins. Called this ticket 12's move applied one level down — a value in the file, made safe
by an announcement — except that here the announcement has a second audience, the person, and the
person's copy carries the veto.

Chose email rather than a Teams identifier as the value a human types, on ticket 09's own test: a
work email is the one key a human can author and a machine can verify, and both halves fail loudly
at load. The roster read runs on the bot credential the messaging endpoint already holds, with no
directory read and no admin consent.

Insisted on a sentinel for a login that is nobody in the team — contractors, service accounts,
people from other organisations. Without a way to mark them settled, the steady state of every
deployment is a permanent unresolved banner, and an operator who learns to ignore the banner is
worse off than one who never had it.

Stated the precedence rule as the load-bearing one: the playbook is the only thing that can create
a join, and a person's 1:1 can only break one. A claim redirects contact and can name someone else;
a refusal only reduces contact and can only name yourself. Refusals are self-service, claims are
not — the same reasoning ticket 12 used to keep the board out of a typed channel sentence.

Specified first contact as one message, before any check-in, in the person's own 1:1, naming the
login, where the login came from, what will happen, where it becomes visible, and two refusals. It
asks nothing about work. Three details it called non-optional: the message is anchored to the work
item that made the person reachable, because the conduct standard attaches every action to a work
item and an unanchored greeting would be the first thing in the design needing an exception;
exactly one per person per deployment, ever, never re-sent on a config reload; and the stop word
is the global back-off the conduct standard already has, made visible at the only moment it is a
genuine choice. Argued that anchoring also answers "why are you asking me this", and that the
one-day gap before check-ins begin is what makes the refusal real — a person who wants out is out
having answered nothing about their work.

On the unresolvable assignee, refused a log line and refused a separate operator surface: it is
Ripples' defect rather than the team's, and it must never read as a person's silence. Required
three states to stay distinguishable in the view — a statement, no assignee, and an assignee
Ripples cannot place — with the clause "so nobody has been asked" carrying the whole safety
property, because without it a reader sees a name, no statement and no date and concludes that
person went quiet. That is the person-level inference the data model exists to prevent,
manufactured by a configuration gap. The operator's copy rides ticket 12's load announcement,
which ticket 12 already made the operator's receipt.

Ranked the failure asymmetrically: a wrong join means one person is asked about work they do not
own, and the person who does own it is never asked and has no way to find out why. The second half
is the expensive one because it is silent by default in every candidate.

Refused self-claim as the primary path on circularity — to ask a person for their login you must
already know which person to open a 1:1 with, and the non-circular version messages every team
member including those with no sprint items, which is an unsolicited message about no work item.
Refused email matching on recall rather than precision: the GitHub half is usually unreadable, and
buying the permissions that would make it readable is a bad trade when ticket 12 made the App's
permission list a readable trust artifact. Refused a tenant directory read outright, because Entra
holds no GitHub login and the read costs the admin consent ticket 07 spent its ruling avoiding.

Named its own strongest counter as ticket 08's declared roster resurrected, this time as a list of
people. Three forms: a file mapping logins to work emails is a personnel list at rest in a product
whose compliance posture is built on having none; nobody works off the identity map, so unlike the
board it has no forcing function and rots in one direction permanently; and it is the first setup
act that scales with team size, requiring the operator to know every teammate's GitHub login, which
is the one fact each person knows for free about themselves. Offered a deferral with a trigger — an
invited claim, where Ripples posts the unplaced logins once in the channel and a person confirms
their own, with the confirmation announced back to the room so a wrong claim is loud to everyone
including the right person.

### Architecture perspective — `nxs-architect`

Recommended that a person declares their own login in their own 1:1, and that nothing else may
create a link — email, the roster and SAML identities may only propose one. Argued the rule
dissolves the candidate list rather than choosing from it, because the best evidence differs per
deployment: an enterprise organisation with single sign-on has a near-perfect signal and a small
free organisation has none, and both have to work.

Established the platform facts that bound the whole question. Under ticket 12's credential, a
project assignee returns a login, a display name and a node id; the profile email returns empty
when it is unset, which is the default, and commit addresses are no-reply aliases that resolve to
nothing. Organisation member read is an organisation permission that grants membership and teams
and no emails, so it buys this join nothing beyond what any readable project already shows. The one
real join on the GitHub side is the single-sign-on external-identity list, which returns each
member's login beside the identity provider's name and emails — the exact key the Teams side holds
— but it requires an enterprise organisation with single sign-on, which excludes every free and
team-tier organisation, and it needs organisation-owner rights. Marked as unverified whether a
GitHub App can reach it at all and under which permission. Refused it as a mechanism regardless,
because it would elevate the credential from a minimal read-only artifact to organisation
administration, contradicting ticket 12's argument that the permission list is a readable trust
artifact, and because it links without a human, so a stale identity mapping fails in the silent
misattribution shape.

On the Teams side: an inbound activity carries the directory object id, a display name and the
tenant, and no email. But the Bot Framework's own roster calls run on the bot's Connector
credential and return the object id, given and surname, email, and user principal name — no Graph
client, no admin consent, no second token, with the app installed where the roster is read, which
ticket 07 requires anyway. Marked guests and unlicensed accounts as medium confidence. Refused a
tenant-wide directory read as buying nothing the roster does not.

Read ticket 06's ban on adapter directory lookups as sited on the render path, where its stated
reason is at-mentions, and noted that the same ruling gives the adapter the mapping from a platform
identity to a stable person id — so a roster read on the identity path is that job. Asked for the
reading to be written down so a later reviewer does not have to re-derive it.

Refused email matching on the asymmetry: one side has an email and the other mostly does not, so
the match succeeds only for the minority with a public profile email equal to their directory
identity. Listed what breaks it even then — a user principal name that differs from the mail
attribute, aliases, personal accounts on a work board, guests carrying a home-tenant address,
multi-domain tenants after a merger. Called the disqualifying property not the miss rate but that a
similarity join which looks exact is confidently wrong and silent, citing ticket 08's own rule that
a duplicate is visible and cheap while a false merge is invisible.

Gave the playbook map a fair hearing and refused it twice. Its case: it is the only candidate that
works before anyone installs, so the first weekly post is correct; it inherits ticket 12's authority
model for free; and unlike a channel handle it passes ticket 09's authorability test. It loses
because it creates a route from a board to a stranger's inbox, and because it asserts a fact about
a person that neither the operator nor GitHub can verify, failing in the plausible-and-silent shape
— someone answers about work they do not own, or says it is not theirs, and nothing notices. Added
that it rots on every joiner and leaver, maintained by someone outside the squad who frequently
does not know their colleagues' logins, which is the conscientious person who abandons it in week
three that ticket 08 refuted, moved from items to people.

On storage, split two joins that must not be conflated: platform identity to stable person id is
adapter-owned derived state and already ticket 06's, while person id to GitHub login is
agent-owned and belongs in the execution record. Argued ticket 09's authorability test does not
classify the second, because it is neither operator-authored configuration nor platform-derived
state but a declaration made at runtime by the person it concerns — the same category as a
statement. Ruled it must never live in AgentCore Memory, called that the most likely implementation
shortcut in the whole design, and required the link to carry a timestamp and its provenance so that
"why are you asking me this" has an answer. Required the link be keyed to the person rather than to
the platform identity, so a second platform does not orphan every link and a platform detail does
not leak above ticket 06's seam.

On cardinality: the join is per deployment rather than per team, because a login is not a
team-scoped fact and a person on two teams must not be asked twice or hold two links that can
disagree. Many logins to one person is allowed. One login to two people is refused as a uniqueness
rule rather than a warning, and the refusal must not name the other person, because that is
disclosure about someone who is not in the conversation. A bot account is not a person and prints
as such, producing no operator signal. A link whose Teams side stops resolving is marked
unreachable rather than deleted, because Ripples must not infer that someone has left from a failed
send.

Ruled four owner-slot states rather than two, and required the unresolvable row to print the login
verbatim as display text: the counts must stay equal, the login is already on a board every reader
can open so it discloses nothing new, and profile names are frequently absent. Called this a second
stated exception to ticket 04's raised-first rule and insisted it be written as one with its
boundary — the row carries no statement, no date, no progress and no inference, and every fact in
it was put on the board by the person's own assignment. Required the post's side line to be a count
and never a list of names, on ticket 10's grounds that collecting owners into a highlighted list is
what turns a bookkeeping line into a naughty list, and required the count be derived from the board
side rather than from the team's membership. Added that a board resolving to zero linked people
must not post at all, because the artifact would be a list of work items with every statement slot
empty, which is what ticket 07 called prohibited rather than merely poor.

Named its own strongest counter as the bootstrap, which it renamed rather than solved: day one is
nine items and zero links, and the resulting post is adjacent to the prohibited artifact. Answered
that the webhook's rows were about people who could never see or correct them while an unlinked row
is about a person who has not arrived yet, that it names itself and its remedy every week, and that
the zero case does not post — but conceded the residue, that a squad where two people never install
publishes two dark rows for its whole life with nothing escalating beyond a count.

## Resolution

- **Decided:** The join is authored by whoever operates the deployment, as a map from GitHub login
  to work email in the team's playbook, beside the board. Ripples resolves each email against the
  Teams team roster to reach a person. Nothing is used against a person until that person has been
  told, in their own 1:1, which login they were matched to — and that notice carries a refusal that
  works.

    ```text
    The operator authors the join in the team's playbook.

      team-playbook.yml

        board:
          project: https://github.com/orgs/acme/projects/7
          iteration_field: Sprint
          people:
            sam-ok:     sam.okelly@acme.com
            dcheng:     dana.cheng@acme.com
            vendor-svc: unreachable

      Before anything is asked, each person hears once:

        Ripples  This is not a check-in. Your team's Ripples
                 config maps the GitHub login "sam-ok" to you,
                 and #412 "auth refactor" is assigned to it.

                 From tomorrow I will ask you here, once a day,
                 about your items on that board. What you tell
                 me goes in the weekly post, in your own words,
                 and I show you the line first.

                 Not you? Reply "not me" and I stop.
                 Want none of this? Reply "stop".

    Day one works - the first weekly post has a real owner on
    every row. A wrong entry is caught by the person it names,
    but only after Ripples has messaged them.
    ```

  **Email is the value a human types, and it is the only key that passes both tests.** A directory
  identifier is not a string anyone can author or verify, which is ticket 09's test. A GitHub login
  cannot be resolved to an address by any credential ticket 12 grants: a profile email is unset by
  default, organisation member reads return no addresses, and commit addresses are no-reply
  aliases. A work email is authorable on one side and verifiable on the other, and both halves fail
  loudly when wrong — the login is on the board or it is not, and the address is in the team roster
  or it is not.

  **The roster read runs on the credential the messaging endpoint already holds.** It is the Bot
  Framework's own team-membership call, not a tenant directory read, so it needs no Graph client,
  no second token and no administrator consent. Ticket 06's refusal to give adapters a directory
  lookup is sited on the render path, where its reason is at-mentions; the same ruling makes the
  mapping from a platform identity to a stable person id the adapter's job, and this is that job.

  **A login that is nobody in this team is marked settled, not left dangling.** Boards carry
  contractors, service accounts, bots and people from other organisations who will never be in this
  Teams team. The map takes a sentinel for them. Without it the steady state of every deployment is
  a permanent unresolved notice, and an operator who learns to ignore that notice is worse off than
  one who never had it.

  **The person is resolved on every load and never stored.** A leaver's row turns unresolvable
  within a day rather than sending messages into a void, which is ticket 12's reasoning about the
  derived current sprint applied to people.

  **First contact is one message, before any check-in, and it is bounded by four rules.** It names
  the login, says where the login came from, says what will happen and where it becomes visible,
  and asks nothing about work. It is anchored to the work item that made the person reachable, so
  it needs no exception to the conduct rule that every action attaches to a work item, and so it
  answers "why are you asking me this" by construction. It is sent exactly once per person per
  deployment, ever — not per board, not per sprint, and never again on a configuration reload.
  And check-ins begin on the next cycle rather than in the same exchange, so a person who wants out
  is out having answered nothing about their own work.

  **A person's 1:1 can break a link and can never create one.** Creating a link redirects contact
  and can name somebody else; breaking one only ever reduces contact and can only name yourself.
  Refusals are self-service and claims are not. "Not me" breaks the link and is a reserved literal
  word matched in the agent before any model turn, on ticket 06's existing terms — if Ripples is
  asking somebody about another person's work, the fix cannot depend on a model parsing the
  objection correctly. The stop word is the global back-off the conduct standard already has, made
  visible at the one moment it is a real choice.

  **One login may never resolve to two people.** That is a uniqueness rule rather than a warning,
  and when it is violated the load announcement says the login is duplicated and names no person.
  Many logins to one person is allowed and costs nothing. A bot account is not a person: its row
  says so, and it raises nothing for the operator to fix.

  **An assignee Ripples cannot place is a row that says so about Ripples, not about the person.**
  It prints the login as plain display text, no statement, no date, and the clause that nobody has
  been asked. That clause carries the whole safety property: without it a reader sees a name, no
  statement and no date, and concludes that person went quiet — the person-level inference the data
  model exists to prevent, manufactured by a configuration gap. Both of ticket 08's counts stay
  equal, because no row is removed.

  **That row is the second stated exception to ticket 04's rule that no row appears about a work
  item the agent has not raised with its owner, and its boundary is written here.** The row carries
  no statement, no date, no progress and no inference, and every fact in it is already on the board,
  put there by the person's own assignment. The moment such a row would carry anything the person
  did not put on the board themselves, the exception has been exceeded.

  **The post's summary line is a count and never a list of names**, and the count is over
  unplaced assignees on the board rather than over people in the team who have not been mapped. The
  operator's copy rides ticket 12's load announcement into the claimed channel, which is already
  the operator's receipt.

  **A board on which no assignee resolves does not post at all.** It announces itself once in the
  claimed channel in ticket 12's dormant shape. The artifact it would otherwise publish is a list of
  work items and owners with every statement slot empty, which is what ticket 07 called prohibited
  rather than merely poor.

  **Ripples never builds a person index across teams.** A person on two boards has two entries in
  two playbooks, and Ripples never joins them. A cross-team person key is the person-scoped
  aggregate the data model exists to prevent, reached through the address book.

  **The link may never live in AgentCore Memory.** A semantic or summary memory record is the
  agent's recollection rather than a stated fact, which the conduct standard already prohibits from
  standing in for a declared answer. This is the most reachable implementation shortcut in the
  design and it is an invariant rather than a preference.

  **The playbook now holds work email addresses, and the first-contact message is what a deployer
  points at.** Lawful basis and the transparency notice are the deploying organisation's
  obligations; Ripples' contribution to satisfying them is a per-person notice at the moment of
  first processing, which is exactly what this ruling requires.

- **Why:** The two perspectives agreed on the failure and disagreed on where to stop it. The
  failure is Ripples asking one person about another person's work, and its expensive half is the
  quiet one: the person who does own the work is never asked and has no way to find out why. Every
  candidate is silently wrong in that same way, so the ruling buys the receipt rather than the
  mechanism. Once the person hears which login they were matched to before any work question
  arrives, a wrong join is loud within one message to the person best placed to catch it, and the
  unplaced row makes the other half visible in the channel every week.

  With the receipt in place, the mechanisms are separated only by authoring cost, permission cost
  and time to first value, and the operator-authored map wins all three. It needs no permission
  beyond what tickets 07 and 12 already buy. It is the only option whose first weekly post has a
  real owner on every row, which matters because the first post is what a pilot team judges the
  product on. And it puts the value in the file ticket 12 already chose for human-authored per-team
  configuration, rather than scattering configuration across a third door.

  The self-declared join's decisive argument — that an operator map builds a route from a board to
  a stranger's inbox — is answered rather than dismissed. The route exists, and what travels down
  it first is a message that asks nothing, explains itself, and offers two ways out. A person who
  never wanted this replies once and is gone, having disclosed nothing.

- **Refuted alternative:** The person declares their own login in their own 1:1, and nothing else
  may create a link. It is the strongest option on principle and the architecture perspective is
  right about why: Ripples would hold no route from a login to a Teams user until that person had
  already spoken to it, so a mis-named board could render a wrong list and still reach nobody new.
  It also matches the product's own shape, where progress is self-declared rather than inferred,
  and it is the only option that puts no list of who works with whom at rest anywhere.

  It lost on the bootstrap, which its own advocate conceded it renames rather than solves. Day one
  is a board of items and zero links, and the post it produces is a list of work items and owners
  with every statement slot empty — which is the artifact ticket 07 refused outright when it
  refused the webhook, not merely a poorer view. It recurs in miniature every time someone joins a
  squad, and a team where two people never link publishes two dark rows for its whole life with
  nothing escalating beyond a count. A product whose first impression is the shape it elsewhere
  calls prohibited does not get a second one.

- **Second refuted alternative:** The playbook proposes and the person confirms, with no entry used
  until its subject says yes. It is the careful middle and it keeps the operator's knowledge while
  preserving the rule that only a person creates a link. It lost to the same bootstrap in a milder
  form — the first post is still dark, and it is dark for exactly as long as it takes every person
  to reply — while costing a turn in the conversation ticket 10 identified as the most
  metric-sensitive in the product. Once first contact carries a working refusal, requiring a yes
  buys consent that the veto already provides, and pays for it in the one currency the product
  cannot spend freely.

- **Third refuted alternative:** Match on email address across the two platforms. It is dead on a
  platform fact rather than on judgment: a read-only GitHub App cannot see a user's email, profile
  addresses are unset by default, organisation member reads return none, and commit addresses are
  no-reply aliases. Buying the permissions that might change that would elevate the credential from
  the minimal read-only artifact ticket 12 made a trust argument out of, to organisation
  administration. It survives only as a way to rank a proposal, never to create a link, because a
  similarity join that looks exact is confidently wrong and silent — which is the rule ticket 08
  already applied to work items.

- **Fourth refuted alternative:** Read the tenant directory. It answers the half already available
  for free, since the directory maps an address to a person and the roster call does that on the
  bot's own credential, and it holds no GitHub login at all. It buys that nothing for the
  administrator consent ticket 07 spent its ruling avoiding.

- **A deferral with a named trigger:** the map has no forcing function and nobody works off it, so
  it rots in one direction — new joiners never added — and the operator must know every teammate's
  GitHub login, which is the one fact each person knows for free about themselves. The first
  deployment where an operator stalls on authoring or maintaining it triggers an invited claim:
  Ripples names the unplaced logins once in the claimed channel, a person confirms their own in
  their 1:1, and the confirmation is announced back to the channel so a wrong claim is loud to
  everyone including the right person. That announcement is what preserves the rule that a claim is
  not self-service, and it is one optional path on a mechanism that already exists.

- **Amendments this ruling owes:** the conduct standard gains the invariant that the identity map
  is an address and nothing more — it stores no work, no statement, no count and no history, it may
  be read only to route a message or to render an owner name, and no read path may return anything
  measured over a person. It travels beside the invariant ticket 02 already left open for the
  person-to-items traversal, and alongside the amendments tickets 03, 06 and 12 have queued.

- **Left open, and not this ticket's:** whether a bot can proactively open a 1:1 with a member of a
  team the app is installed into, without that member installing it personally. Both perspectives
  leaned on it and neither verified it, and it is load-bearing for first contact and for the whole
  1:1 loop. It is a verification step on the same twenty-minute pass ticket 09 and ticket 12 already
  named, not a decision. Also open: whether one deployment may serve more than one Microsoft
  tenant, which decides whether login uniqueness is per deployment or per tenant.

- **Resolved by:** sameera on 2026-09-06
