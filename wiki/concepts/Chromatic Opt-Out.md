---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, testing]
---

# Chromatic Opt-Out

Ask Claude to remove visual regression via [[Chromatic]]. Claude will run through the steps below; they're documented here so the opt-out is traceable and reviewable.

```sh
npm un -D chromatic && npm un -D @chromatic-com/storybook
```

Files to delete:

- `.github/workflows/chromatic.yml`
- `.storybook/chromatic`

Edits to `.storybook/preview.ts`:

```ts
import {decorators} from './chromatic'; // delete
import WrapDecorator from './decorators/WrapDecorator'; // add

decorators: [WrapDecorator];
// remove the chromatic viewport block
```

Strip `chromatic: {disableSnapshot: true}` from any stories that have it.
