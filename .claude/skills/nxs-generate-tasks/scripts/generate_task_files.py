#!/usr/bin/env python3
"""
Generate TASK-*.md files from structured JSON input.

This script handles the deterministic parts of task file generation:
- Parsing input JSON with epic metadata and tasks
- Reading the task template
- Parsing architect responses to extract LLD sections
- Computing derived variables (branch names, dependencies)
- Substituting all template variables
- Writing task files

Input JSON Schema:
{
    "epic_number": 7,
    "epic_title": "Core Layout Shell & Sidebar",
    "epic_type": "enhancement",
    "output_dir": "docs/features/.../tasks",
    "tasks": [
        {
            "sequence": 1,
            "title": "Create Jotai state atoms",
            "category": "Data Layer",
            "summary": "Initialize state management...",
            "effort": "S",
            "labels": ["frontend", "state"],
            "blocked_by": [],
            "blocks": [2, 3],
            "architect_response": "### Files\\n\\n- `src/store/atoms.ts`..."
        }
    ]
}
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path


# Fallback content for when architect response is missing or incomplete
FALLBACKS = {
    "FILES": "- [ ] TBD - See HLD for component structure",
    "INTERFACES": "// See HLD for data models",
    "KEY_DECISIONS": "| See HLD | Key Technical Decisions | — |",
    "IMPLEMENTATION_NOTES": "Refer to HLD implementation phases.",
    "ACCEPTANCE_CRITERIA": "- [ ] Implements task summary requirements",
}

# Effort size to human-readable estimate mapping
EFFORT_MAP = {
    "XS": "< 4 hours",
    "S": "4-8 hours (half day to full day)",
    "M": "1-2 days",
    "L": "2-3 days (should be decomposed)",
    "XL": "3+ days (must be decomposed)",
}


def to_kebab_case(text: str) -> str:
    """Convert text to kebab-case for branch names.

    Examples:
        "Core Layout Shell" -> "core-layout-shell"
        "User Authentication Flow" -> "user-authentication-flow"
    """
    # Remove special characters, keep alphanumeric and spaces
    text = re.sub(r"[^\w\s-]", "", text)
    # Replace spaces and underscores with hyphens
    text = re.sub(r"[\s_]+", "-", text)
    # Remove consecutive hyphens
    text = re.sub(r"-+", "-", text)
    # Lowercase and strip
    return text.lower().strip("-")


def parse_architect_response(markdown: str | None) -> dict[str, str]:
    """Extract LLD sections from architect markdown response.

    Looks for sections with headers like:
    - ### Files / ### Files to Create/Modify
    - ### Interfaces / ### Interfaces/Types
    - ### Key Decisions
    - ### Implementation Notes
    - ### Acceptance Criteria

    Returns dict with keys: FILES, INTERFACES, KEY_DECISIONS,
    IMPLEMENTATION_NOTES, ACCEPTANCE_CRITERIA
    """
    if not markdown:
        return {}

    result: dict[str, str] = {}

    # Define section header patterns and their output keys
    section_patterns = [
        (r"###\s+Files(?:\s+to\s+Create/Modify)?\s*\n", "FILES"),
        (r"###\s+Interfaces(?:/Types)?\s*\n", "INTERFACES"),
        (r"###\s+Key\s+Decisions\s*\n", "KEY_DECISIONS"),
        (r"###\s+Implementation\s+Notes\s*\n", "IMPLEMENTATION_NOTES"),
        (r"###\s+Acceptance\s+Criteria\s*\n", "ACCEPTANCE_CRITERIA"),
    ]

    # Find all section positions
    sections: list[tuple[int, int, str]] = []  # (start, header_end, key)

    for pattern, key in section_patterns:
        match = re.search(pattern, markdown, re.IGNORECASE)
        if match:
            sections.append((match.start(), match.end(), key))

    # Sort by position
    sections.sort(key=lambda x: x[0])

    # Extract content between sections
    for i, (start, header_end, key) in enumerate(sections):
        # Find the end of this section (start of next section or end of string)
        if i + 1 < len(sections):
            end = sections[i + 1][0]
        else:
            end = len(markdown)

        content = markdown[header_end:end].strip()

        # For INTERFACES, try to extract just the code block content
        if key == "INTERFACES" and "```" in content:
            code_match = re.search(r"```(?:typescript|ts)?\n?(.*?)```", content, re.DOTALL)
            if code_match:
                content = code_match.group(1).strip()

        if content:
            result[key] = content

    return result


def format_dependencies(deps: list[int], epic_number: int) -> str:
    """Format dependency list as task references.

    Examples:
        [1, 2] with epic 7 -> "TASK-7.01, TASK-7.02"
        [] -> "None"
    """
    if not deps:
        return "None"

    formatted = [f"TASK-{epic_number}.{seq:02d}" for seq in deps]
    return ", ".join(formatted)


def compute_branch_name(epic_type: str, epic_number: int, epic_title: str) -> str:
    """Generate git branch name.

    Examples:
        ("enhancement", 7, "Core Layout Shell") -> "feat/7-core-layout-shell"
        ("bug", 42, "Fix Login Issue") -> "bug/42-fix-login-issue"
    """
    prefix = "bug" if epic_type.lower() == "bug" else "feat"
    kebab_title = to_kebab_case(epic_title)
    return f"{prefix}/{epic_number}-{kebab_title}"


def compute_workspace_path(epic_number: int) -> str:
    """Generate git worktree path."""
    return f"../ripples-worktrees/{epic_number}"


def substitute_template(template: str, variables: dict[str, str]) -> str:
    """Replace all {{VARIABLE}} placeholders in template."""
    result = template
    for key, value in variables.items():
        placeholder = "{{" + key + "}}"
        result = result.replace(placeholder, value)
    return result


def strip_template_comment(template: str) -> str:
    """Strip the leading HTML comment block from the template.

    The template contains a documentation comment at the top that explains
    the variables. This comment should not be included in generated task files.
    """
    # Match leading HTML comment: <!-- ... -->
    pattern = r"^\s*<!--[\s\S]*?-->\s*"
    return re.sub(pattern, "", template)


def read_template(project_root: Path) -> str:
    """Read the task template file and strip documentation comments."""
    template_path = project_root / "docs" / "system" / "delivery" / "task-template.md"

    if not template_path.exists():
        raise FileNotFoundError(f"Task template not found at: {template_path}")

    content = template_path.read_text()
    return strip_template_comment(content)


def generate_task_content(
    template: str,
    epic_number: int,
    epic_title: str,
    epic_type: str,
    task: dict,
) -> tuple[str, bool]:
    """Generate content for a single task file.

    Returns:
        Tuple of (content, used_fallback) where used_fallback indicates
        if any fallback content was used for architect fields.
    """
    # Parse architect response
    architect_sections = parse_architect_response(task.get("architect_response"))

    # Track if we used any fallbacks
    used_fallback = False

    # Build variables dict
    variables: dict[str, str] = {
        "EPIC": str(epic_number),
        "SEQ": f"{task['sequence']:02d}",
        "TITLE": task["title"],
        "LABELS": ", ".join(task.get("labels", [])),
        "PARENT": f"#{epic_number}",
        "SUMMARY": task.get("summary", ""),
        "BLOCKED_BY": format_dependencies(task.get("blocked_by", []), epic_number),
        "BLOCKS": format_dependencies(task.get("blocks", []), epic_number),
        "WORKSPACE_PATH": compute_workspace_path(epic_number),
        "BRANCH": compute_branch_name(epic_type, epic_number, epic_title),
        "EFFORT_ESTIMATE": EFFORT_MAP.get(task.get("effort", "M"), task.get("effort", "TBD")),
    }

    # Add architect sections with fallbacks
    for key in ["FILES", "INTERFACES", "KEY_DECISIONS", "IMPLEMENTATION_NOTES", "ACCEPTANCE_CRITERIA"]:
        if key in architect_sections:
            variables[key] = architect_sections[key]
        else:
            variables[key] = FALLBACKS[key]
            used_fallback = True

    # Substitute all variables
    content = substitute_template(template, variables)

    return content, used_fallback


def generate_task_files(
    input_data: dict,
    project_root: Path,
    dry_run: bool = False,
) -> dict:
    """Generate all task files from input data.

    Returns summary dict with status, files created, etc.
    """
    epic_number = input_data["epic_number"]
    epic_title = input_data["epic_title"]
    epic_type = input_data["epic_type"]
    output_dir = Path(input_data["output_dir"])
    tasks = input_data["tasks"]

    # Make output_dir absolute if relative
    if not output_dir.is_absolute():
        output_dir = project_root / output_dir

    # Read template
    template = read_template(project_root)

    # Ensure output directory exists
    if not dry_run:
        output_dir.mkdir(parents=True, exist_ok=True)

    files_created: list[str] = []
    fallbacks_used = 0

    for task in tasks:
        seq = task["sequence"]
        filename = f"TASK-{epic_number}.{seq:02d}.md"
        filepath = output_dir / filename

        content, used_fallback = generate_task_content(
            template=template,
            epic_number=epic_number,
            epic_title=epic_title,
            epic_type=epic_type,
            task=task,
        )

        if used_fallback:
            fallbacks_used += 1

        if dry_run:
            print(f"[DRY RUN] Would create: {filepath}")
            print(f"  Title: {task['title']}")
            print(f"  Effort: {task.get('effort', 'M')}")
            print(f"  Labels: {task.get('labels', [])}")
            print(f"  Dependencies: blocked_by={task.get('blocked_by', [])}, blocks={task.get('blocks', [])}")
            print(f"  Architect response: {'present' if task.get('architect_response') else 'missing (using fallbacks)'}")
            print()
        else:
            filepath.write_text(content)
            files_created.append(filename)

    return {
        "status": "success",
        "tasks_generated": len(files_created) if not dry_run else len(tasks),
        "output_dir": str(output_dir),
        "files": files_created if not dry_run else [f"TASK-{epic_number}.{t['sequence']:02d}.md" for t in tasks],
        "fallbacks_used": fallbacks_used,
    }


def find_project_root(start_path: Path) -> Path:
    """Find the project root by looking for CLAUDE.md or .git."""
    current = start_path.resolve()

    while current != current.parent:
        if (current / "CLAUDE.md").exists() or (current / ".git").exists():
            return current
        current = current.parent

    # Fallback to current working directory
    return Path.cwd()


def main():
    parser = argparse.ArgumentParser(
        description="Generate TASK-*.md files from structured JSON input"
    )
    parser.add_argument(
        "input_json",
        help="Path to JSON file containing epic metadata and tasks array"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview what would be generated without writing files"
    )
    parser.add_argument(
        "--project-root",
        type=Path,
        help="Project root directory (auto-detected if not specified)"
    )

    args = parser.parse_args()

    # Read input JSON
    input_path = Path(args.input_json)
    if not input_path.exists():
        print(f"Error: Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    try:
        with open(input_path) as f:
            input_data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in input file: {e}", file=sys.stderr)
        sys.exit(1)

    # Validate required fields
    required_fields = ["epic_number", "epic_title", "epic_type", "output_dir", "tasks"]
    missing = [f for f in required_fields if f not in input_data]
    if missing:
        print(f"Error: Missing required fields in input: {missing}", file=sys.stderr)
        sys.exit(1)

    # Find project root
    project_root = args.project_root or find_project_root(input_path)

    try:
        result = generate_task_files(
            input_data=input_data,
            project_root=project_root,
            dry_run=args.dry_run,
        )

        # Output result as JSON
        print(json.dumps(result, indent=2))

    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error generating task files: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
