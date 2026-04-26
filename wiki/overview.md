---
type: overview
title: GAIA React Router Overview
status: mature
created: 2026-04-20
updated: 2026-04-20
tags: [overview, gaia]
---

# GAIA React Router

GAIA React is the most thoroughly configured [React Router 7](https://reactrouter.com/) template available. It exists to eliminate the multi-day setup tax on new projects: linting, testing, i18n, CI, pre-commit hooks, dark mode, Storybook, MSW, and Claude Code integration are all wired together and working — not just installed.

It is the spiritual successor to the **GAIA Flash Framework**, the most popular Flash framework in the world (used to build 100K+ Flash sites). GAIA React has been refined over 4+ years across multiple production teams.

## Philosophy

> [!key-insight] Base template, not full-stack kit
> GAIA deliberately ships **no component library**. You choose what fits. The value is in infrastructure and developer experience that every project needs but nobody wants to set up twice. Every tool is pre-configured but **removable**.

See [[GAIA Philosophy]] for the long version.

## Tech Stack at a Glance

- **Framework**: [[React Router 7]] (SSR, file-based routing via [[remix-flat-routes]])
- **Forms**: [[Conform]] + [[Zod]] — the star of the template, see [[Form Components]]
- **Styling**: [[Tailwind]] v4 with `tailwind-merge`, plus [[FontAwesome]] icons
- **i18n**: [[remix-i18next]] with TypeScript language files (not JSON)
- **State**: Plain React Context+Provider (Theme)
- **Testing**: [[Vitest]] + [[React Testing Library]] + [[Playwright]] + [[Chromatic]] — all sharing one MSW mocking layer
- **Mocking**: [[MSW]] + `@mswjs/data` for tests, Storybook, and dev
- **Storybook** v10 with React Router, i18n, dark mode, MSW addons
- **Quality**: 20+ ESLint plugins, Prettier, Stylelint, [[Husky]] pre-commit hooks
- **Claude Code**: [[Claude Integration]] with commands, rules, hooks, agents

## Top-Level Architecture

```
app/
├── assets/           images, svgs
├── components/       shared UI (Button, Form/*, Toast, Layout, ...)
├── hooks/            useBreakpoint, useComponentRect, useTimeout
├── languages/        TS-based i18n (en, ja by default)
├── middleware/       i18next middleware
├── pages/            page-specific UI (Auth, Public, Session)
├── routes/           thin route files (loader/action only)
├── services/         api wrapper (Ky) + gaia/* domain services
├── sessions.server/  cookie sessions (language, theme)
├── state/            React Context providers
├── styles/           tailwind.css
├── types/            global TS types
├── utils/            pure helpers (date, dom, http, string, ...)
├── root.tsx          root layout, i18n hookup, theme, toast
├── routes.ts         flat-routes adapter
└── env.server.ts     Zod-validated env vars
```

See [[Folder Structure]] for the full breakdown.

## Route Groups (remix-flat-routes)

- `_public+` — unauthenticated pages
- `_session+` — hook point for auth-guarded pages (empty stub; add your own auth guard)
- `_legal+` — terms, privacy, etc.
- `actions+` — root-level form actions (set-language, set-theme)

See [[Routing]].

## Quality Gate

Every change passes through [[Quality Gate]]: typecheck → lint → unit test → E2E → dev smoke → build. Pre-commit hooks enforce a subset on every commit; the `/audit-code` command runs the full pipeline. **Zero tolerance for warnings.**

## Knowledge Hygiene

`/audit-knowledge` runs a two-stage audit (Opus researches → Sonnet applies) over memory, wiki, auto-loaded `CLAUDE.md` files, and `.claude/rules/`. Flags duplication, stale entries, broken wikilinks, and auto-load bloat — with wiki as the source of truth. See [[Audit-Knowledge Command]].

## What's Different vs. Other Templates

| Feature            |           GAIA            | Vite React | RR Template | Next.js |
| ------------------ | :-----------------------: | :--------: | :---------: | :-----: |
| ESLint             |        20+ plugins        |   basic    |    basic    |  basic  |
| Pre-commit hooks   |  typecheck + lint + test  |     —      |      —      |    —    |
| Unit + integration |       Vitest + RTL        |     —      |      —      |    —    |
| E2E                |        Playwright         |     —      |      —      |    —    |
| Visual regression  |       Chromatic CI        |     —      |      —      |    —    |
| i18n examples      |          2 langs          |     —      |      —      |    —    |
| Form validation    |       Conform + Zod       |     —      |      —      |    —    |
| Dark mode          |        end-to-end         |     —      |      —      |    —    |
| API mocking        |      MSW everywhere       |     —      |      —      |    —    |
| Claude Code        | commands + rules + agents |     —      |      —      |    —    |

## Where to Go Next

- [[GAIA Philosophy]] — the **why**
- [[Folder Structure]] — the **what**
- [[Quality Gate]] — the **how we keep it clean**
- [[Claude Integration]] — the **how Claude collaborates**
- [[Form Components]] — the star feature
