---
paths:
  - 'app/routes/**/*'
  - 'app/pages/**/*'
---

# New Route Pattern

## Route Files Are Thin

Route files in `app/routes/` handle only: loader, action, meta (via loader), and rendering the page component. All UI lives in `app/pages/`.

## Route Groups

Uses remix-flat-routes conventions with `+` suffix folders:

- `_public+` — unauthenticated pages
- `_auth+` — login, register, forgot password
- `_session+` — authenticated pages
- `_legal+` — terms, privacy, etc.
- `actions+` — form action endpoints

## Page Components

Place in `app/pages/{Group}/{PascalName}Page/index.tsx`:

- `app/pages/Public/IndexPage/`
- `app/pages/Auth/LoginPage/`
- `app/pages/Session/Profile/ProfilePage/`

## Meta Tags

Set meta in the loader using server-side i18n, render in the route component:

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

## i18n

All user-facing strings use `useTranslation()` with `keyPrefix`. Add keys to all language files under `app/languages/`.

## Actions

Use Zod + Conform for form validation in actions. Parse with `parseWithZod(formData, {schema})`.
