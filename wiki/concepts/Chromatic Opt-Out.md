---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, testing]
---

# Chromatic Opt-Out

If you don't want visual regression via [[Chromatic]]:

```sh
npm un -D chromatic && npm un -D @chromatic-com/storybook
```

Delete:

- `.github/workflows/chromatic.yml`
- `.storybook/chromatic`

Edit `.storybook/preview.ts`:

```ts
import {decorators} from './chromatic'; // delete
import WrapDecorator from './decorators/WrapDecorator'; // add

decorators: [WrapDecorator];
// remove the chromatic viewport block
```

Remove `chromatic: {disableSnapshot: true}` from any stories that have it.
