---
type: module
path: app/routes/
status: active
language: typescript
purpose: File-based routing using remix-flat-routes on top of React Router 7
depends_on: [[remix-flat-routes]], [[React Router 7]]
created: 2026-04-20
updated: 2026-04-20
tags: [module, routing]
---

# Routing

GAIA uses [[remix-flat-routes]] on top of [[React Router 7]] for file-based routing. The adapter lives in `app/routes.ts` (see that file for the verbatim implementation). You can switch to standard React Router 7 routing if you prefer.

## Route Groups

Routes are organized using flat-routes folder syntax — `_` prefix + `+` suffix marks a folder as a layout/route group.

| Folder      | Purpose                         | Auth requirement                      |
| ----------- | ------------------------------- | ------------------------------------- |
| `_public+`  | Home, marketing, public content | none                                  |
| `_session+` | Hook point for auth-guarded app | stub — add your own guard loader here |
| `_legal+`   | Terms of service, privacy       | none                                  |
| `actions+`  | Root-level form actions (no UI) | varies by action                      |

GAIA ships these `actions+` endpoints out of the box:

- `set-language.ts`
- `set-theme.ts`

## `_session+/` hook point

`app/routes/_session+/_layout.tsx` is an intentionally empty stub. Add a loader that throws `redirect('/login')` if the user is not authenticated. All routes nested under `_session+/` inherit the guard. Choose any auth provider: Supabase, Clerk, Auth0, custom sessions, etc.

## Thin Routes Convention

> [!key-insight] Routes are thin
> Route files in `app/routes/` handle only **loader, action, meta, and rendering the page component**. All UI lives in `app/pages/`. This keeps routes easy to scan and pages easy to test in isolation. See [[Thin Routes]].

`/new-route` scaffolds routes in this shape. The scaffold output includes:

| File                                               | Contents                                                                  |
| -------------------------------------------------- | ------------------------------------------------------------------------- |
| `app/routes/{group}/{name}.tsx`                    | Loader (with server-side i18n for meta), route component, `useLoaderData` |
| `app/pages/{Group}/{Name}/index.tsx`               | Page component with `useTranslation`                                      |
| `app/pages/{Group}/{Name}/tests/index.test.tsx`    | Vitest test via `composeStory`                                            |
| `app/pages/{Group}/{Name}/tests/index.stories.tsx` | Storybook story                                                           |
| `app/languages/en/pages/{name}.ts` + other locales | i18n keys                                                                 |

## Server-side i18n in loaders

Use `getInstance()` from the i18next middleware to translate meta tags. See [[i18n]].

## Actions

Form actions use [[Conform]] + [[Zod]] for validation: `parseWithZod(formData, {schema})`.

## Scaffolding

- `/new-route` scaffolds a route + page + tests + stories + i18n keys following this exact pattern.
