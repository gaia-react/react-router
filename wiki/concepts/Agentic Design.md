---
type: concept
status: active
created: 2026-04-25
updated: 2026-04-25
tags: [concept, philosophy, claude, agent]
---

# Agentic Design

Agentic design is the discipline of building AI systems that act autonomously toward goals rather than passively responding to prompts. Where a traditional LLM call is a one-shot question-answer exchange, an agentic system reasons, observes the effects of its actions, adjusts, and iterates — often using tools, spawning sub-agents, and persisting knowledge across sessions.

GAIA implements all four canonical agentic patterns and all four foundational agentic principles as first-class features.

## The four canonical patterns

### Reflection

An agent generates output, evaluates its own work against criteria, identifies failures, and corrects them in a loop until quality thresholds are met.

**GAIA's implementation:**

- The [[Code Review Audit Agent]] is a dedicated reflection agent. After every feature branch it reads the diff, evaluates every change against security, performance, code-smell, and antipattern criteria, and returns a tiered report (Critical / Important / Suggestions). It does not allow the merge to proceed until Critical and Important issues are fixed and committed.
- The [[Quality Gate]] (typecheck + lint + tests + build) is a hard reflection gate before every commit. Claude cannot commit code that fails the gate — the pre-commit hook blocks it.
- The quality gate runs again inside every Task Orchestration phase before the orchestrator advances. Each phase is self-correcting.

### ReAct (Reason + Act)

ReAct interleaves reasoning steps with actions: observe the environment, reason about what to do, act (use a tool), observe the result, reason again. The loop continues until the goal is satisfied.

**GAIA's implementation:**

Claude's workflow in GAIA is a natural ReAct loop:

1. **Observe** — read the relevant wiki pages before touching code; read ESLint and TypeScript errors after writing code.
2. **Reason** — apply scoped rules to determine the correct approach; consult references inside skills for deep-dive context.
3. **Act** — write code, run Vitest, run Playwright, run the linter.
4. **Observe** — read test output, lint output, type errors.
5. **Reason + Act** — iterate until all gates pass.

The Obsidian wiki is Claude's primary observation source for project knowledge. The `claude-obsidian` plugin (`/wiki-query`, `/wiki-ingest`, `/autoresearch`) is the tool interface. ESLint, Vitest, and Playwright are the feedback tools after code changes.

### Planning

Agents decompose large goals into smaller, executable steps — a task graph — and execute them in sequence or in parallel, with gates between phases.

**GAIA's implementation:**

[[Task Orchestration]] is GAIA's planning layer. For features spanning 5+ files or multiple subsystems:

1. Claude authors per-task docs in `.claude/plans/<feature>/` — each self-contained for a fresh-context sub-agent.
2. A `README.md` records the full task graph: phases, parallelism, and frozen interface contracts.
3. An `ORCHESTRATOR.md` prompt specifies phase execution, per-phase quality gates, and stop conditions.
4. Claude does **not** execute the plan until the user explicitly approves it.

This is Human-in-the-Loop planning: the agent proposes, the human reviews, execution begins only on explicit approval.

### Multi-Agent Systems

Specialized agents collaborate in parallel, each focused on a narrow domain, coordinated by an orchestrator that manages sequencing and gates.

**GAIA's implementation:**

- The [[Code Review Audit Agent]] is itself a multi-agent system. After its own full-pass review it spawns three specialist subagents in parallel:
  - **React Patterns** — component structure, hook usage, rendering antipatterns
  - **TypeScript & Architecture** — type safety, module boundaries, structural correctness
  - **Translation** — i18n string coverage, key consistency, missing translations
- The orchestrator pattern from [[Task Orchestration]] dispatches implementation agents per phase in parallel where dependencies allow, then gates on build + lint before the next phase begins.
- Extension files in `.claude/agents/code-review-audit/*.md` inject library-specific rules into the relevant specialist subagent at runtime — a configurable multi-agent dispatch system.

