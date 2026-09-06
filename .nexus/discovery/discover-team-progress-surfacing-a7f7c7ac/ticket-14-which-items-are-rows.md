---
title: "Which project items are rows, when an item may be a draft, a pull request, or unreadable?"
type: council
status: open
blocked_by: none
surface: "a row in the team view"
claimed_by:
claimed_at:
---

## Question

Ticket 08 rules that every item in the current sprint is a row and that the two counts above the
list are therefore equal, which is how a reader knows nothing was held back. Three kinds of
project item make that hard to hold, and each needs a ruling. [inferred]

A **draft item** lives only on the board. It has no issue number, no URL and no repository, so it
cannot satisfy ticket 02's requirement that every row carry a link to its work item. Excluding it
breaks the equal counts; including it makes ticket 02's link optional; inventing a link to the
board sends a reader somewhere other than the item. [inferred]

A **pull request** is a sprint item with a number and a URL, but pull requests commonly carry an
author and no assignee. Under ticket 08 an item with no assignee is a row saying nobody has been
asked, so every pull request would print that way unless the author counts as the owner.
[inferred]

An **item the credential cannot read** is returned by the platform as a redacted entry: Ripples
knows it exists and cannot name it. Dropping it makes the counts lie; printing it means a row with
no title, no owner and no link. [inferred]

Decide each, and decide what the counts mean once they are decided. [inferred]

## Why it blocks

Every one of these bears on the invariant ticket 08 made the reader's proof that the list held
nothing back, and the first two change ticket 02's row shape. A stub for rendering the view
cannot be written while the row shape is unsettled.
