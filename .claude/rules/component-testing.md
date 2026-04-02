---
paths:
  - 'app/**/tests/**'
  - 'test/**'
---

# Component Testing Pattern

Always use Storybook stories with `composeStory` for component tests. Never manually mock dependencies like `react-router` or `react-i18next`.

## Pattern

### 1. Create a stories file in the component's `tests/` folder

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

### 2. Use `composeStory` in the test file

```tsx
// app/components/MyComponent/tests/index.test.tsx
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

## Available Stubs

Located in `test/stubs/`:

- `stubs.reactRouter()` - Provides React Router context (Form, useNavigation, etc.)
- `stubs.state()` - Provides global state context

## When to Mock

Only mock **external services** or **utilities** that your component directly imports:

```tsx
// GOOD - Mock utilities that component imports
vi.mock('~/utils/onboarding-storage', () => ({
  getStepData: vi.fn(() => null),
  saveOnboardingStep: vi.fn(),
}));
```

```tsx
// BAD - Don't mock framework dependencies
vi.mock('react-router', () => ({...}));      // Use stubs.reactRouter() instead
vi.mock('react-i18next', () => ({...}));     // Handled by test setup
```

## Testing Forms with Conform

For components using `@conform-to/react`, create a story that wraps the component with `useForm`:

```tsx
export const Default: StoryFn = () => {
  const [form, fields] = useForm({
    onValidate: ({formData}) => parseWithZod(formData, {schema}),
  });

  return (
    <Form {...getFormProps(form)}>
      <MyFormComponent fields={fields} />
    </Form>
  );
};
```

### CRITICAL: Using Custom Form Components with Conform

When using custom form components (like `YearMonthDay`, `TimePicker`, etc.) that manage their own internal state, you **must** use `useInputControl` to properly integrate them with Conform's validation state:

```tsx
// BAD - Local state conflicts with Conform's validation
const [value, setValue] = useState(savedData?.field ?? DEFAULT);
const handleChange = useCallback((newValue) => {
  setValue(newValue);
}, []);

<CustomComponent onChange={handleChange} value={value} />;

// GOOD - useInputControl keeps component synced with Conform
const fieldControl = useInputControl(fields.fieldName);

<CustomComponent
  onBlur={fieldControl.blur}
  onChange={fieldControl.change}
  value={fieldControl.value ?? DEFAULT}
/>;
```

**Why this matters**: When validation fails, Conform takes control of the field value. If you use local `useState`, the component becomes disconnected from Conform's state and stops responding to changes after validation errors occur.

## Example: YearMonthDay

See `app/components/Form/YearMonthDay/tests/` for a complete example of this pattern in action.
