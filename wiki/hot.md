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
updated: 2026-04-22
tags: [meta]
---

# Recent Context

## Last Updated

2026-04-22. Branch `feat/release-infrastructure` → PR #26 open, auto-merge armed (squash), awaiting review + CI.

## Key Facts

- First public release infrastructure landed: `CHANGELOG.md`, `.github/workflows/release.yml` (tag-triggered), `.gaia/{VERSION,manifest.json,release-exclude}`, `.gaia/scripts/generate-manifest.mjs`.
- Two new commands: `/gaia-release` (maintainer, stripped from tarball) and `/gaia-update` (adopter-facing, three-way diff).
- File classes in `.gaia/manifest.json`: `owned` / `shared` / `wiki-owned`; implicit adopter-owned sentinels = `wiki/hot.md`, `wiki/log.md`, `CHANGELOG.md`, `.gaia/VERSION`, `.gaia/manifest.json`.
- Separate `create-gaia` package scaffolded at `../create-gaia/` (zero-dep npm CLI). Not yet a git repo or published.
- CI made fork-safe: secrets fall back to placeholders; Chromatic skips when its token is absent.

## Recent Changes

- New concept pages: [[Release Workflow]], [[Update Workflow]]. [[Claude Integration]] commands table extended. Index updated.

## Active Threads

- PR #26 `feat/release-infrastructure` → `main`: auto-merge pending review + CI green.
- Post-merge: publish `create-gaia@0.1.0` once v1.0.0 is tagged.
- User may want more improvements before first `/gaia-release` tags v1.0.0.
