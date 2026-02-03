---
title: Components
layout: doc
outline: deep
---

# Components

The `app/components` folder is generally for shared components that are used throughout the application.

GAIA uses the following structure for components folders:

- PascalCase for folder names
- `index.tsx` for the main component file
- `styles.module.css` for component-specific css module styles
- `types.ts` for component types (when necessary)
- `utils.ts` for component utility functions (when necessary)

Within a component folder, you can also add the following folders when necessary:

- `assets` - Component-specific assets
- `hooks` - Component-specific hooks go
- `state` - Component-specific state management (Context/Provider, for example)
- `tests` - Storybook stories and Vitest tests

Child components are placed in their own PascalCase folder inside their parent folder.

The naming conventions for component folders are enforced by ESLint, so components will always be consistent throughout the project.

## Why use this structure?

Co-location is part of the GAIA philosophy. However, having all the files as siblings in a component folder makes things a bit messy.

We discovered that putting test files (Storybook and Vitest) into a dedicated `tests` folder helped keep the component folder files tidy. We extended this to other types of files such as assets, hooks, and state and found that this little bit of organization really helped.

Enforcing this structure with ESLint ensures that all components are built consistently. Eliminating unnecessary variability makes work easier for everyone on the team.

### Lifting Components

A good rule-of-thumb is to "lift" a child component only up to its highest level where it is shared.

This structure makes it easy to find and work with components, and to understand how they are used in the application by where they are placed in the folder hierarchy. It also makes refactoring and moving components around easier and more predictable.

This is not a strict rule. However, we find it is a generally a good practice to follow.

## index.tsx vs Component.tsx

Some developers prefer to name their component files `ComponentName.tsx`. By default, GAIA enforces the `ComponentName/index.tsx` pattern.

If you prefer to use `ComponentName.tsx`, you can configure ESLint to allow this.

## ESLint Configuration

You can customize the above conventions as you see fit by modifying the [check-file/filename-naming-convention](https://github.com/DukeLuo/eslint-plugin-check-file/blob/main/docs/rules/filename-naming-convention.md) rule.

The most important thing is that you enforce consistent naming and structure conventions, whatever they may be.
