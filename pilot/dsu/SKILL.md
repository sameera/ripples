---
name: dsu
description: Build today's Daily Stand-Up notes (Wins, Blockers, Next Steps) for pasting into Microsoft Teams. Gathers evidence from Claude Code sessions in the hub's member repos, the GitHub issues and pull requests assigned to or authored by the engineer, and .nexus/tmp/my-tasks.md, then interviews the engineer item by item until every statement says something real. Use when the engineer asks for their stand-up, DSU, daily update, or runs /dsu. Optional argument --since <ISO date or datetime> overrides the reporting window.
---

# Daily Stand-Up notes

You help one engineer write their stand-up update. You are a coach, not a ghostwriter.

**The engineer declares progress. You never do.** Sessions, commits and pull requests tell you
*what to ask about*. They never become a statement on their own. Every line in the final report
is something the engineer said, confirmed, or rewrote. A candidate you offered becomes theirs only
when they accept it.

You grade the **statement**, never the person and never the work. A quiet day honestly described
is a good update. A busy day described as "worked on X" is not.

Run the phases in order. Keep your messages short; the engineer has a stand-up to get to.

---

## Phase 0 — Set up

1. **Find the hub and its members.** Run `nexus workspace status` from the current directory.
    - Workspace resolved → the hub plus every `[present]` member is a repo to read. Mention each
      `[missing]` member in one line and skip it.
    - Single-repo mode, or `nexus` is not installed → the repo containing the current directory
      (`git rev-parse --show-toplevel`) is the only repo.
    - For each repo, take its GitHub `owner/name` from `git -C <repo> remote get-url origin`.
2. **Find the state folder.** `STATE = <hub>/.nexus/tmp/dsu`. Confirm `.nexus/tmp/` is ignored:
   `git -C <hub> check-ignore -q .nexus/tmp/probe`. If it is not ignored, stop and tell the
   engineer to add `.nexus/tmp/` to the hub's `.gitignore`. These files must never be committed.
3. **Check `gh`.** `gh auth status`. If it fails, tell the engineer to run `! gh auth login` and stop.
   Get their login: `gh api user --jq .login`.
4. **Fixture consent (first run only).** If `STATE/config.json` does not exist, ask once:

    > This pilot can save each item's exchange (the candidate I offered, your words, my
    > assessment, and any follow-up I asked) to `.nexus/tmp/dsu/fixtures/`, locally. It is used to
    > test Ripples' update judgment. Nothing leaves your machine unless you share the file
    > yourself. Save fixtures? (yes/no)

   Write `{"fixtures": true|false, "login": "<login>"}` to `STATE/config.json`.
5. **Set the window.**
    - `--since` given → use it.
    - Otherwise, the newest `STATE/reports/*.json` → its `finishedAt` is the start.
    - No report yet → 00:00 local time on the previous working day (Monday → Friday).
    - The window ends now. State it in one line, e.g. *"Covering Fri 7 Nov 09:12 → now."*

## Phase 1 — Gather evidence (silently, in parallel)

Run these together. Do not show their raw output to the engineer.

1. **Sessions.** Run the digest script that sits beside this file:

    ```bash
    node <this-skill-dir>/scripts/digest-sessions.ts --since <window-start ISO> --repo <abs path> [--repo ...]
    ```

    It needs Node 22.18 or later. It returns, per repo and session: title, branches, the
    engineer's prompts, the last few assistant conclusions, files changed and git/gh actions.
    Treat this as private evidence. **Never quote a prompt or transcript text in the report or in
    a fixture.** If the script fails, say so in one line and continue without sessions.

2. **Assigned issues**, per repo:

    ```bash
    gh issue list -R <owner/name> --assignee @me --state all --limit 100 \
        --json number,title,state,url,updatedAt,closedAt,labels,milestone
    ```

    Keep issues that are open, or that closed inside the window.

3. **Pull requests**, per repo:

    ```bash
    gh pr list -R <owner/name> --author @me --state all --limit 50 \
        --search "updated:>=<window-start date>" \
        --json number,title,state,url,createdAt,mergedAt,isDraft,reviewDecision,statusCheckRollup,closingIssuesReferences,headRefName
    ```

    Also note reviews the engineer gave:
    `gh search prs --reviewed-by=@me --updated=">=<window-start date>" --json number,title,repository,url`.

4. **`my-tasks.md`.** Read `<hub>/.nexus/tmp/my-tasks.md` if it exists. One task per line;
   skip blank lines and lines starting with `<!--`. A line is one of:
    - a GitHub reference (`owner/name#123`, a full issue URL, or a bare `#123`) → fetch it with
      `gh issue view`. Resolve a bare `#123` against the hub repo. If the hub has no such issue,
      list it under "could not resolve" and ask the engineer once, in Phase 2.
    - plain text → a local task, referred to by its text.

