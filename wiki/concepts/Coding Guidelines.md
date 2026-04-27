---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-21
tags: [concept, coding-rules]
---

# Coding Guidelines

GAIA coding guidelines live in `.claude/rules/coding-guidelines.md` and the per-domain rule files enumerated in [[Claude Integration]].

## Coding Principles

Every coding rule embeds [Karpathy's four principles](https://github.com/forrestchang/andrej-karpathy-skills/blob/main/CLAUDE.md), plus two added by GAIA:

| Principle                   | Description                                                                      |
| --------------------------- | -------------------------------------------------------------------------------- |
| **Think Before Coding**     | Surface assumptions, push back on complexity, ask when unclear.                  |
| **Simplicity First**        | Write the minimum code that solves the problem; no speculative abstractions.     |
| **Surgical Changes**        | Touch only what is needed; match existing style; leave unbroken things alone.    |
| **Goal-Driven Execution**   | Define verifiable success criteria before starting; loop until verified.         |
| **Always Use TDD**          | Vitest for units, Playwright for user flows, tests before code.                  |
| **Always Verify Your Work** | Run the quality gate process; fix all warnings and errors before reporting done. |
