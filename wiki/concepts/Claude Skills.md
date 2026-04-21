---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-21
tags: [concept, claude, skills]
---

# Claude Skills

`.claude/skills/` holds project-local skills (react-code, typescript, tailwind, skeleton-loaders). Each has a `SKILL.md` defining when it activates and its rules. Skills apply by context/intent; rules apply by file path.

See [[Claude Integration]] (modules) for the full skills inventory.

## Skill references convention

`SKILL.md` is stack-agnostic lazy philosophy. It auto-loads into context, so it must stay short and general.

Stack-specific or deep-dive content lives in `references/{topic}.md` inside the skill directory, loaded on demand. `SKILL.md` hints at available references via markdown links. Adding support for a new stack means adding a new reference file — `SKILL.md` itself is never touched.

**Example:** `skills/tdd/SKILL.md` links to `skills/tdd/references/tests-react.md`. A new Svelte testing reference would go in `skills/tdd/references/tests-svelte.md`.

See [[Claude Integration]] (concepts) for the broader convention covering extension points, monorepo retrofit, and service swaps.
