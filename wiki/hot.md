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

2026-04-26. Branch `chore/update-claude-obsidian` — claude-obsidian v1.4.3 → v1.6.0 sync; Mode B+E formalized; DragonScale declined.

## Key Facts

- Plugin baseline pinned to claude-obsidian v1.6.0 (global install, not vendored). Upgrade requires `claude plugin uninstall` + `install` to flip the cache pin.
- Wiki mode declared formally in `wiki/README.md`: `Mode: B (Codebase) + E (Research)`, matching upstream `references/modes.md`.
- DragonScale (4 mechanisms — fold, addresses, tiling, boundary autoresearch) explicitly opt-out for GAIA. `address: c-NNNNNN` frontmatter forbidden. Adopters can opt in per fork.
- Wiki hooks remain GAIA-owned in `.claude/hooks/`; not delegated to plugin `hooks.json`.

## Recent Changes

- New ADR: [[DragonScale Opt-Out]]. Updated [[Claude Integration Conventions]] (Wiki vendor relationship), [[Claude Skills]] (Plugin skills), [[index]], `wiki/README.md`, `CHANGELOG.md`.

## Active Threads

- Docs pass complete; no commit yet — awaiting review.