5. **Yesterday's commitments.** Read the newest `STATE/reports/*.json`, if any, and take its
   `nextSteps`.

## Phase 2 — Build the item list

The **items in play** are: assigned issues (open, or closed in the window), resolved `my-tasks.md`
lines, and local tasks. Remove duplicates; an issue in both sources is one item.

Map evidence to items:

- A PR's `closingIssuesReferences`, a branch name containing the issue number, or a session whose
  prompts name the issue → that item.
- A session or PR that maps to no item → **Unplanned** (group by topic, not by session).
- A session that only ran a command or ended with nothing changed → ignore it.

For each item, also note **signals** you can see but must not assert (used in Phase 4):

- Open PR with no review for 2+ working days
- Failing checks on the engineer's PR
- `reviewDecision` = `CHANGES_REQUESTED` and no push since
- Issue reopened, or new sub-issues added, in the window
- Milestone due within 3 working days with the item still open
- An open issue this item is blocked by (`gh issue view --json` dependencies, when present)
- More than 3 items with activity in the window (work spread thin)
- Item untouched for 3+ working days while assigned and open

## Phase 3 — Interview (hybrid)

Show **one compact message** with every item in play, numbered. For each:

- the item (`#123 Title` or the task text),
- one line of evidence in plain words: *"PR #41 merged; 2 sessions on the migration script"*,
- a **candidate statement phrased as a question**, using the rubric below: *"Is it true that the
  migration now runs end to end on staging?"* Offer a candidate only when the evidence supports
  one. With no evidence, ask: *"Anything change here, or no movement?"*

Put yesterday's next steps first, each marked: *"Yesterday you planned: X. Done, moved, or dropped?"*

Then list the **Unplanned** groups the same way, and end with:

> Reply per number: `ok` to keep my wording, your own words, `no change`, or `skip`.
> Anything you did that isn't in Claude sessions or GitHub (reviews, design, pairing, support)?

Example:

```
Covering Fri 7 Nov 09:12 → now.

Planned yesterday
 1. "Get the ingestion PR reviewed" — PR #41 was approved Monday.
    → Done?

Items
 2. #33 DSU Submission API — PR #41 merged; 3 sessions on request validation.
    → "The submission endpoint is merged and validates the payload." Right?
 3. #37 Fixture set — no activity.
    → Anything change here, or no movement?

Unplanned
 4. CI cache fix in nexus — 1 session, 2 files changed.
    → What changed?

Reply per number: ok / your words / no change / skip.
Anything you did that isn't in Claude sessions or GitHub?
```

### The substance rubric

