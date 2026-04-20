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

Always use Storybook stories with `composeStory`. Never manually mock framework deps like `react-router` or `react-i18next`.

### Story file

```tsx
// app/components/MyComponent/tests/index.stories.tsx
import type {Meta, StoryFn} from '@storybook/react-vite';
import stubs from 'test/stubs';
import MyComponent from '..';

const meta: Meta = {
  component: MyComponent,
  decorators: [stubs.reactRouter()],
};

export default meta;

export const Default: StoryFn = () => <MyComponent />;
```

### Test file

```tsx
import {composeStory} from '@storybook/react-vite';
import {describe, expect, it} from 'vitest';
import {render, screen} from 'test/rtl';
import Meta, {Default} from './index.stories';

const MyComponent = composeStory(Default, Meta);

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
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
