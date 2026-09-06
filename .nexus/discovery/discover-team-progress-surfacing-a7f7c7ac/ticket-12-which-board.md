---
title: "Which GitHub project and iteration is a team's, who names it, and with what authority?"
type: council
status: resolved
blocked_by: none
surface: "the board-configuration exchange"
claimed_by: sameera
claimed_at: 2026-09-06T04:35:00Z
---

## Question

Ripples reads a team's sprint from a GitHub project. Decide which project, which iteration counts
as current, who names them, and what authority naming them takes. [asked: "which GitHub project and which iteration are a given team's, who names them"]

Four things are open inside that. Where the project is named — a playbook value the lead edits
beside the cadence, or a typed sentence in the claimed channel the way ticket 09 handles the
destination. What "current sprint" resolves to, given that a GitHub project's iteration is a
field somebody has to have configured and a project may have none. Whether naming the board is
restricted to the team lead, now that the lead alone maintains the set, and how Ripples would
know who the lead is. And what credential reads the board, since a private repository needs one
and the deployment holds no GitHub identity today. [inferred]

Ticket 09's authorization conditional fires here. It ruled that moving the post destination needs
no authorization on the same terms ticket 08 gave roster maintenance, and that the destination
move would take whatever rule roster maintenance later gained. Roster maintenance has now moved
to the board, under GitHub's own permissions, so this ticket decides whether anything carries
back to the channel acts. [inferred]

Also decide the never-configured state. Ticket 07 already rules that a team with no destination
runs its check-ins, posts nothing, and says so in the preview every time it is shown. A team with
a destination and no board is a second unconfigured state, and it is now the one a team lands in
by doing nothing. [inferred]

## Why it blocks

Nothing about the team view can be built until Ripples can name the set it renders. This also
holds the whole of a team's setup path: ticket 09 decided which channel the post lands in, and
this decides the other half, which is the half without which there is nothing to post.

## Evidence

### Product perspective — `nxs-pm`

Recommended the typed sentence in the claimed channel, on four grounds. Verification needs a live
read and only the channel act supplies a human to hear the answer: a channel handle is verified
by the platform handing it over, but a project URL is verified only by calling GitHub and failing
in one of three specific ways, and under a file every one of those failures resolves to a log
line the self-hoster reads on Tuesday or an absent post on Monday. The act already exists with no
payload, since ticket 09's amendment left the claiming sentence needing to become something. It
fires at the moment of most knowledge, which is ticket 09's own phrase. And there is no
playbook-editing interface — the discovery already ruled one out — so a playbook-held board means
editing a file and getting it into a running container, with no confirmation anywhere.

Conceded that the playbook wins git's permission model as a free, reviewable, attributable
authorization answer, and a value that is diffable rather than living in state you have to ask
the agent about, and named that as the second-strongest case against its own position.

Refused a lead role outright. Every way of knowing who the lead is fails: a playbook value
recurses on who may edit it, the installer's identity is not reliably carried on a team-scope
install, Teams team-ownership is a directory read ticket 06 denies adapters by design, and a
GitHub org role needs the identity join that is ticket 11 and still open — so lead-only would
make this ticket depend on the one whose stated failure is Ripples asking one person about
another person's work. Ticket 04 already refused a lead role in the data model as the first crack
in work-anchored rather than people-anchored, and an authorization role needs the same
configuration surface. GitHub's own permissions already bound what is reachable, Ripples writes
nothing, and a wrong board renders a visibly wrong list that one act reverses.

Named a risk that authorization does not fix: naming a board makes Ripples start opening 1:1s
with that board's assignees, so a mis-named board means an agent contacting people who never
asked for it. The mitigation is what the first message to a newly reachable person says, which
belongs to ticket 11.

Refused any fallback when a project has no iteration field, because ticket 08 removed the size
ceiling on the ground that a sprint is bounded by the team that planned it — an unbounded backlog
brings back the ceiling, the refusal, and truncation or paging, which forces ticket 01's
expensive hosted path, and turns ticket 08's unassigned-item rule into hundreds of rows reading
that nobody has been asked. Noted that a Projects v2 saved view cannot substitute, because its
filter is exposed as an opaque string with no query that resolves a view to an item set.

