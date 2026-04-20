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

## Trigger

Always before `gh pr merge` ([[PR Merge Workflow]]). Also on demand for any review.
