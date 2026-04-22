---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, testing]
---

# Component Testing

Source: `.claude/rules/component-testing.md`.

## Pattern

Always use Storybook stories with `composeStory`. Never manually mock framework deps like `react-router` or `react-i18next`. `/new-component` scaffolds both files.

| File                      | What it contains                                      |
| ------------------------- | ----------------------------------------------------- |
| `tests/index.stories.tsx` | `Meta` + named `StoryFn` exports; stubs as decorators |
| `tests/index.test.tsx`    | `composeStory(Story, Meta)` → render → assertions     |

```tsx
const MyComponent = composeStory(Default, Meta);
render(<MyComponent />);
expect(screen.getByText('Hello')).toBeInTheDocument();
```

## Stubs

`test/stubs/`:

- `stubs.reactRouter()` — React Router context (Form, useNavigation)
- `stubs.state()` — global State context

## When to mock

Only mock **external services** or **utilities** the component imports directly. Never mock framework deps.

## Custom Conform inputs

Stateful custom form components MUST use `useInputControl` to stay in sync with Conform validation state. See [[Form Components]] § warning.

## Reference example

`app/components/Form/YearMonthDay/tests/`
