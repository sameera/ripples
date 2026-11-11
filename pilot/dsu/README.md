# DSU pilot skill

A Claude Code skill that helps an engineer write their daily stand-up (Wins, Blockers, Risks,
Next Steps) for pasting into Microsoft Teams. It is Ripples' first validation step: it applies the
MVP substance rubric ([roadmap](../../docs/product/roadmap-mvp.md#the-judgment-at-the-centre)) to
real updates and, with consent, saves each exchange as a labelled fixture for M1.

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

## Files it keeps

All under the hub's gitignored `.nexus/tmp/`:

| Path | What |
| --- | --- |
| `my-tasks.md` | Your own list. One task per line: `owner/repo#123`, an issue URL, `#123` (hub repo), or plain text |
| `dsu/config.json` | Fixture consent and GitHub login |
| `dsu/reports/<date>.md` / `.json` | Each day's final report; the newest one sets the next window and carries the next steps that get checked tomorrow |
| `dsu/fixtures/<date>.jsonl` | Per-item exchanges, only if you opted in. Holds your words and the skill's, never session transcripts |

Nothing leaves your machine. To contribute fixtures, share the `.jsonl` files yourself.
