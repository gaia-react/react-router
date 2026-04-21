<!--
CACHE DISCIPLINE — enforced on every rewrite (Stop hook):
  - Max ~200 words total
  - Purpose: "where did we leave off?" — the current state of the work
  - Include: current branch / milestone, last-shipped thing, recent wiki changes, active threads
  - If a fact appears here twice across sessions, move it to the right wiki page and delete it from this cache
  - It is a cache, not a journal. Overwrite completely each update.
-->

---
type: meta
title: Hot Cache
status: active
created: 2026-04-20
updated: 2026-04-21
tags: [meta]
---

# Recent Context

## Last Updated

2026-04-21. Branch `chore/claude-hooks-governance`. Hooks governance pass in flight.

## Key Facts

- Four PreToolUse `Bash` hooks use `if:` patterns: `block-bare-npm-test` + `block-main-destructive-git` (blocking), `pr-merge-audit-check` + `wiki-maintenance-check` (advisory).
- `git-workflow.md` + `pr-merge-workflow.md` rules deleted — fully covered by their hooks. Quality-gate + task-orchestration rules slimmed to wiki-pointer stubs.
- `storybook.md` + `tailwind.md` carry `paths:` frontmatter for scope-based auto-loading.
- settings.json: Edit|Write matcher → Edit|Write|MultiEdit; UserPromptSubmit matcher `"All"` → `""`.

## Recent Changes

- Context-trim pass on `.claude/rules/` — 4 always-load rules slimmed/deleted (~103 lines of always-on context removed). Authoritative content now in `wiki/concepts/Git Workflow`, `PR Merge Workflow`, `Task Orchestration`, and `wiki/decisions/Quality Gate`.

## Active Threads

- PR `chore/claude-hooks-governance` → `main` pending.
