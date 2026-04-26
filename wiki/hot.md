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
updated: 2026-04-26
tags: [meta]

---

# Recent Context

## Last Updated

2026-04-26. Branch `feat/improved-migration-command` — migrated npm → pnpm across template + CI; rewrote `/migrate` as autonomous Dependabot.

## Key Facts

- pnpm pinned via `packageManager: pnpm@10.33.0`. `pnpm-lock.yaml` committed; `package-lock.json` deleted. `.npmrc`: `strict-peer-dependencies=false` + `minimumReleaseAge=10080` (7-day quarantine).
- `pnpm.overrides` uses `parent>child` syntax (`remix-i18next>i18next`); npm's nested-object form removed.
- `/migrate` is now autonomous: Phase 0 override audit → discover via `pnpm outdated --json` → group → wave A batch (minor/patch) / wave B per-group (major) with migration-guide fetches → Phase 6 re-audit → quality gate → report.
- ESLint 9.x cap retained inside the new flow. Storybook group uses `pnpm dlx storybook@latest upgrade`.
- Test-watch hook renamed `block-bare-test.sh`; matches both `pnpm *` and `npm *`.

## Recent Changes

- New ADR: [[pnpm]]. Updated [[Quality Gate]], [[Husky]], [[Chromatic]], [[Playwright]], [[Vitest]], [[Test Runner]], [[Claude Hooks]], [[Claude Integration]] (commands + hooks tables), [[remix-i18next]], [[i18next]], [[MSW Handlers]], [[Testing]], [[Release Workflow]]. CI workflows + `.claude/settings.json` permissions/hooks rewired.

## Active Threads

- Migration complete; no commit yet — awaiting user review.
