---
name: orchestrate
description: Plan a feature using task orchestration
argument-hint: '[description of what to build]'
allowed-tools: [Agent]
---

Plan a complex feature using the task orchestration pattern. Do not implement anything.

## Steps

### 1. Get description

If `$ARGUMENTS` is non-empty, use it as the feature description.

Otherwise, ask: **"What do you want me to orchestrate?"** and wait for the response before continuing.

### 2. Check model

Check your current model from session context.

- If you are on Opus, skip to step 3.
- If not, ask: **"You're on [model name]. Use Opus for planning? (Y/n)"** — default yes.
  - Yes (or Enter): spawn the agent with `model: opus`.
  - No: spawn without a model override (inherit current).

### 3. Spawn planning agent

Launch a `general-purpose` Agent with the model determined above and this prompt:

---

You are planning a feature using task orchestration. Do not implement anything.

**Feature:** {feature description from step 1}

First, read `wiki/concepts/Task Orchestration.md`.

Then create the following in `.claude/plans/{slug}/` where `{slug}` is a short kebab-case slug derived from the feature description:

1. **One task doc per parallel workstream** — name each `task-{name}.md`. Each must be fully self-contained for a fresh-context sub-agent and include:
   - Context and motivation
   - Interface contracts (types, function signatures, file exports)
   - Files to touch (with line-range hints where possible)
   - Acceptance criteria (concrete and testable)
   - Dependencies on other tasks in this plan

2. **`README.md`** — task graph showing phases, which tasks run in parallel within each phase, and the frozen interface contracts shared across tasks.

3. **`ORCHESTRATOR.md`** — instructions for running the plan: phase order, how to invoke each task agent, per-phase quality gates (`npm run typecheck && npm run lint`), and stop conditions (what to do when a gate fails).

4. **`KICKOFF.md`** — a single prompt the user can paste to start the orchestrator cold. Must be fully self-contained with no assumed context.

Report the files created and the path to `KICKOFF.md`.

---

### 4. Report to user

Tell the user what's in `.claude/plans/{slug}/` and that they can review the plan then paste `KICKOFF.md` to start execution.
