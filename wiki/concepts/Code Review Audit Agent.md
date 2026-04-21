---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, claude, agent, review]
---

# Code Review Audit Agent

Defined in `.claude/agents/code-review-audit.md`. Sonnet-class subagent for comprehensive code review beyond what ESLint and TypeScript catch.

Full spec: `.claude/agents/code-review-audit.md`.

Reviews security, performance, code smells, architecture, robustness, and maintainability. Output is tiered: Critical (must fix) → Important (should fix) → Suggestions → What's done well. After its own pass, spawns three specialist subagents in parallel: React Patterns, TypeScript & Architecture, and Translation audits.

## Persistent memory

`.claude/agent-memory/code-review-audit/MEMORY.md` — accumulates patterns and issues across reviews. Versioned with the project.

## Extension mechanism

Library-specific audit rules live in `.claude/agents/code-review-audit/*.md`. Each file targets one or more specialist subagents via YAML frontmatter (`subagents: [react-patterns, typescript, translation]`). The agent reads all extension files at startup and injects their rules into the relevant subagent prompts.

To swap a library: remove its extension file, add one for the replacement. The main agent definition stays unchanged. See the `README.md` in that directory for the full format.

| File | Library |
|---|---|
| `conform.md` | `@conform-to/zod` |
| `tailwind-merge.md` | `tailwind-merge` |
| `react-i18next.md` | `react-i18next` |
| `form-components.md` | GAIA Form Components |

## Trigger

Always before `gh pr merge` ([[PR Merge Workflow]]). Also on demand for any review.
