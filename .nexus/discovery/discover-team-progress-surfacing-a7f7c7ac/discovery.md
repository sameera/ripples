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

## Not yet specified

- What "the project" is whose progress gets surfaced. The team-level view needs a set of
  work items to draw from, and Ripples has no work-tracker integration to provide one. This
  cannot be stated as a precise question until the content ruling says whether the view is
  a list of stalled items, which needs no boundary, or a progress summary, which does.
  [inferred]
- Whether a hosted page, if one is built, needs an identity and authorisation model of its
  own or can rely on the host platform's single sign-on. Nothing to state until it is known
  whether a hosted page exists. [inferred]
- What local time a scheduled team-wide post fires at. EventBridge Scheduler runs on UTC
  cron and the handler computes local time. This is a real question, but only if the
  delivery ruling picks a scheduled push. [inferred]

## Out of scope

- The individual daily check-in conversation and how its questions are generated. [inferred]
- The internal logic of the intervention ladder, including when Ask becomes Connect and when
  Connect becomes Escalate. [inferred]
- The persistence choice for the execution record. It is open in the stack document and is
  a decision of its own. [inferred]
- Work-tracker integrations with Jira, Linear or GitHub Issues as sources for the team-level
  view. [inferred]
- Building a second conversational platform. Microsoft Teams is the first surface and the
  only one this discovery prices. What is not out of scope is portability: every ruling here
  must leave a second platform addable as an adapter rather than a redesign, which is its own
  ticket. [asked: "Teams is only the first surface for this"]
- A user interface for editing playbooks. [inferred]
- A public marketing site. [inferred]
