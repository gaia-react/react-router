---
type: concept
status: active
created: 2026-04-21
updated: 2026-04-21
tags: [concept, claude, workflow]
---

# Task Orchestration

Authoritative rule: `.claude/rules/task-orchestration.md`. For implementation work spanning ~5+ files or multiple subsystems, Claude proposes a task-doc + orchestrator structure instead of one monolithic execution.

## Pattern

1. Per-task docs in `docs/<feature>/` — self-contained for fresh-context sub-agents (context, dependencies, interface contracts, files to touch, acceptance criteria).
2. `README.md` with the task graph (phases + parallelism) and frozen interface contracts.
3. `ORCHESTRATOR.md` prompt with phase execution, per-phase gates (build + lint), and stop conditions.
4. Kickoff prompt for the user to paste later.

Claude authors the plan artifacts only — it does **not** execute implementation until the user explicitly says "go" or "start the orchestrator".

## Why

- Keeps each sub-agent's context focused.
- Avoids massive multi-file edits in one pass.
- User can review the plan before committing compute.
- Individual tasks are resumable / re-runnable.

See [[Quality Gate]], [[PR Merge Workflow]].
