---
type: module
path: app/pages/
status: active
language: typescript
purpose: Page-specific UI components, organized by route group
created: 2026-04-20
updated: 2026-04-20
tags: [module, pages]
---

# Pages

`app/pages/` holds page-specific components — the UI that the thin route file in `app/routes/` renders.

This is **different** from `app/components/`, which holds shared UI used across pages.

## Structure

| Folder    | Routes it serves                     |
| --------- | ------------------------------------ |
| `Public/` | `_public+` routes (e.g. `IndexPage`) |

When you add auth-guarded pages behind `_session+/`, ask Claude to scaffold a `Session/` folder — `/new-route` handles the wiring. Legal pages typically live as static JSX directly in the route file — no `pages/Legal/` folder by convention.

## Folder pattern

Each page lives in `app/pages/{Group}/{PascalName}/`:

- `index.tsx` — the page component
- `tests/index.test.tsx` — Vitest test using `composeStory`
- `tests/index.stories.tsx` — Storybook story
- Sub-components in their own PascalCase folders (lifted only as high as needed)

See [[Components]] for the same convention applied to shared UI.

## Standard page shape

```tsx
import type {FC} from 'react';
import {useTranslation} from 'react-i18next';

const IndexPage: FC = () => {
  const {t} = useTranslation('pages', {keyPrefix: 'index'});
  return (
    <section className="flex h-full items-center justify-center p-4">
      <h1>{t('title')}</h1>
    </section>
  );
};

export default IndexPage;
```

See [[i18n]] for translation conventions.
