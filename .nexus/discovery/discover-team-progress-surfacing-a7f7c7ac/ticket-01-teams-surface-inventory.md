---
title: "Which Microsoft Teams surfaces can a self-hosted Ripples deployment reach a team through, and what does each cost to build, host and operate?"
type: research
status: open
blocked_by: none
claimed_by:
claimed_at:
---

## Question

For a Ripples instance a team deploys into its own AWS account, which Microsoft Teams
surfaces are actually reachable, and what does each one cost? [asked: "which interactions are purely conversational over Microsoft Teams"]

Cover at least: a proactive message into a channel, a proactive message into a group chat,
an Adaptive Card and the round trip when someone presses a button on it, a Teams tab, and a
message extension. For each one, record three things — what the deployer has to set up in
their own Microsoft tenant, what we have to build and run, and what the surface can and
cannot display.

The stack document says AWS ships no managed Teams adapter. Because of this, we host the
messaging endpoint ourselves, and it calls the agent runtime. Establish what that endpoint
already gives us for free, and what each further surface adds on top of it.

## Why it blocks

The question "which user interfaces need building" has no answer until the alternatives are
priced. A Teams tab is a web page we write, host and secure; a channel post is a message the
endpoint we already run can send. Calling both "a UI" hides the difference that matters to
teams deploying this in an afternoon.
