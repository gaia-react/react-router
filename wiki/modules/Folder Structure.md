---
type: module
path: app/
status: active
language: typescript
purpose: Top-level folder layout of the GAIA app
created: 2026-04-20
updated: 2026-04-20
tags: [module, structure]
---

# Folder Structure

Inside `app/`:

| Folder             | Purpose                                    | Wiki page      |
| ------------------ | ------------------------------------------ | -------------- |
| `assets/`          | Global images / svgs                       | —              |
| `components/`      | Shared UI components                       | [[Components]] |
| `hooks/`           | Global custom hooks                        | [[Hooks]]      |
| `languages/`       | TypeScript-based i18n strings              | [[i18n]]       |
| `middleware/`      | React Router 7 middleware (i18next)        | [[Middleware]] |
| `pages/`           | Page-specific UI, organized by route group | [[Pages]]      |
| `routes/`          | Thin route files (loader/action only)      | [[Routing]]    |
| `services/`        | API wrapper + domain services              | [[Services]]   |
| `sessions.server/` | Cookie session storage (language, theme)   | [[Sessions]]   |
| `state/`           | Context+Provider state                     | [[State]]      |
| `styles/`          | `tailwind.css`                             | [[Styles]]     |
| `types/`           | Global TS types                            | —              |
| `utils/`           | Pure helpers                               | [[Utils]]      |

## Root files

- `entry.client.tsx`, `entry.server.tsx` — required by React Router. Pre-wired for i18n, env vars, and MSW.
- `root.tsx` — root document/layout: i18n hookup, theme, toast.
- `env.server.ts` — Zod-validated env vars.
- `i18n.ts` — i18n setup.
- `routes.ts` — flat-routes adapter.
