# Good and Bad Tests (GAIA)

## Component tests via `composeStory`

The story is the test's source of truth. Stub i18n and router via `test/stubs`; never `vi.mock('react-router')` or `vi.mock('react-i18next')`.

```tsx
// app/components/PriceTag/tests/index.stories.tsx
import type {Meta, StoryFn} from '@storybook/react-vite';
import PriceTag from '..';

const meta: Meta = {component: PriceTag};
export default meta;

export const Default: StoryFn = () => <PriceTag amount={4999} currency="USD" />;
export const Discounted: StoryFn = () => (
  <PriceTag amount={4999} currency="USD" discountPercent={20} />
);
```

```tsx
// app/components/PriceTag/tests/index.test.tsx
import {composeStory} from '@storybook/react-vite';
import {describe, expect, test} from 'vitest';
import {render, screen} from 'test/rtl';
import Meta, {Default, Discounted} from './index.stories';

const DefaultTag = composeStory(Default, Meta);
const DiscountedTag = composeStory(Discounted, Meta);

describe('PriceTag', () => {
  test('renders formatted price', () => {
    render(<DefaultTag />);
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  test('shows strike-through original when discounted', () => {
    render(<DiscountedTag />);
    expect(screen.getByText('$39.99')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toHaveClass('line-through');
  });
});
```

**Characteristics:**

- Tests observable DOM (what the user sees)
- Uses roles and accessible names (`getByRole`, `getByText`), not class selectors or test ids
- Variants come from Storybook stories — no bespoke `render(<Component prop={...} />)` setups
- Survives internal refactors (swapping `useMemo` for derived state, renaming internal helpers)

## Hook tests via `renderHook`

```tsx
// app/hooks/useToggle/tests/index.test.ts
import {act, renderHook} from 'test/rtl';
import {describe, expect, test} from 'vitest';
import useToggle from '..';

describe('useToggle', () => {
  test('starts with initial value', () => {
    const {result} = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  test('toggles value', () => {
    const {result} = renderHook(() => useToggle(false));
    act(() => result.current[1]());
    expect(result.current[0]).toBe(true);
  });
});
```

Assert on `result.current` — the observable hook surface. Don't reach into closures.

## Service tests via MSW

```tsx
// app/services/gaia/things/tests/requests.test.ts
import {describe, expect, test, afterEach} from 'vitest';
import {resetTestData} from 'test/mocks/database';
import {getThings} from '../requests.server';

describe('getThings', () => {
  afterEach(() => resetTestData());

  test('returns Zod-parsed Things collection', async () => {
    const things = await getThings();
    expect(things).toHaveLength(3);
    expect(things[0]).toMatchObject({id: expect.any(String), name: expect.any(String)});
  });

  test('throws on malformed response', async () => {
    // Temporarily return unexpected shape from the MSW handler
    database.things.create({id: 'x', name: null as unknown as string});
    await expect(getThings()).rejects.toThrow();
  });
});
```

MSW handlers run inside Vitest — you're exercising the real `api()` wrapper, real Zod parsing, real URL resolution. No `vi.mock('fetch')`.

## Bad tests

```tsx
// BAD: asserts on translation internals, not user output
test('greets the user', () => {
  const tSpy = vi.fn();
  vi.mock('react-i18next', () => ({useTranslation: () => ({t: tSpy})}));
  render(<Greeting name="Ada" />);
  expect(tSpy).toHaveBeenCalledWith('greeting.hello', {name: 'Ada'});
});
```

Why bad: refactoring the key (`greeting.hello` → `pages.home.greeting`) breaks the test even though the user still sees "Hello, Ada".

```tsx
// BAD: mocks react-router, tests the mock
vi.mock('react-router', () => ({useNavigate: () => mockNavigate}));
test('submit navigates to /done', async () => {
  render(<CheckoutButton />);
  await userEvent.click(screen.getByRole('button'));
  expect(mockNavigate).toHaveBeenCalledWith('/done');
});
```

Why bad: tests the mock, not the component. Use `stubs.reactRouter({routes: [{path: '/done', storyId: '...'}]})` and assert on the resulting page instead.

```tsx
// BAD: reads MSW internals to verify
test('saveThing called POST', async () => {
  const handler = server.listHandlers().find(h => h.info.path.endsWith('/things'));
  expect(handler).toBeDefined();
});
```

Why bad: the handler's existence proves nothing. Assert on the *effect* — database state after the call, or the returned value.

## Red flags

- `vi.fn()` spy on a function the component uses internally
- `toHaveBeenCalled` as the only assertion (you're testing call-through, not behavior)
- Importing from `../internals` or `.server.ts` files the public consumer wouldn't touch
- Test names like "`useX` returns an object with `a`, `b`, `c`" — that's testing shape, not behavior
- Asserting on `i18n` keys, class lists, or DOM structure instead of accessible roles and text
