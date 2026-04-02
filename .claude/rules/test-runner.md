# Test Runner

**NEVER** run bare `npm test` in CI contexts — it starts watch mode.

Always use:

- `npm run test` — runs vitest (watch mode)
- `npm run test -- --run` — runs vitest once (CI-style)