On the credential: one GitHub App per deployment, created from a shipped manifest, installed with
read-only permissions. A per-person token is wrong here because the post's contents would depend
on whose token was used and a silently expiring one would change what the whole team sees. An App
over a fine-grained token on ticket 07's own reasoning about the Workflows webhook — a personal
token dies with its creator's account and recovery needs the original human to repeat the
original act unprompted. Recommended folding the GitHub permission list into ticket 07's
admin-request page so a reviewer gets one document covering both admin conversations.

Counted the setup path: four operator acts, two team acts, one per-person act. This ticket adds
exactly one — creating the App — and adds nothing on the team side. Judged the team-side count
close to the floor for a tool that reads a private board and posts to a private channel, and
placed the adoption problem in the operator acts, which are hours rather than a minute.

Named its own strongest counter as the iteration requirement rather than the naming surface.
Iterations are opt-in and most teams use a Status board, so the first thing Ripples does to the
first team that tries it may be to refuse. Every argument ticket 08 made for the board applies to
a Status column at least as well, and the bounded-size argument survives too, since a work-in-progress
column is smaller than a sprint. Held the iteration anyway, but as a deferral with a named
trigger: the first pilot team that has a project and declines to add an iteration field triggers
a status-column variant, which is one optional clause on a sentence that already exists.

### Architecture perspective — `nxs-architect`

Recommended the same typed sentence, and added that the reply must be a resolution receipt rather
than an acknowledgement — project title, which iteration field was found, the current iteration's
name and dates, the item count, the post schedule — which is the property ticket 09 bought by
stating the resolved day, hour and zone in words.

Specified the read. Projects v2 is GraphQL-only with no REST path. Three steps: resolve the
project by owner login and number, falling back from organization to user; enumerate the fields
and take the iteration field's configuration; then page the items. A repository-scoped projects
URL is a classic project, which is dead, and deserves its own refusal rather than a generic one,
because it is the most likely paste error. Resolve the iteration field by node id and never by
name, so a rename does not silently empty a team's view. Filtering is client-side — Projects v2
offers no server-side filter on field values — so Ripples pages every item in the project and
keeps the ones whose iteration matches, which is the real cost driver and the argument for a
snapshot.

Current sprint is the iteration whose start date through start-plus-duration contains today,
evaluated as a calendar date in the team's stored zone, which ticket 09 already holds. Never
store the resolved iteration: a stored id survives a rollover and silently publishes last sprint
for a week.

Ruled the degenerate cases. Two iteration fields is ambiguous and the receipt asks which. An
iteration field with none current is not a failure and not ticket 04's reserved silence, which
would falsely say the team has no active work — it is the reduced post with both counts at zero
and a line naming the gap and the next start date if one is configured. Overlapping iterations
get a stated deterministic tie-break rather than an error, because a deterministic pick beats the
daily read and the post refresh disagreeing. An item in no iteration is the backlog and is not a
row. A project spanning repositories is expected, and rows carry the repository label when the
sprint spans more than one.

Three item shapes threaten ticket 08's equal-counts invariant and each got a ruling. A draft
issue has no number, URL or repository, so it is a row with an empty link slot — excluding it
would break the invariant, and synthesising a link to the board teaches a reader that links are
unreliable. This makes ticket 02's per-row link optional, which is an amendment ticket 02 does not
know about. A pull request is a sprint item, but pull requests commonly have an author and no
assignee, so falling through to the unassigned row would spray it across the view; the author is
the owner, which reads the platform's own ownership field rather than inferring anything. An item
the credential cannot see returns redacted, and it is a row saying the item lives in a repository
Ripples cannot read — dropping it silently would make the counts lie, which ticket 08 refused
twice.

On the credential, disqualified a classic personal token on blast radius: the smallest scope that
reads a private board also grants push to every private repository its owner can reach. Judged a
fine-grained token the honest competitor, losing on expiry above all — it dies on a date,
silently, capped at a year and often lower by org policy, which is ticket 13's failure arriving
on a morning nobody chose, in a deployment with nobody watching. A GitHub App's private key does
not expire, its installation tokens rotate hourly and invisibly, it survives the person who made
it, it is revocable in one click by an org owner without touching the deployment, and its
permission list is a readable trust artifact. Rotation replaces one secret with no human
re-authorization. Zero write permissions makes ticket 08's read-only rule a property the
organisation can inspect in its own settings rather than a promise Ripples makes.