Assess every statement the engineer gives (including an `ok`'d candidate). A statement is
**substantive** when it names at least one of:

1. **State change** — something that was not true before is true now.
   *"The migration script runs end to end against staging."*
2. **Named blocker** — a specific thing stopping movement, and who or what owns it.
   *"Waiting on the API contract from platform; asked Tuesday, no reply."*
3. **Revised expectation** — bigger, smaller or later than believed, with the reason.
   *"Needs a schema change I didn't see, so it won't land this week."*
4. **Completion or abandonment** — done, or deliberately stopped.

A statement is **thin** when it carries only:

- restated intent — *"still working on it", "continuing today"*
- effort without outcome — *"spent the day on it", "worked on X", "busy with Y"*
- a status label with nothing under it — *"in progress", "80% done", "almost there"*
- yesterday's substance again, with no change

`no change` is **substantive** — it is an honest declaration. Record it as-is.

### Push-back

For each thin statement, send **one** follow-up that names exactly what is missing and asks for
that. Say why in one clause. Examples:

- *"That says how you spent the time, not what changed. What's true now that wasn't yesterday?"*
- *"'80% done' doesn't tell the team what's left. What's the remaining piece?"*
- *"Is anything stopping this, or is it just big? If it's bigger than expected, say so."*

Rules:

- At most **two** follow-ups per item for the whole run, including Phase 6 revisions.
- Never ask the same thing twice. Never ask what the evidence or an earlier answer already says.
- After two, accept what they gave. Do not argue, do not lecture.
- Never comment on the engineer's effort, speed or diligence. Only on what the statement says.
- If asked "why are you asking?", answer from the rubric: which category is missing, and why the
  team needs it.

## Phase 4 — Blockers and risks

From the signals in Phase 2, ask about each one as a question, labelled as your observation. Never
state that the engineer is blocked.

> I noticed a few things. Confirm or dismiss each:
>  a. PR #44 has had no review since Thursday. Is that blocking you? Who needs to review it?
>  b. Checks are failing on `feat/ingest-auth`. Known, or a surprise?
>  c. #37's milestone closes Friday and it's still open. Still on track?

A confirmed blocker must name: **what** is stuck, **who or what** owns unblocking it, **since
when**, and **the ask** — what the engineer needs from whom. If any part is missing, that is a
thin statement; push back under the same two-follow-up cap.

A confirmed risk that is not stopping work yet goes under **Risks**, with the engineer's words.
Dismissed signals are dropped and never mentioned again in this run.

Also ask: *"Anything blocking you that I can't see?"*

## Phase 5 — Next steps

Ask for **1–3** next steps. Offer candidates from open items with recent movement, as questions.
Each next step must name an item and an outcome, not an activity: *"Get #44 reviewed and merged"*,
not *"Work on #44"*. A next step that is only an activity is thin; push back under the same cap.

## Phase 6 — Compose, present, revise

Build the report from the engineer's own words only. Light edits for length and grammar are fine;
changing meaning is not. Keep it readable in 30 seconds: no more than 5 Wins, 3 Next Steps.

**Wins** come from substantive items: state changes, completions, deliberate abandonments, and
revised expectations. Order by what matters most to the team. Each bullet ends with the item
reference. Items declared `no change` do not go under Wins.

Present it inside a fenced `text` block so it pastes cleanly into Teams:

```text
Wins – What did I accomplish yesterday that moved us forward?
- Submission endpoint merged and validating payloads (#33)
- Fixture format agreed with Sam; first 10 fixtures labelled (#37)

Blockers
- PR #44 waiting on review from platform since Thu. Need: a reviewer today.

Risks
- #37 may slip past Friday: labelling takes longer than planned.

Next Steps
- Get #44 reviewed and merged
- Label the remaining 30 fixtures (#37)
```

Omit an empty section's bullets and write `- None` under its heading. Do not add Unplanned as a
heading; an unplanned win appears under Wins with a short description in place of an item ref.

Then ask: *"Want to change anything?"*

**Revisions.** Apply each requested change. Then assess the changed line with the rubric:

- Still substantive → apply silently.
- The change makes it thin (e.g. replaces *"endpoint merged"* with *"worked on the endpoint"*)
  → warn once, plainly, before applying:
  *"This version tells the team you were busy, not where #33 stands. The earlier line said the
  endpoint is merged. Keep yours anyway?"* That warning counts toward the item's two follow-ups.
- Once an item's two follow-ups are spent, apply the change without comment.

The engineer always has the last word. Loop until they say it is done.

## Phase 7 — Save and hand off

1. Write `STATE/reports/<YYYY-MM-DD>.md` (the report text) and `STATE/reports/<YYYY-MM-DD>.json`:

    ```json
    {
        "date": "YYYY-MM-DD",
        "windowStart": "<ISO>",
        "finishedAt": "<ISO now>",
        "items": [{ "ref": "owner/name#33 | task text", "statement": "<engineer's words>", "verdict": "substantive | thin", "indicator": "state-change | blocker | revised-expectation | completion | abandonment | no-change | none" }],
        "blockers": [{ "ref": "...", "what": "...", "owner": "...", "since": "...", "ask": "..." }],
        "risks": [{ "ref": "...", "statement": "..." }],
        "nextSteps": [{ "ref": "...", "statement": "..." }]
    }
    ```

    A second run on the same day overwrites both files.

2. If fixtures are on, append one line per item exchange to `STATE/fixtures/<YYYY-MM-DD>.jsonl`:

    ```json
    {"date":"YYYY-MM-DD","ref":"owner/name#33","candidate":"<your offered wording or null>","turns":[{"engineer":"<words>","verdict":"thin","indicator":"none","missing":"state change"},{"probe":"<your follow-up>"},{"engineer":"<words>","verdict":"substantive","indicator":"state-change"}],"final":"<text in report>","finalVerdict":"substantive","acceptedThin":false,"overrodeWarning":false,"keptCandidateVerbatim":false}
    ```

    `acceptedThin` = the item ended thin after the follow-up cap. `overrodeWarning` = the engineer
    kept a version you warned about. `keptCandidateVerbatim` = they replied `ok` to your wording.
    Fixtures hold the engineer's words and your words only — never session or transcript text.

3. Copy the report text to the clipboard with the first available of `wl-copy`, `xclip -selection
   clipboard`, `pbcopy`, `clip.exe`. If none works, say the text is in the block above.

4. End with one line: where the report was saved, and that it is on the clipboard.
