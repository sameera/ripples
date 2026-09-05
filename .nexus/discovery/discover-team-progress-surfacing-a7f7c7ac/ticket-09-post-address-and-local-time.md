---
title: "Which channel does a team's scheduled post land in, at what local hour, and who decides both?"
type: council
status: open
blocked_by: none
claimed_by:
claimed_at:
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
