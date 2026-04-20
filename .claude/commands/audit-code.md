Run the full quality gate as defined in `.claude/rules/quality-gate.md` and report a summary.

## Step 1: Simplify changed files

Run the `simplify` skill on all changed files — apply every endorsed simplification before proceeding.

## Step 2: Check localization

Scan all files in `app/pages/` and `app/components/` for hardcoded user-facing strings. Flag any string literals in JSX that are not wrapped in `t()` or `useTranslation`. Report findings.

## Step 3: Type checking

```bash
npm run typecheck
```

Record pass/fail.

## Step 4: Linting

```bash
npm run lint
```

Record pass/fail. Must have 0 errors and 0 warnings.

## Step 5: Unit tests

```bash
npm run test -- --run
```

Record pass/fail. Watch for console warnings (missing i18n keys, HydrateFallback, etc.) — these count as failures.

## Step 6: E2E tests

```bash
npm run pw
```

Record pass/fail.

## Step 7: Dev server smoke test

Start the dev server, curl a route, verify no runtime errors:

```bash
npm run dev &
DEV_PID=$!
sleep 5
RESULT=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/)
kill $DEV_PID 2>/dev/null
```

Record pass/fail (expect HTTP 200).

## Step 8: Build

```bash
npm run build
```

Record pass/fail.

## Step 9: Report summary

Present a table:

| Step          | Result |
| ------------- | ------ |
| Simplify      | ...    |
| Localization  | ...    |
| Type checking | ...    |
| Linting       | ...    |
| Unit tests    | ...    |
| E2E tests     | ...    |
| Dev server    | ...    |
| Build         | ...    |

For any failures, include the relevant error output. Do NOT attempt to fix issues automatically — report findings and let the user decide next steps.
