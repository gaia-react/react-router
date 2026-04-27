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
updated: 2026-04-27
tags: [meta]

---

# Recent Context

## Last Updated

2026-04-27. Branch `feat/update-msw-data-and-eslint`.

## Key Facts

- `@mswjs/data` replaced by `@msw/data@1.1.5`. `database.ts` is now a `Collection` re-export barrel with async `resetTestData()`.
- ESLint overhaul: inlined `eslint-plugin-typescript-enum` + `eslint-plugin-no-switch-statements` as local plugins; replaced `eslint-plugin-eslint-comments` with `@eslint-community` fork; dropped `eslint-plugin-jest-formatting`; wired `eslint-plugin-testing-library` (flat/react, 22 rules on test files); activated `eslint-plugin-jest-dom` (flat/recommended); enabled `eslint-plugin-you-dont-need-lodash-underscore` compatible config (73 rules).
- Theme state fully removed — `app/state/index.tsx` is a passthrough. Theme is cookie-based (Epic Stack pattern, landed 2026-04-26).

## Recent Changes

- Updated: [[MSW Handlers]], [[MSW]], [[Storybook Stories]], [[Testing]], [[ESLint Fixes]], [[API Service Pattern]], [[overview]], [[log]]. New rule patterns: `you-dont-need-lodash-underscore`, `testing-library`, `jest-dom`.

## Active Threads

- Wiki lint run 2026-04-27 complete; all issues fixed.
