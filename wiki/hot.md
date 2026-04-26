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

2026-04-26. Branch `feat/dark-mode-update` — rewrote dark mode using the Epic Stack pattern (cookie + client hints + optimistic fetcher). PR #34 open.

## Key Facts

- Dark-mode source of truth is the `__theme` cookie (read via `app/utils/theme.server.ts`, the plain `cookie` package). React no longer holds theme state.
- `app/utils/client-hints.tsx` wraps `@epic-web/client-hints`; `<ClientHintCheck/>` in `<head>` subscribes to `prefers-color-scheme` changes and calls `useRevalidator().revalidate()`.
- `app/routes/resources+/theme-switch.tsx` is the action + `useOptionalTheme`/`useOptimisticThemeMode` hooks + `ThemeSwitch` UI, co-located.
- Cycle is 3-state (`system → light → dark → system`) with distinct desktop/sun/moon icons.
- `app/state/index.tsx` is now a passthrough — no global state slices ship.
- Removed: `app/state/theme.tsx`, `app/sessions.server/theme.ts`, `app/routes/actions+/set-theme.ts`, `app/components/ThemeSwitcher/`.

## Recent Changes

- New ADR: [[Dark Mode Modernization]]. Updated: [[Theme Flow]], [[Styles]], [[Sessions]], [[State]], [[Components]], [[index]], [[hot]], [[log]]. New deps: `@epic-web/client-hints@1.3.9`, `cookie@1.1.1`.

## Active Threads

- PR #34 open with 2 commits (dark-mode rewrite + chore wiki/migrate prettier reformat). Awaiting review/merge.
