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

- Four new PreToolUse `Bash` hooks use `if:` patterns: `block-bare-npm-test` + `block-main-destructive-git` (blocking), `pr-merge-audit-check` + `wiki-maintenance-check` (advisory).
- `.claude/rules/test-runner.md` and `.claude/rules/wiki-maintenance.md` deleted — enforcement moved into the hooks.
- New rules: `git-workflow.md` (referenced by main-protection hook), `task-orchestration.md` (~5+ file work).
- `storybook.md` + `tailwind.md` gained `paths:` frontmatter for scope-based auto-loading.
- settings.json: Edit|Write matcher → Edit|Write|MultiEdit; UserPromptSubmit matcher `"All"` → `""`.

## Recent Changes

- Wiki: [[Claude Hooks]] + [[Claude Integration]] rewritten for the new hook set; [[test-runner]] repointed at hook; added [[Git Workflow]] + [[Task Orchestration]] concepts.

## Active Threads

- PR `chore/claude-hooks-governance` → `main` pending.
