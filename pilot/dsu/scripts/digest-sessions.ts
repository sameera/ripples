// Reduces Claude Code session transcripts to a compact, local-only digest of what
// happened in a time window, per repository. The digest is evidence for the DSU
// interview; it is never pasted into the report.
//
// Usage:
//   node digest-sessions.ts --since <ISO-8601> --repo <abs-path> [--repo <abs-path> ...]
//
// Requires Node 22.18+ (native TypeScript type stripping).

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

interface SessionDigest {
    sessionId: string;
    title: string | null;
    cwd: string | null;
    branches: string[];
    start: string;
    end: string;
    prompts: string[];
    outcomes: string[];
    filesChanged: string[];
    gitActions: string[];
}

interface RepoDigest {
    repo: string;
    sessions: SessionDigest[];
}

const PROMPT_LIMIT: number = 400;
const OUTCOME_LIMIT: number = 600;
const MAX_PROMPTS: number = 12;
const MAX_OUTCOMES: number = 3;
const GIT_ACTION: RegExp = /\b(git (commit|push|merge|rebase|tag)|gh (pr|issue) (create|merge|close|comment|review|edit))\b/;
const SECRET: RegExp = /(AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|(password|secret|token|api[_-]?key)\s*[:=]\s*\S+)/gi;

function parseArgs(argv: string[]): { since: Date; repos: string[] } {
    let since: Date | null = null;
    const repos: string[] = [];
    for (let i: number = 0; i < argv.length; i++) {
        if (argv[i] === "--since") {
            since = new Date(argv[++i]);
        } else if (argv[i] === "--repo") {
            repos.push(argv[++i]);
        }
    }
    if (!since || Number.isNaN(since.getTime()) || repos.length === 0) {
        process.stderr.write("usage: digest-sessions.ts --since <ISO-8601> --repo <abs-path> [--repo ...]\n");
        process.exit(2);
    }
    return { since, repos };
}

// Claude Code stores a project's sessions under ~/.claude/projects/<path with every
// non-alphanumeric character replaced by "-">. Worktrees and subdirectories of the repo
// produce longer names with the same prefix.
function projectDirsFor(repo: string): string[] {
    const root: string = join(process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude"), "projects");
    if (!existsSync(root)) {
        return [];
    }
    const encoded: string = repo.replace(/\/+$/, "").replace(/[^a-zA-Z0-9]/g, "-");
    return readdirSync(root)
        .filter((name: string) => name === encoded || name.startsWith(encoded + "-"))
        .map((name: string) => join(root, name));
}

function clip(text: string, limit: number): string {
    const flat: string = text.replace(SECRET, "[redacted]").replace(/\s+/g, " ").trim();
    return flat.length > limit ? flat.slice(0, limit) + "…" : flat;
}

function isHumanPrompt(text: string): boolean {
    const t: string = text.trim();
    return t.length > 0
        && !t.startsWith("<local-command")
        && !t.startsWith("<command-")
        && !t.startsWith("<system-reminder>")
        && !t.startsWith("<task-notification>")
        && !t.startsWith("[Request interrupted");
}

function textOf(content: unknown): string {
    if (typeof content === "string") {
        return content;
    }
    if (Array.isArray(content)) {
        return content
            .filter((c: { type?: string }) => c?.type === "text")
            .map((c: { text?: string }) => c.text ?? "")
            .join("\n");
    }
    return "";
}

function digestFile(file: string, since: Date): SessionDigest | null {
    let raw: string;
    try {
        raw = readFileSync(file, "utf8");
    } catch {
        return null;
    }
    let title: string | null = null;
    let cwd: string | null = null;
    let start: string | null = null;
    let end: string | null = null;
    const branches: Set<string> = new Set();
    const prompts: string[] = [];
    const outcomes: string[] = [];
    const files: Set<string> = new Set();
    const gitActions: string[] = [];
    let sessionId: string = "";

    for (const line of raw.split("\n")) {
        if (!line) {
            continue;
        }
        let rec: any;
        try {
            rec = JSON.parse(line);
        } catch {
            continue;
        }
        if (rec.type === "ai-title" || rec.type === "custom-title") {
            title = rec.customTitle ?? rec.aiTitle ?? rec.title ?? title;
            continue;
        }
        if (rec.type !== "user" && rec.type !== "assistant") {
            continue;
        }
        if (rec.isSidechain || !rec.timestamp || new Date(rec.timestamp) < since) {
            continue;
        }
        sessionId = rec.sessionId ?? sessionId;
        cwd = rec.cwd ?? cwd;
        if (rec.gitBranch && rec.gitBranch !== "HEAD") {
            branches.add(rec.gitBranch);
        }
        start = start ?? rec.timestamp;
        end = rec.timestamp;

        if (rec.type === "user" && !rec.isMeta) {
            const text: string = textOf(rec.message?.content);
            if (isHumanPrompt(text)) {
                const p: string = clip(text, PROMPT_LIMIT);
                if (prompts[prompts.length - 1] !== p) {
                    prompts.push(p);
                }
            }
        } else if (rec.type === "assistant" && Array.isArray(rec.message?.content)) {
            for (const block of rec.message.content) {
                if (block.type === "text" && block.text?.trim()) {
                    outcomes.push(clip(block.text, OUTCOME_LIMIT));
                } else if (block.type === "tool_use") {
                    const input: any = block.input ?? {};
                    if (["Edit", "Write", "MultiEdit", "NotebookEdit"].includes(block.name) && input.file_path) {
                        files.add(input.file_path);
                    } else if (block.name === "Bash" && typeof input.command === "string" && GIT_ACTION.test(input.command)) {
                        gitActions.push(clip(input.command, 200));
                    }
                }
            }
        }
    }

    if (!start || !end || prompts.length === 0) {
        return null;
    }
    return {
        sessionId,
        title,
        cwd,
        branches: [...branches],
        start,
        end,
        prompts: prompts.length > MAX_PROMPTS
            ? [...prompts.slice(0, MAX_PROMPTS - 2), "…", prompts[prompts.length - 1]]
            : prompts,
        // The last few assistant texts usually carry the session's conclusion.
        outcomes: outcomes.slice(-MAX_OUTCOMES),
        filesChanged: [...files],
        gitActions,
    };
}

function main(): void {
    const { since, repos } = parseArgs(process.argv.slice(2));
    const result: RepoDigest[] = repos.map((repo: string) => {
        const sessions: SessionDigest[] = [];
        for (const dir of projectDirsFor(repo)) {
            for (const name of readdirSync(dir)) {
                const file: string = join(dir, name);
                if (!name.endsWith(".jsonl") || statSync(file).mtime < since) {
                    continue;
                }
                const d: SessionDigest | null = digestFile(file, since);
                if (d) {
                    sessions.push(d);
                }
            }
        }
        sessions.sort((a: SessionDigest, b: SessionDigest) => a.start.localeCompare(b.start));
        return { repo, sessions };
    });
    process.stdout.write(JSON.stringify({ since: since.toISOString(), repos: result }, null, 2) + "\n");
}

main();