Flagged a standards deviation and argued it is correct. The runtime standard routes work-tracker
reads through an AgentCore Gateway target with credentials brokered by AgentCore Identity.
Gateway is a tool server for the model, and ticket 04 rules the scheduled post runs no model turn
while ticket 06 keeps the scheduled path away from Strands, the runtime and Bedrock entirely — so
routing this through Gateway either forces a model turn back into the post or makes the sweep an
MCP client of our own gateway for no gain. The standard's rationale is that Ripples acts on a
person's behalf against systems that already know who they are; this read is deployment-scoped
and read-only and acts on nobody's behalf. And Identity brokers OAuth and API keys, not a GitHub
App's key-signed assertion.

On the read schedule: rate limits are not a constraint at this scale and must not shape the
design. One board read per team per day into a snapshot, refreshed once immediately before the
post, with the unparameterised ask served from the snapshot and stating its read time. Four
reasons, none of them quota. It isolates failure, so the post's only failure mode is local. It
produces the read timestamp ticket 13 says the view has never carried. It keeps the ask inside a
conversational turn and un-abusable by anyone who fires it repeatedly. And the per-team due test
rides ticket 09's existing sweep with the same self-healing shape. The stated staleness contract
is that a check-in may ask about an item removed that morning, which self-corrects within a day
and is better than a check-in that fails because GitHub is down.

Placed everything above ticket 06's seam: GitHub is not a conversational platform, so the adapter
interface is the wrong home, and an adapter holding a GitHub client could publish rows the agent
never composed, which is what ticket 06 made unrepresentable. The snapshot is the design's first
cache of a remote system and must be ruled separable from the execution record's persistence on
ticket 04's grounds, or it drags that decision inside the destination.

Raised the contradiction between ticket 07 and ticket 08 as a blocker: ticket 07 says the
unconfigured state runs check-ins and accumulates the record, which was true of a roster the
check-in did not need and is false of a board the check-in reads its questions from.

Named its own strongest counter as the playbook. After this ruling Ripples holds three per-team
values arriving through three different doors — a channel handle derived from a platform
activity, cadence and hour from a file a human edits, and a project URL from a chat sentence — so
a team debugging a wrong post has to know all three. The sharpest form: the board reference is the
only per-team value with a data-access consequence, deciding which private repository data
Ripples reads and republishes into a channel, and making that an unauthenticated channel act
authorized only by after-the-fact visibility is a real weakness. A playbook edit is a reviewable
act by whoever operates the deployment, which is an actual authorization model where a receipt is
not.

## Resolution

