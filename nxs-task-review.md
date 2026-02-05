# /nxs.tasks Command Execution Retrospective

**Date**: 2026-02-02
**Epic**: Core Layout Shell & Sidebar (#5)
**Outcome**: Partially successful with significant inefficiencies

---

## Executive Summary

The `/nxs.tasks` command execution experienced multiple failures that resulted in wasted effort, incorrect task generation, and scope violations. The primary issues stem from:

1. Agent delegation without proper context passing
2. Decomposer ignoring explicit "Out of Scope" constraints
3. Lack of validation between decomposition and task file generation
4. Terminology drift between HLD and generated tasks

---

## What Went Wrong

### 1. **Agent Hallucinated Task Content** (CRITICAL)

**Issue**: When delegating task file creation (TASK-5.02 through TASK-5.13) to a sub-agent, the agent created completely different tasks than what the decomposer specified.

**Evidence**:
- Decomposer specified: "Implement Jotai state atoms for sidebar"
- Agent created: "Design and implement sidebar data model with TypeScript types"
- The agent invented an entirely new task structure (data model, context provider, etc.) instead of using the decomposer's output

**Impact**:
- Had to delete 12 incorrectly generated files
- Required second agent invocation to regenerate
- ~10 minutes of wasted execution time

**Root Cause**:
- The sub-agent was invoked with a prompt referencing "architect outputs from earlier in the conversation"
- Sub-agents do NOT have access to parent conversation context
- The agent had no actual data to work from, so it invented plausible-sounding content

**Fix Needed**:
```markdown
## When delegating to sub-agents:
1. NEVER reference "earlier in the conversation" - sub-agents have no context
2. Pass ALL required data explicitly in the prompt
3. Consider storing intermediate outputs in scratchpad files that agents can read
```

### 2. **Decomposer Created Out-of-Scope Tasks** (HIGH)

**Issue**: The decomposer created 3 tasks (23% of total) for functionality explicitly marked as out-of-scope in both the epic and HLD:

| Task | Content | Out-of-Scope Reference |
|------|---------|------------------------|
| TASK-5.07 | Header with Breadcrumbs | "Top utility bar (Epic 02)" |
| TASK-5.10 | Keyboard shortcuts | "Keyboard shortcuts for sidebar toggle" |
| TASK-5.11 | Mobile responsive | "Mobile sidebar behavior (Epic 03)" |

**Root Cause**:
- The decomposer prompt didn't explicitly instruct it to check and respect the "Out of Scope" section
- The decomposer optimized for "comprehensive coverage" without scope constraints

**Fix Needed**:
```markdown
## Decomposer prompt should include:
1. "Read the 'Out of Scope' section in both epic.md and HLD.md"
2. "Do NOT create tasks for items explicitly listed as out of scope"
3. "If unsure whether something is in scope, exclude it and flag for clarification"
```

### 3. **Terminology Inconsistency Not Caught** (MEDIUM)

**Issue**: The HLD consistently uses "MainCanvas" but tasks used "MainContent":
- HLD Section 8: "MainCanvas: Scrollable content container"
- TASK-5.08: "Implement MainContent area"

**Root Cause**:
- No terminology validation step between HLD and task generation
- The architect agent used its own preferred naming without checking HLD terminology

**Fix Needed**:
```markdown
## Add terminology extraction step:
1. Extract key terms from HLD (component names, concepts)
2. Pass term glossary to architect and decomposer
3. Validate generated content against glossary before output
```

### 4. **User Note About Dependencies Was Partially Ignored** (MEDIUM)

**Issue**: User explicitly stated "Note that I've already installed the required dependencies. So do not generate a task to set them up."

**What Happened**:
- No explicit "install dependencies" task was created (good)
- However, tasks still included references to running `npx shadcn@latest add` commands
- TASK-5.05 LLD includes: "Run `npx shadcn@latest add sidebar`"

**Fix Needed**:
```markdown
## Handle user constraints:
1. Parse user notes for explicit constraints
2. Pass constraints to all downstream agents
3. Validate outputs don't violate constraints
```

### 5. **Multiple Agent Invocations Instead of Batching** (LOW)

**Issue**: Used 4 separate agent invocations when 2 would have sufficed:
1. LLD generation tasks 1-7
2. LLD generation tasks 8-13
3. Task file creation (failed)
4. Task file creation (retry)

**Better Approach**:
- Single agent call for all LLDs with explicit JSON output
- Store output in scratchpad file
- Single agent call for task file generation reading from scratchpad

---

## What Went Well

1. **Epic issue creation worked correctly** - Script handled GitHub issue creation smoothly
2. **Template variable substitution was correct** - Proper frontmatter generation
3. **Analyzer caught scope violations** - The consistency analysis step correctly identified out-of-scope tasks
4. **Recovery was possible** - Despite failures, was able to regenerate correct files

---

## Recommended Command Improvements

### 1. Explicit Data Passing to Sub-Agents

```markdown
## Step 3: Decompose into Tasks
1. Invoke decomposer agent
2. **STORE decomposer JSON output to scratchpad file**: `tasks-decomposition.json`
3. Validate JSON structure before proceeding

## Step 4: Generate LLDs
1. **READ decomposition from scratchpad file**
2. Invoke architect agent with file path (not conversation reference)
3. **STORE architect output to scratchpad file**: `tasks-lld.json`

## Step 5: Generate Task Files
1. **READ both scratchpad files**
2. Generate markdown files directly (no sub-agent needed for file writing)
```

### 2. Scope Validation in Decomposer Prompt

Add to decomposer prompt:
```markdown
**CRITICAL CONSTRAINTS**:
1. Read the "Out of Scope" section in the HLD (Section 4: Requirements Analysis)
2. Do NOT create tasks for any item listed as out of scope
3. The following are explicitly out of scope for this epic:
   {{OUT_OF_SCOPE_ITEMS}}
4. If a task touches out-of-scope functionality, flag it in the response
```

### 3. Add Terminology Glossary Step

```markdown
## Step 2.5: Extract Terminology (NEW)
Before decomposition, extract key terms from HLD:
1. Component names (AppShell, MainCanvas, AppSidebar)
2. Technical terms (Jotai atom, atomWithStorage)
3. Route names (/stream, /patterns, etc.)
4. Pass glossary to all downstream agents
```

### 4. Validate Before File Creation

```markdown
## Step 5.5: Pre-Generation Validation (NEW)
Before creating task files:
1. Verify task count matches decomposer output
2. Verify each task title matches decomposer exactly
3. Verify no out-of-scope tasks present
4. Verify terminology matches HLD glossary
5. If validation fails, report errors and STOP
```

### 5. Simplify File Generation

Instead of delegating task file creation to an agent:
```markdown
## Step 5: Output Format
For each task in decomposition:
1. Read template from docs/system/delivery/task-template.md
2. Substitute variables from decomposer + architect outputs
3. Write file directly (no agent delegation)
4. Validate file was written correctly
```

---

## Metrics

| Metric | Value |
|--------|-------|
| Total execution time | ~15 minutes |
| Wasted time (failures) | ~5 minutes |
| Agent invocations | 6 (optimal: 2-3) |
| Files deleted/recreated | 12 |
| Tasks with scope violations | 3 of 13 (23%) |
| User interventions needed | 1 (review checkpoint) |

---

## Action Items

1. [ ] Update decomposer prompt to include out-of-scope validation
2. [ ] Add explicit data passing via scratchpad files instead of context references
3. [ ] Add pre-generation validation step
4. [ ] Add terminology extraction from HLD
5. [ ] Consider removing agent delegation for file writing (do it directly)
6. [ ] Add user constraint parsing and propagation

---

## Conclusion

The command execution was inefficient primarily due to:
1. **Architectural issue**: Sub-agents don't have parent context (critical misunderstanding)
2. **Missing validation**: No scope checking in decomposer
3. **No data persistence**: Relying on conversation context instead of explicit file storage

The recommended improvements focus on making data flow explicit (via scratchpad files) and adding validation checkpoints to catch issues early rather than at the analysis phase.
