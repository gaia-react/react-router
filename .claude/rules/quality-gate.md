---
paths:
  - 'app/**/*'
  - 'test/**/*'
---

# Quality Gate Process

1. All user-facing strings must be localized - no hardcoded strings or keys without values
2. Run `npm run typecheck` — must pass with no errors
3. Run `npm run lint` — must pass with 0 errors, 0 warnings
4. Run `npm run test -- --run` — all tests must pass, **zero console warnings** (fix missing keys, HydrateFallback, etc.)
5. Run `npm run pw` — all Playwright E2E tests must pass
6. **Start dev server and curl a route** — verify no runtime errors (e.g. missing exports, SSR failures)
7. Run `npm run build` — confirm the application builds successfully
8. **Fix all warnings/issues before presenting to user** — never ask user to review with known warnings
9. **STOP and report results to the user** — do NOT proceed until the user reviews and approves
