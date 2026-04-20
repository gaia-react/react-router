---
type: dependency
status: active
package: "@testing-library/react"
version: 16.3.2
role: integration-testing
created: 2026-04-20
updated: 2026-04-20
tags: [dependency, testing]
---

# React Testing Library

Used with [[Vitest]] for component/integration tests. GAIA wraps it in `test/rtl.tsx` to:

- Auto-cleanup after each test
- Render with i18n provider configured
- Re-export `render`, `screen`, etc.

Tests should `import {render, screen} from 'test/rtl'` (not directly from the library).

See [[Component Testing]], [[Testing]].
