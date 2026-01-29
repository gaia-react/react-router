---
title: Visual
layout: doc
outline: deep
---

# Storybook and Chromatic

For visual testing, GAIA comes with Storybook and Chromatic pre-configured.

## Storybook

[Component-Driven Development](https://www.componentdriven.org/) is a proven methodology for building web applications. It involves breaking down the UI into small, reusable components that can be developed, tested, and documented in isolation. This makes it easier to build, maintain, and scale applications.

GAIA's [Storybook](https://storybook.js.org/) comes with has many helpful features setup and ready to go.

Storybook is configured to look for stories anywhere in the `app` folder, following the `*.stories.tsx` pattern.

### Environment variable support

The setup for supporting environment variables in Storybook is done. As you modify your env vars, you'll need to make changes to these two files.

- `.storybook/main.ts` - In the `viteFinal` function, the various environment variables are added to the `define` object.
- `.storybook/env.ts` - The environment variables assigned in `main.ts` are applied to the window.process.env object.

### react-i18next support

The [storybook-react-i18next](https://github.com/stevensacks/storybook-react-i18next#readme) addon is included, which allows you to switch languages in Storybook. Follow the addon's instructions to configure it for your project.

The `.storybook/i18next.ts` file imports your i18n setup from the main project, including the language strings. This is applied in the `preview.ts` file.

### Wrap Decorator

GAIA sets Storybook layout to `fullscreen`. This is so you can preview components which take up the entire screen. However, this means all components will render in the top left corner.

To compensate for this, you want to add some padding, max width, etc. around the component story. Rather than having to write this yourself in every story, GAIA includes a decorator that you can use to do this.

In your story files `meta` object, add a parameter `wrap` and set it to the Tailwind classes you want to use, and the decorator will wrap your story in a div with those classes.

The most common one to use is `wrap: 'p-4'` which will add padding of `1rem` around the component.

There are examples of this in use throughout the project.


### Google Fonts

Google Fonts are preloaded in the `.storybook/preview-head.html` file.  You can modify or remove which fonts are loaded by modifying this file.


## Chromatic

[Chromatic](https://www.chromatic.com/) is a visual testing tool that integrates with Storybook. It allows you to see visual changes in your components and stories.

To get it working, all you need to do is login to Chromatic, and follow the instructions to add your `CHROMATIC_PROJECT_TOKEN` to your GitHub repository secrets.

If you are using a different CI/CD service than GitHub actions, you'll need to make the required changes.

### Opt-Out

If you don't want to use Chromatic, you need to make the following changes:

Uninstall these packages:
```sh
npm un -D chromatic && npm un -D @chromatic-com/storybook
```

Delete these:
- `.github/workflows/chromatic.yml`
- `.storybook/chromatic`

Edit `.storybook/preview.ts`
```ts
import {decorators} from './chromatic'; // delete this import
import WrapDecorator from './decorators/WrapDecorator'; // add this import

// in the preview object set decorators:
decorators: [WrapDecorator]
    
// and delete this line:
chromatic: {viewports: [1280]}
```

Remove `chromatic: {disableSnapshot: true},` from any stories which have it.