- **Decided:** A team's board is a value in that team's playbook, beside the cadence. Nobody
  types a board into Ripples. Ripples resolves the value, and announces what it resolved to in
  the channel the team has claimed.

    ```text
    The board is a value in the playbook, beside the cadence.

      team-playbook.yml

        post:
          cadence: weekly
          day: monday
          hour: 16
          zone: Europe/Dublin
        board:
          project: https://github.com/orgs/acme/projects/7
          iteration_field: Sprint

    On load, Ripples resolves it and announces the result in
    the claimed channel, so the value is still confirmed to a
    room rather than only to a log.

      Ripples  Reading "Delivery" - acme/projects/7, iteration
               field "Sprint". Current: Sprint 24, 9 items.

    A bad value fails on load, into the same channel:

      Ripples  The board named in this team's playbook cannot be
               read: acme/projects/7 has no iteration field.

    Nobody types a board into Ripples. Changing it is a config
    change, by whoever operates the deployment.
    ```

  **The announcement is not optional, and it is what makes the file safe.** Both perspectives
  refused the playbook on one ground: a value nobody verifies fails into a log the self-hoster
  reads on Tuesday. The ruling takes their objection and answers it rather than accepting it. A
  resolved board is announced into the claimed channel, naming the project, the iteration field
  taken, the current iteration and its dates, and the item count. A board that cannot be resolved
  is announced there too, with the specific reason and its remedy. A wrong value is then visible
  to the squad within one load, which is the property the typed sentence was going to buy.

  **The authority is whoever operates the deployment.** The playbook is a file in the deployment's
  own configuration, so changing a board is a change to the deployment, made by the person who
  runs it, reviewable and attributable by whatever process they already apply to it. No lead role
  is invented, no person-scoped configuration surface is added, and ticket 04's refusal of a lead
  in the data model stands untouched.

  **Ticket 09's authorization conditional is closed, and nothing carries back.** It asked whether
  an authorization rule on the item set carries to claiming or moving a channel. It does not. The
  set lives on a board under GitHub's permissions, the board reference lives in a file under the
  deployment's, and neither has anything to say about a channel. Claiming and moving a destination
  stay unauthorized: any member of the channel, announced in the room, exactly as ticket 09 ruled.

  **The welcome message's missing sentence is a bare mention.** Ticket 09's amendment left the
  welcome with nothing to teach, because the roster add that used to claim a channel no longer
  exists and, under this ruling, no board sentence replaces it. Ticket 09's own rule already
  suffices: the first mention of Ripples in a channel claims that channel. The welcome asks for a
  mention and nothing more.

  **The current sprint is derived on every read and never stored.** It is the iteration whose
  start date through start-plus-duration contains today, as a calendar date in the team's stored
  zone, which ticket 09 already holds. A stored iteration id survives a rollover and publishes
  last sprint for a week. The iteration field is referenced by its stable identifier rather than
  its name, so renaming it does not empty a team's view.

  **A project with no iteration field is refused, and the refusal is announced rather than worked
  around.** Ripples does not fall back to every open item in the project. Ticket 08 dissolved the
  size ceiling on the ground that a sprint is bounded by the team that planned it, and an
  unbounded backlog brings back the ceiling, the refusal message, and truncation or paging, which
  forces the hosted deployable ticket 01 priced as the expensive path. The reference is kept and
  marked unusable, so the state clears itself on the day someone adds the field, with no second
  act from anyone.

  **An iteration field with nothing current is not a failure.** It is ticket 04's reduced post,
  both counts at zero, one line saying no iteration is current and when the next one starts if
  one is configured. It is deliberately not ticket 04's reserved silence, which means the team has
  no active work and would be false here.

  **One deployment-scoped GitHub App reads every board, with no write permission of any kind.**
  Read-only on projects, issues, pull requests and metadata; the key held in the deployment's own
  secret store and read by the runtime's role, never an environment variable. A personal token is
  refused twice over: the classic kind cannot be scoped to read a private board without also
  granting push to every private repository its owner can reach, and the fine-grained kind dies on
  a date, silently, in a deployment nobody is watching. An App's key does not expire, its tokens
  rotate hourly, it survives the person who created it, an org owner revokes it in one act without
  touching the deployment, and its permission list is a readable artifact that makes ticket 08's
  read-only rule inspectable in GitHub's own settings rather than a promise Ripples makes. The
  request to install it belongs on ticket 07's admin-request page, so the two admin conversations
  are one document.

  **The board is read once per team per day into a snapshot, refreshed once immediately before the
  post.** The check-in composer and the unparameterised ask both read the snapshot, and the ask
  states when it was taken. This is not a rate-limit measure — the quota is not close to binding.
  It keeps the post a local assembly with no remote dependency at the minute it fires, which is
  what ticket 04's deterministic-assembly rule needs; it keeps the ask inside a conversational
  turn and un-abusable; and it produces the read timestamp ticket 13 observed the view has never
  carried. The read rides ticket 09's existing sweep as a second per-team due test, with the same
  self-healing shape. The accepted cost is that a check-in may ask about an item removed from the
  sprint that morning, which corrects itself within a day.

  **A team with a playbook but no board is dormant, and says so once.** No board means no item
  set, no item set means the check-in has no first question, so nothing runs for that team at all.
  Ripples announces that once in the claimed channel, says it is the last message, and then stays
  silent however long it stays installed. The durable signal after that is the operator's, because
  the operator is the only party who can act on an abandoned deployment. This is a different state
  from ticket 07's and it needs its own mechanism, because ticket 07's degradation announces
  itself in the 1:1 preview turn and here there is no 1:1.

  **The board read sits above ticket 06's seam, in the agent.** GitHub is not a conversational
  platform, so the adapter interface is the wrong home for it, and an adapter holding a board
  client could publish rows the agent never composed — which is the thing ticket 06 made
  unrepresentable when it gave adapters no record access.

  **The snapshot is separable from the persistence question this discovery placed beyond its
  destination**, on the grounds ticket 04 used for the conversation registry: one small document
  per team, replaced whole once a day, read by one query, sharing none of the execution record's
  shapes.

