---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, claude, agent, review]
---

# Code Review Audit Agent

Defined in `.claude/agents/code-review-audit.md`. Sonnet-class subagent for comprehensive code review beyond what ESLint and TypeScript catch.

## Mission

Multi-dimensional review of recently changed code:

1. **Security** — injection, auth flaws, IDOR, data exposure, CSRF/SSRF, timing attacks, dependency concerns
2. **Performance** — N+1, unnecessary re-renders, bundle size, SSR perf, query specificity, network waterfalls
3. **Code smells** — complexity, duplication, naming, error handling, state mgmt, TS misuse
4. **Architecture** — separation of concerns, single responsibility, dependency direction, consistency
5. **Robustness** — validation, race conditions, null safety, error states, boundary conditions
6. **Maintainability** — docs, magic values, dead code, coupling

## Output format

- Summary
- Critical Issues (Must Fix)
- Important Issues (Should Fix)
- Suggestions (Consider Fixing)
- What's Done Well

## Methodology

1. Read carefully — understand intent
2. Trace data flow
3. Think adversarially
4. Consider blast radius
5. Be specific
6. Be proportionate
7. Respect existing patterns
8. Run `react-doctor` after manual review

## Specialist subagents

After its own review, spawns 3 in parallel against changed `.ts/.tsx` files:

1. **React Patterns Audit** — `useCallback`/`useEffect` anti-patterns, FC typing, named imports, event handler naming, Form component usage, component extraction
2. **TypeScript & Architecture Audit** — `type` over `interface`, no enums, no `switch`, descriptive names (Swift-style), arrow functions, JSX boolean props, route thinness, no `px` in Tailwind
3. **Translation Audit** — single `useTranslation()` per component, namespace overrides, dynamic key types, string deduplication

## Persistent memory

`.claude/agent-memory/code-review-audit/MEMORY.md` — accumulates patterns and issues across reviews. Versioned with the project.

## Trigger

Always before `gh pr merge` ([[PR Merge Workflow]]). Also on demand for any review.
