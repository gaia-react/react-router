---
title: Code Quality
layout: doc
outline: deep
---

# Code Quality

Maintaining code quality is core to the philosophy of GAIA. Having a robust set of rules and tools to keep your code clean and consistent is the most important part of any project.

It prevents tech debt from accumulating, helps everyone work together better, makes it easier for new developers to onboard, and makes you a better developer.

[Read more](https://react-japan.dev/en/blog/eslint-fix-on-save) about the philosophy behind GAIA's code quality setup.

## Linting

GAIA comes with these libraries to keep your code clean and consistent.

- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Stylelint](https://stylelint.io/)

Additionally, GAIA comes with [husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged) to lint changed code on commit.

## ESLint

GAIA comes with a robust set of plugins and rules to keep your code clean and consistent.

All the rules being used are available in the `eslint.config.mjs` file. You can modify them to suit your needs. As outlined in the article, the most important thing is you have consistent rules, whatever they might be.

## Setup Fix on Save

You need to set up your IDE to run ESLint, Prettier and Stylelint to fix on save.

### JetBrains IDE (WebStorm, etc.)

1. Open Settings `(⌘ + ,)` or `Ctrl + Alt + S` on Windows
2. Select Languages & Frameworks > Code Quality Tools > ESLint
3. Check the box next to “Run eslint —fix”
4. While you're here check the boxes next to "Prettier" and "Stylelint" to enable them as well.

### VS Code

If you are using [ESLint extension](https://github.com/Microsoft/vscode-eslint) for VS Code open your `settings.json` file:

1. Press `⌘ + Shift + P` or `Ctrl + Shift + P` on Windows.
2. Type “Open User Settings (JSON)“
3. Add the following code to your `settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  }
}
```

### Vim

If you are using [ALE Vim plugin](https://github.com/dense-analysis/ale) add the following code to your `.vimrc`:

```sh
let g:ale_fix_on_save = 1
```

## TypeScript

[TypeScript](https://www.typescriptlang.org/) is an industry-standard way of building frontend projects.

GAIA comes with TypeScript support out of the box.
