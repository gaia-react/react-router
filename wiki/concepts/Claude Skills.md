---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, claude, skills]
---

# Claude Skills

`.claude/skills/` holds project-local skills that Claude Code activates based on context.

| Skill | When it activates |
|---|---|
| **react-code** | Writing/reviewing React components, hooks, event handlers — debugging stale closures, infinite re-renders, memoization issues |
| **typescript** | Writing/reviewing TypeScript — naming, exports, `type` vs `interface`, Zod schemas, function params |
| **tailwind** | Writing Tailwind classes, conditional classes, variants — `twJoin` vs `twMerge`, custom values, responsive |
| **skeleton-loaders** | Building skeleton loading states (pixel-perfect matches of real content) |

Each skill folder has a `SKILL.md` (the rules) and optionally a `references/` subfolder with deeper examples.

These supplement the [[Claude Integration]] rules — rules apply by file path, skills apply by context/intent.
