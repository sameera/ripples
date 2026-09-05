---
title: "What may cross from a person's 1:1 check-in into a team-visible surface, and does that person see it first?"
type: interview
status: resolved
blocked_by: none
claimed_by: sameera
claimed_at: 2026-09-05T19:16:13Z
---

## Question

A person tells Ripples in a private chat that they are stuck. What part of that may appear
where their team can read it? May they see or approve it before it appears? [asked: "talk to users or team members on an individual basis and then needs to surface the overall project progress to the team as a whole"]

Three sub-rulings rest on this and all three need the same answer to be useful:

- Whether the team-visible form quotes what the person said, paraphrases it, or reduces it
  to the fact that an item has not moved.
- Whether the person previews it, can redact it, or only learns of it afterwards.
- Whether a back-off on a work item removes that item from team-visible surfaces, or only
  stops the agent messaging the person about it.

The conduct rules say every intervention is visible to the person it is about, and that
escalation is announced to the owner first. Neither rule covers a routine team-wide post,
which reaches the team without being an intervention at all.

## Why it blocks

The answer decides whether an approval step exists. An approval step is a surface someone
has to interact with, and possibly a thing to build. It also decides whether the check-in
conversation itself has to change, because a person who learns after the fact that their
answers get posted will stop answering. The sustained voluntary reply rate is the
north-star metric.

## Resolution

- **Decided:** What a person declares about a work item crosses to the team view by default, in
  their own words, and they see the exact row before it posts. Before the check-in exchange ends,
  the agent shows the row it intends to publish — the work item, the statement, its date — and the
  person can correct the wording or withhold the statement right there, in the conversation they
  are already in. There is no separate approval message and no approval sent later.

  The words that cross are the ones the person said. The agent may truncate mechanically; it may
  not re-word. A re-worded blocker is the agent's recollection rather than the person's statement,
  which the conduct standard already prohibits from standing in for a declared answer.

  A withheld statement leaves the row in place: work item, owner, date of the last declaration, and
  an empty statement slot. The item never disappears from the list. A reader can tell that row from
  an item Ripples has no statement about, because the unknown row carries no date at all.

  Backing off a work item stops the agent messaging the person about it **and** empties the
  statement slot, leaving the same row shape as a withholding. The last thing the person said stops
  being republished. A backed-off row and a withheld row render identically, so exercising either
  costs the person nothing in front of their team.

  The rule has a floor that is fixed product conduct and a layer above it that each team sets in a
  playbook. Fixed: a person can always read what the team reads about their work, and can always
  withhold or remove their own statement. Playbook data: whether statements cross by default,
  whether the preview is offered, and how far a back-off reaches. The floor has to be enforced in
  code — a floor that only the documentation states is configuration wearing a promise.

- **Why:** The check-in works because answering it is cheap, and the north-star metric is the
  sustained voluntary reply rate. The two ways to lose it are not symmetric. Publishing too much
  decays the metric silently, because a person who starts giving safe answers produces a record
  indistinguishable from a person giving real ones — the damage is invisible in the data and shows
  up last in the number. Publishing too little leaves a thin view, which is visible immediately and
  can be loosened later. So the ruling protects the conversation and accepts a poorer view, and it
  buys back the richness by showing the person the row instead of asking them to trust a policy
  they read once at onboarding.

  The preview sits inside the check-in because a preview sent separately is a second unprompted
  message about the same work item on the same day, which the message budget does not allow. Inside
  an exchange the person is already in, the agent can take as many turns as it needs — a reply
  within an open conversation is not unsolicited — so it can press past "developed and tested" and
  then show what it will publish.

  The row survives a withholding because a vanishing row is worse than a silent one. A view that
  drops rows teaches a lead to read the gaps, and a reader assembling a person-level judgment from
  what is missing is the surveillance the data model was shaped to prevent, arrived at from
  outside the schema. Keeping the row also stops one word from hiding a genuinely stalled item from
  the people who need to see it.

  Back-off empties the statement because a person who says stop and then watches their own words
  republished every morning has been told they may leave the conversation but not the record. That
  reading is the most likely trigger for a global back-off, and the back-off rate is the health
  measure that invalidates gains everywhere else. Rendering a backed-off row and a withheld row the
  same way keeps the escape hatch cheap: labelling either one makes using it a public act, and a
  public escape hatch stops being used.

- **Refuted alternative:** Publish by default and say so once at onboarding, with no preview and no
  per-statement affordance. It is the cheapest option — nothing to build — and it produces the
  richest view, which is what a lead asking about a project wants. It lost on the first surprise:
  someone reads their own words in a channel they did not expect them in, and the cost is a
  back-off plus the story their teammates then hear. Against that, the preview costs one closing
  turn in a conversation that is already multi-turn.

- **Left open, and not this ticket's:** the conduct standard's message budget says "unsolicited
  messages to one person, one work item — 1 per day", and does not say whether a reply inside an
  exchange the agent already opened counts against it. It does not: the agent opens one
  conversation per person per day and may take as many turns inside it as getting a real answer
  needs. The wording needs fixing in `agent-conduct.md`, and that standard is a document of its own,
  not this discovery's to edit.

- **Also not this ticket's:** the crossing rule has no home in the conduct standard yet. No existing
  rule covers a routine team-wide post, which reaches the team without being an intervention. The
  amendment travels onto the stubs at graduation.

- **Resolved by:** sameera on 2026-09-05