## The four foundational principles

### Autonomy

Agents make decisions based on goals and constraints, without requiring human approval for every action.

**GAIA's implementation:** Path-scoped rules give Claude a precise, bounded decision space. Claude can autonomously choose how to implement a component because the rules encode the acceptable solution space — it doesn't need to ask "should I use `useTranslation` here?" because the i18n rule makes it unambiguous. Autonomy is enabled by constraint, not by absence of constraint.

### Tool Use

Agents interface with external systems — APIs, file systems, test runners — to take real-world actions and collect observations.

**GAIA's tool layer for Claude:**

| Tool                  | Purpose                                             |
| --------------------- | --------------------------------------------------- |
| ESLint                | Static analysis feedback after every code write     |
| Vitest                | Unit/integration test execution                     |
| Playwright            | E2E test execution and browser observation          |
| Storybook + Chromatic | Component isolation and visual regression detection |
| MSW                   | API mock layer for tests and Storybook              |
| Obsidian wiki         | Persistent project knowledge retrieval              |
| `gh` CLI              | PR creation, merge, and CI status                   |

### Memory & Context

Agents retain and retrieve relevant knowledge across sessions to avoid re-deriving context from scratch.

**GAIA's implementation:**

- **Obsidian wiki** — the primary persistent knowledge store. Architecture decisions, module maps, flows, dependency choices, and concepts are authored once and retrieved on demand. Claude fetches the one page it needs rather than loading the entire knowledge base.
- **`/handoff` + `/pickup`** — explicit session continuity protocol. `/handoff` writes a structured synthesis of accomplishments, decisions, gaps, and next actions. `/pickup` reads it and reconstitutes working context cold. See [[Handoff Command]] and [[Pickup Command]].
- **Code Review Audit memory** — `.claude/agent-memory/code-review-audit/MEMORY.md` accumulates patterns and recurring issues across reviews. The agent learns from prior reviews.
- **`/audit-knowledge`** — periodic maintenance to sweep memory, wiki, and autoloaded files for duplication, conflicts, and stale instructions. See [[Audit-Knowledge Command]].
- **Scoped rules** — rules activate only for the files Claude is currently editing. Relevant constraints load automatically; irrelevant ones stay out of the context window.

### Human-in-the-Loop

Incorporating human oversight at key decision points to ensure safety, quality, and alignment.

**GAIA's checkpoints:**

| Checkpoint                  | When           | What it guards                                                                |
| --------------------------- | -------------- | ----------------------------------------------------------------------------- |
| Quality gate                | Pre-commit     | No broken types, lint errors, failing tests, or build failures reach the repo |
| Code-review audit           | Pre-merge      | No security, performance, or code-quality issues reach `main`                 |
| Task Orchestration approval | Pre-execution  | No large multi-file plan executes without explicit user sign-off              |
| Orchestrator phase gates    | Between phases | No phase begins if the prior phase's build + lint fails                       |
| Destructive git hook        | Always         | Claude cannot commit to `main` or force-push — human must act                 |

Human-in-the-Loop in GAIA is not advisory — it is enforced. Hooks block the operations that bypass it.

## Why this matters

Most Claude setups treat agentic behavior as emergent: give the model a good prompt and hope it reasons well. GAIA makes agentic behavior structural. The reflection loops, the observation-action cycles, the planning gates, the specialist dispatch — these are wired in, not prompted in. They run the same way every time, by any engineer on the team, whether or not they understand the underlying agentic theory.

The result is a system where Claude's autonomy is bounded, its quality is enforced, and its knowledge persists — an agentic framework that is predictable enough to stake production code on.

## See also

- [[GAIA Philosophy]]
- [[Task Orchestration]]
- [[Code Review Audit Agent]]
- [[Claude Hooks]]
- [[Handoff Command]]
- [[Pickup Command]]
- [[Audit-Knowledge Command]]
- [[Quality Gate]]
- [[PR Merge Workflow]]
