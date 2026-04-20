---
name: tdd
description: Test-driven development with red-green-refactor loop. Use when user wants to build features or fix bugs using TDD, mentions "red-green-refactor", wants integration tests, or asks for test-first development. Tailored for GAIA — Vitest, React Testing Library, Storybook composeStory, MSW.
---

# Test-Driven Development (GAIA)

## Philosophy

**Core principle**: tests should verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't.

**Good tests** are integration-style: they exercise real code paths through public APIs. They describe _what_ the system does, not _how_ it does it. A good test reads like a specification — "user submits a valid form and sees a success toast" tells you exactly what capability exists. These tests survive refactors because they don't care about internal structure.

**Bad tests** are coupled to implementation. They mock internal collaborators, assert on `t()` call signatures, spy on `useState` setters, or query MSW handler internals. The warning sign: your test breaks when you refactor, but behavior hasn't changed.

See [tests.md](tests.md) for GAIA-native examples and [mocking.md](mocking.md) for mocking guidelines.

## GAIA testing layers

Four layers share one mocking foundation (`msw` + `msw/data`). Each has a natural TDD rhythm:

| Layer | Tool | Runner | File location | What to assert |
| --- | --- | --- | --- | --- |
| Unit / hook | RTL `renderHook` | Vitest | `app/hooks/<name>/tests/` | hook return values, state transitions, callbacks |
| Component | RTL + Storybook `composeStory` | Vitest | `app/components/<Name>/tests/` | rendered DOM, user interactions, props behavior |
| Service | MSW handlers + Zod | Vitest | `app/services/<name>/tests/` | parsed response shape, request payload, error cases |
| E2E | Playwright + MSW browser | Playwright | `.playwright/e2e/*.spec.ts` | full user flow across routes |

Write the test at the **lowest layer that can verify the behavior.** A button's disabled state is a component test, not an E2E. A route's redirect is E2E; a loader's parsing is a service test.

See `.claude/rules/component-testing.md` for the `composeStory` contract and `.claude/rules/api-service.md` for service-test conventions.

## Anti-Pattern: Horizontal Slices

**DO NOT write all tests first, then all implementation.** This is "horizontal slicing" — treating RED as "write all tests" and GREEN as "write all code."

This produces **crap tests**:

- Tests written in bulk test _imagined_ behavior, not _actual_ behavior
- You end up testing the _shape_ of things (prop types, handler signatures) rather than user-facing behavior
- Tests become insensitive to real changes — they pass when behavior breaks, fail when behavior is fine
- You outrun your headlights, committing to test structure before understanding the implementation

**Correct approach**: vertical slices via tracer bullets. One test → one implementation → repeat. Each test responds to what you learned from the previous cycle.

```
WRONG (horizontal):
  RED:   test1, test2, test3, test4, test5
  GREEN: impl1, impl2, impl3, impl4, impl5

RIGHT (vertical):
  RED→GREEN: test1→impl1
  RED→GREEN: test2→impl2
  RED→GREEN: test3→impl3
  ...
```

## Workflow

### 1. Planning

Before writing any code:

- [ ] Confirm with user which layer owns this test (hook, component, service, e2e)
- [ ] Confirm which behaviors to test (prioritize)
- [ ] Identify opportunities for [deep modules](deep-modules.md) — small interface, deep implementation
- [ ] Design interfaces for [testability](interface-design.md)
- [ ] List the behaviors to test (not implementation steps)
- [ ] Get user approval on the plan

Ask: "What should the public interface look like? Which behaviors are most important to test?"

**You can't test everything.** Focus testing effort on critical paths and complex logic, not every possible edge case.

### 2. Tracer Bullet

Write ONE test that confirms ONE thing about the system end-to-end for this layer:

```
RED:   Write test for first behavior → test fails
GREEN: Write minimal code to pass → test passes
```

For components, the tracer bullet is almost always: `composeStory(Default)` renders without throwing. For services, it's: the happy-path request returns a Zod-parsed result.

### 3. Incremental Loop

For each remaining behavior:

```
RED:   Write next test → fails
GREEN: Minimal code to pass → passes
```

Rules:

- One test at a time
- Only enough code to pass current test
- Don't anticipate future tests
- Keep tests focused on observable behavior

### 4. Refactor

After all tests pass, look for [refactor candidates](refactoring.md):

- [ ] Extract duplication
- [ ] Deepen modules (move complexity behind simple interfaces)
- [ ] Apply SOLID principles where natural
- [ ] Consider what new code reveals about existing code
- [ ] Run tests after each refactor step

**Never refactor while RED.** Get to GREEN first.

## Checklist Per Cycle

```
[ ] Test describes behavior, not implementation
[ ] Test uses public interface only (no spying on internals, no asserting on t() args)
[ ] Test would survive an internal refactor
[ ] Code is minimal for this test
[ ] No speculative features added
[ ] Mock only at system boundaries (APIs via MSW, time, navigation)
```
