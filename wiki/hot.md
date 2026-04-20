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
updated: 2026-04-20T00:00:00

---

# Recent Context

## Last Updated

2026-04-20. Branch `chore/claude-optimizations`. Just finished deep ingest of `app/components/Form/*` and `app/services/gaia/things/*` before `/gaia-init` strips the example. Vault now at 76 pages.

## Recent Changes

- Created: [[Form Field]], [[Form Text Inputs]], [[Form Select]], [[Form YearMonthDay]], [[Form Choices]], [[Form Layout]], [[things Service]]
- Updated: [[Form Components]] (deep-dive column), [[Services]], [[API Service Pattern]], [[index]], [[log]]
- Key find: YearMonthDay's Conform integration has two gotchas — native stopPropagation on container div (React synthetic delegation routes through `document`) and hidden input DOM-value sync before `onChange`. Documented in [[Form YearMonthDay]].

## Active Threads

- None open — Form + things deep ingest complete. Next suggestion: ingest flows directory (`wiki/flows/`) sources or add E2E test patterns page if [[Playwright]] tests grow.
