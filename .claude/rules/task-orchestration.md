# Task Orchestration (Large Multi-File Work)

For implementation work spanning ~5+ files or multiple subsystems, don't attempt it in one monolithic execution. Break it into task docs + an orchestrator.

## Pattern

1. Write task files into `docs/<feature>/` — one per discrete task, each self-contained for a fresh-context sub-agent (context, dependencies, interface contracts, files to touch, acceptance criteria)
2. Write a `README.md` with the task graph (phases + parallelism) and frozen interface contracts so parallel agents don't collide
3. Write an `ORCHESTRATOR.md` prompt describing phase execution, per-phase gates (build + lint), and stop conditions
4. Provide the user a kickoff prompt they can paste later
5. **Do not execute implementation** until the user explicitly says "go" or "start the orchestrator"

## Why

- Keeps each sub-agent's context focused
- Avoids massive multi-file edits in one pass
- Lets the user inspect plan artifacts before committing compute
- Allows resuming / re-running individual tasks without redoing upstream work

## When to propose

When the user describes a feature touching many files, propose this structure in plan mode. After plan approval, author the docs only — wait for explicit go before spawning implementation agents.