- **Why:** The two perspectives refused the playbook for one reason and it is answerable. Their
  case was that a file fails silently — nobody is standing there when the value is wrong, so a bad
  board resolves to a log entry or an absent post. Announcing the resolution into the claimed
  channel removes that, and it removes it more thoroughly than the typed sentence did: the
  sentence tells the one person who typed it, and the announcement tells the squad. Every
  remaining argument then favours the file.

  The board is the only per-team value that decides which private repository data Ripples reads
  and republishes into a channel. The architecture perspective named that as the sharpest case
  against its own recommendation, and it is decisive. A typed sentence makes that an
  unauthenticated act by any channel member, authorized only by being visible afterwards. A file
  makes it a change to the deployment by the person who runs the deployment. That is a real
  authorization model rather than a receipt, and it is the one the open-source trust story already
  rests on: a team that cannot read the rule cannot audit the judgment.

  It also stops the configuration scattering. Cadence, day, hour and zone are already playbook
  values; putting the board beside them means a human-authored value lives in one place a human
  edits, and the only value not in that file is the channel handle, which ticket 09 established
  no human can author or verify. The alternative left three per-team values arriving through three
  different doors, which the architecture perspective identified as the debugging cost.

  The reload objection is real and it is smaller than it looks. A board changes when a team starts
  a new project, which is rare, and the change is one line in a file the deployment already reads
  for cadence. Weighed against a data-access decision made by whoever types first in a channel, a
  configuration change is the right shape of act.

- **Refuted alternative:** One typed sentence in the claimed channel, naming the board and
  claiming the channel in a single act, with a resolution receipt echoed back. Both perspectives
  recommended it and its case is strong. It verifies at the moment of most knowledge, with a human
  standing there to read the refusal and fix it. It reuses an act ticket 09 already requires, so
  it costs the team nothing. It needs no file edit and no reload, which matters for a self-hosted
  tool whose adoption is decided by time to first value. And a project URL is a string a human can
  author, which is the exact condition that killed the playbook for the channel handle in ticket
  09 — so that precedent does not carry.

  It lost on what naming a board does. Naming one starts Ripples reading a private board and
  republishing its contents into a channel, and it starts Ripples opening 1:1 conversations with
  that board's assignees — the product perspective named that second effect as a risk its own
  recommendation could not mitigate, because the mitigation is not a gate on who types but what
  the first message to a newly reachable person says. An act with those consequences should not be
  available to anyone who can type in a room, protected only by an announcement after it has
  happened. The verification advantage that made the sentence attractive is separable from the
  sentence, and this ruling takes it: the announcement lands in the channel either way.

- **Second refuted alternative:** Restrict naming the board to a team lead. Refused on ticket 04's
  own reasoning, which rejected lead-addressed delivery partly because a lead role is a
  person-scoped routing concept needing a configuration surface, and called that the first crack
  in work-anchored rather than people-anchored. Every way of learning who the lead is fails or
  costs too much: the installer's identity is not reliably carried, a directory read is denied to
  adapters by design, and a GitHub org role needs the identity join that is still open on ticket
  11. Under this ruling the question dissolves anyway — the playbook's editor is whoever operates
  the deployment, and that needs no role in the record.

- **A deferral with a named trigger, not an omission:** the iteration requirement may be a wall in
  the wrong place. Iterations are opt-in, and most teams run a status board. Every argument ticket
  08 made for reading the board applies to a work-in-progress column at least as well, and the
  bounded-size argument survives, because such a column is smaller than a sprint. The requirement
  stands for now, because two modes before any pilot is the wrong bet and the refusal is loud
  rather than silent. The first team that has a project and declines to add an iteration field
  triggers a status-column variant, which is one more optional key beside `iteration_field`.

- **Amendments this ruling owes, each recorded where it lands:** ticket 07's clause that check-ins
  run in the unconfigured state is scoped to a team that has a board and no destination — a team
  with no board runs nothing, which the lead has ruled. The runtime standard's rule that
  work-tracker reads go through an AgentCore Gateway target with Identity-brokered credentials
  gains a carve-out for a deployment-scoped read-only read on the path that runs no model turn.
  Both travel onto the stubs at graduation, alongside the conduct amendment ticket 03 already
  queued.

- **Left open, and not this ticket's:** which project items are rows, now that an item may be a
  draft with no number or link, a pull request with an author and no assignee, or an item in a
  repository the credential cannot see. All three bear on ticket 08's equal-counts invariant and
  on ticket 02's requirement that every row carry a link, and they are precisely statable, so they
  have a ticket of their own.

- **Resolved by:** sameera on 2026-09-06
