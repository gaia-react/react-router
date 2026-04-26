---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-21
tags: [concept, testing]
---

# Chromatic Opt-Out

Ask Claude to walk through the opt-out steps. The procedure involves uninstalling `chromatic` and `@chromatic-com/storybook`, deleting the GitHub workflow and `.storybook/chromatic/` folder, and updating `.storybook/preview.ts` to use `WrapDecorator` directly.

See [[Chromatic]] for the full removal flow.
