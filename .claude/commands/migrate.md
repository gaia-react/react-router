Upgrade a supported package to its latest version, apply breaking changes, and run the quality gate.

## Step 1: Gather user input

Ask the user using AskUserQuestion:

- Which package(s) to upgrade? (options: `react-router`, `tailwindcss`, `storybook`, `vitest`, `playwright`, `eslint`, or a comma-separated list)

IMPORTANT!!! Eslint 10.x is incompatible with some of the installed eslint plugins. Stay on 9.x for now. Do not offer or attempt to upgrade `eslint` or `@eslint/js`.

## Step 2: For each selected package

### 2a: Check current and latest versions

```bash
npm outdated {packageName}
```

If already on latest, report and skip. Record the current version and the latest version.

### 2b: Determine if major bump

Compare major versions. If major bump detected, fetch the changelog/migration guide.

Use the following sources per package:

| Package      | Migration guide source                                                   | Changelog (authoritative for unstable/breaking changes) |
| ------------ | ------------------------------------------------------------------------ | ------------------------------------------------------- |
| react-router | `https://reactrouter.com/upgrading/v7` or relevant version path          | `https://github.com/remix-run/react-router/blob/main/CHANGELOG.md` |
| tailwindcss  | `https://tailwindcss.com/docs/upgrade-guide`                             | `https://github.com/tailwindlabs/tailwindcss/releases` |
| storybook    | `https://storybook.js.org/docs/migration-guide`                          | `https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md` |
| vitest       | `https://vitest.dev/guide/migration`                                     | `https://github.com/vitest-dev/vitest/releases` |
| playwright   | `https://playwright.dev/docs/release-notes`                              | `https://github.com/microsoft/playwright/releases` |
| eslint       | `https://eslint.org/docs/latest/use/migrate-to-X` (replace X with major) | `https://github.com/eslint/eslint/blob/main/CHANGELOG.md` |

Fetch the migration guide AND scan the changelog for the bumped version. The changelog catches unstable or breaking changes in a point release that the migration guide may not yet reflect. Use `WebFetch` for both, or summarize known breaking changes from your training data.

### 2c: Update package.json

```bash
npm install {packageName}@latest
```

For packages with companion packages (e.g. `@storybook/*`, `@playwright/test`, `@vitest/*`), update all related packages together.

Known companion packages:

- **react-router**: also check `react-router-dom`, `@react-router/dev`, `@react-router/node`, `@react-router/serve`, `@react-router/fs-routes`, `@react-router/remix-routes-option-adapter`
- **storybook**: run `npx storybook@latest upgrade` instead of manual npm install
- **vitest**: also update `@vitest/coverage-v8`, `@vitest/ui` if present
- **playwright**: also update `@playwright/test`
- **tailwindcss**: also check `@tailwindcss/vite` if present
- **eslint**: also check all `eslint-plugin-*` and `eslint-config-*` packages

### 2d: Clean install

```bash
rm -rf node_modules && npm install
```

### 2e: Apply breaking changes

If a major bump was detected, apply known breaking changes:

1. Read the migration guide from step 2b
2. Search the codebase for affected patterns using Grep
3. Apply necessary code changes
4. Document what was changed

### 2f: Run quality gate

Run each step sequentially, stopping on failure:

```bash
npm run typecheck
npm run lint
npm run test -- --run
npm run pw
npm run build
```

If any step fails, analyze the error and attempt to fix it. Common post-upgrade fixes:

- Updated import paths
- Renamed/removed APIs
- Changed configuration format
- New required fields

After fixing, re-run the failing step. Repeat until all pass or the issue requires user input.

## Step 3: Report summary

Present results per package:

| Package      | From  | To    | Breaking changes | Quality gate |
| ------------ | ----- | ----- | ---------------- | ------------ |
| react-router | 7.1.0 | 7.2.0 | None             | PASS         |
| storybook    | 8.5.0 | 9.0.0 | 3 applied        | PASS         |

List any breaking changes that were applied and any issues that need manual attention.
