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
updated: 2026-04-20
---

# Recent Context

## Last Updated

2026-04-20. Branch `feat/gaia-improvements`. Phases A–H complete; PR opening next.

## Key Facts

- Template ships clean: no `things`, `ExampleConsumer/Provider`, IndexPage TechStack/Examples, VitePress `docs/`, auth stack.
- Auth deliberately non-prescriptive; `_session+/` kept as empty hook point with `README.md`.
- New rules: `state-pattern`, `tailwind`, `storybook`, `playwright`. Generalized `api-service` (no `things`/`auth`).
- Wiki rewritten self-contained: [[API Service Pattern]], [[MSW]], [[State]], [[Storybook]], [[Playwright]].
- IndexPage redesigned (editorial layout, i18n-keyed project title).
- `/gaia-init` trimmed 194→113 lines; Chromatic MCP added to Step 8.

## Recent Changes

- Deleted: auth stack, things service, ExampleConsumer/Provider, VitePress, IndexPage TechStack/Examples
- Deps removed: `vitepress`, `remix-auth`, `remix-auth-form`
- Deps kept (non-auth): `spark-md5`, `SESSION_SECRET` (theme/language/remix-toast cookies)

## Active Threads

- None. PR `feat/gaia-improvements` → `main` pending merge.
