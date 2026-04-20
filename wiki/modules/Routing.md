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

GAIA uses [[remix-flat-routes]] on top of [[React Router 7]] for file-based routing. The adapter lives in `app/routes.ts`:

```ts
import {remixRoutesOptionAdapter} from '@react-router/remix-routes-option-adapter';
import {flatRoutes} from 'remix-flat-routes';

export default remixRoutesOptionAdapter((defineRoutes) =>
  flatRoutes('routes', defineRoutes)
);
```

You can switch to standard React Router 7 routing if you prefer.

## Route Groups

Routes are organized using flat-routes folder syntax — `_` prefix + `+` suffix marks a folder as a layout/route group.

| Folder      | Purpose                         | Auth requirement                            |
| ----------- | ------------------------------- | ------------------------------------------- |
| `_public+`  | Home, marketing, public content | none                                        |
| `_auth+`    | Login, register, password reset | redirects authenticated users away          |
| `_session+` | Authenticated app               | redirects unauthenticated users to `_auth+` |
| `_legal+`   | Terms, privacy, company         | none                                        |
| `actions+`  | Root-level form actions (no UI) | varies by action                            |

GAIA ships these `actions+` endpoints out of the box:

- `logout.ts`
- `set-language.ts`
- `set-theme.ts`

See [[Auth Flow]] for redirect semantics.

## Thin Routes Convention

> [!key-insight] Routes are thin
> Route files in `app/routes/` handle only **loader, action, meta, and rendering the page component**. All UI lives in `app/pages/`. This keeps routes easy to scan and pages easy to test in isolation. See [[Thin Routes]].

### Standard route shape

```tsx
// app/routes/_public+/_index.tsx
import type {RouterContextProvider} from 'react-router';
import {useLoaderData} from 'react-router';
import {getInstance} from '~/middleware/i18next';
import IndexPage from '~/pages/Public/IndexPage';
import type {Route} from './+types/_index';

export const loader = async ({context}: Route.LoaderArgs) => {
  const i18next = getInstance(context as RouterContextProvider);
  const title = i18next.t('index.meta.title', {ns: 'pages'});
  const description = i18next.t('index.meta.description', {ns: 'pages'});
  return {description, title};
};

const IndexRoute = () => {
  const {description, title} = useLoaderData<typeof loader>();
  return (
    <>
      <title>{title}</title>
      <meta content={description} name="description" />
      <IndexPage />
    </>
  );
};

export default IndexRoute;
```

## Server-side i18n in loaders

Use `getInstance()` from the i18next middleware to translate meta tags. See [[i18n]].

## Actions

Form actions use [[Conform]] + [[Zod]] for validation: `parseWithZod(formData, {schema})`.

## Scaffolding

- `/new-route` scaffolds a route + page + tests + stories + i18n keys following this exact pattern.
