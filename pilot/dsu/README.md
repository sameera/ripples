# DSU pilot skill

A Claude Code skill that helps an engineer write their daily stand-up (Wins, Blockers, Risks,
Next Steps) for pasting into Microsoft Teams. It is Ripples' first validation step: it applies the
MVP substance rubric ([roadmap](../../docs/product/roadmap-mvp.md#the-judgment-at-the-centre)) to
real updates.

The engineer declares progress; the skill only asks. Claude sessions and GitHub activity decide
*what to ask about* and never become a statement on their own.

## Install

Requires Claude Code, `gh` (authenticated), Node 22.18+, and optionally the `nexus` CLI.

```bash
mkdir -p ~/.claude/skills
cp -r pilot/dsu ~/.claude/skills/dsu
```

## Run

From the Nexus hub folder, with member repos checked out beside it:

```
/dsu
/dsu --since 2026-11-07
```

Without a Nexus workspace, it reads only the current repo.

## Files it reads

It reads `my-tasks.md` from the hub's gitignored `.nexus/tmp/`, if present: your own list, one
task per line — `owner/repo#123`, an issue URL, `#123` (hub repo), or plain text.

It writes no files. Saving reports, carrying next steps into the next day, and fixtures are
deferred to [#46](https://github.com/sameera/ripples/issues/46).
