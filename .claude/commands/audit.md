Run the full quality gate as defined in `.claude/rules/quality-gate.md` and report a summary.

## Step 1: Check localization

Scan all files in `app/pages/` and `app/components/` for hardcoded user-facing strings. Flag any string literals in JSX that are not wrapped in `t()` or `useTranslation`. Report findings.

## Step 2: Type checking

```bash
npm run typecheck
```

Record pass/fail.

## Step 3: Linting

```bash
npm run lint
```

Record pass/fail. Must have 0 errors and 0 warnings.

## Step 4: Unit tests

```bash
npm run test -- --run
```

Record pass/fail. Watch for console warnings (missing i18n keys, HydrateFallback, etc.) — these count as failures.

## Step 5: E2E tests

```bash
npm run pw
```

Record pass/fail.

## Step 6: Dev server smoke test

Start the dev server, curl a route, verify no runtime errors:

```bash
npm run dev &
DEV_PID=$!
sleep 5
RESULT=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/)
kill $DEV_PID 2>/dev/null
```

Record pass/fail (expect HTTP 200).

## Step 7: Build

```bash
npm run build
```

Record pass/fail.

## Step 8: Report summary

Present a table:

| Step              | Result |
| ----------------- | ------ |
| Localization      | ...    |
| Type checking     | ...    |
| Linting           | ...    |
| Unit tests        | ...    |
| E2E tests         | ...    |
| Dev server        | ...    |
| Build             | ...    |

For any failures, include the relevant error output. Do NOT attempt to fix issues automatically — report findings and let the user decide next steps.
