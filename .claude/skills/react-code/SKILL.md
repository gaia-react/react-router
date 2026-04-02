# React Code

Write and edit React components, pages, routes, hooks, and forms following project conventions.

## Pre-Flight Gates (MANDATORY)

Before writing or editing any React code, run through these gates. Each gate applies only when the relevant pattern is present in your changes.

### Gate 1: Hook Check

**Before writing `useEffect`:**

1. Can I calculate this during render? → Derive inline or `useMemo`. **STOP — no Effect.**
2. Does this respond to a user action? → Put it in the event handler. **STOP.**
3. Am I syncing state to other state? → Derive it; remove the redundant state. **STOP.**
4. Am I notifying a parent of a state change? → Call both setters in the handler. **STOP.**
5. Do I need to reset child state when a prop changes? → Use `key`. **STOP.**
6. Am I synchronizing with an external system (browser API, third-party widget, network)? → **GO.** Add cleanup. For data fetching, include an `ignore` flag.

**Before writing `useCallback`:**

Only use when the function is:

1. Passed as a prop to a `memo`-wrapped component
2. A dependency of `useEffect`, `useMemo`, or another `useCallback`
3. Passed to a child that uses it in a hook dependency array

If none apply → **STOP — no useCallback.**

**`useState` type inference:** Omit explicit type when inferable from the default value. Only add types for `null` initial values, unions, or complex objects.

### Gate 2: Form Element Check

**Before writing `<input>`, `<select>`, `<textarea>`, or `<input type="checkbox">`:**

| Native element                   | Use instead                                                                      |
| -------------------------------- | -------------------------------------------------------------------------------- |
| `<input type="text/email/etc.">` | `InputText` (`~/components/Form/InputText`)                                      |
| `<input type="password">`        | `InputPassword` (`~/components/Form/InputPassword`)                              |
| `<input type="checkbox">`        | `Checkbox` (`~/components/Form/Checkbox`)                                        |
| `<select>`                       | `Select` (`~/components/Form/Select`) — needs `name` + `options: SelectOption[]` |
| `<textarea>`                     | `TextArea` (`~/components/Form/TextArea`) — needs `name`; auto-resizes           |

**Exceptions (native OK):** `<input type="hidden">`, `<input type="file">`, `<input type="radio">` inside custom radio group.

`Select` requires `options: SelectOption[]` (`{label, value}`). Build this array (with `useMemo` if derived from translations/data) rather than inline `<option>` elements.

**CRITICAL — `@conform-to/zod`:** Always import from `/v4` subpath. The default export targets Zod v3 and causes a runtime error that typecheck/lint/build do NOT catch.

```tsx
// BAD — runtime error
import {parseWithZod} from '@conform-to/zod';
// GOOD
import {parseWithZod} from '@conform-to/zod/v4';
```

See `references/conform-forms.md` for full Conform + Zod wiring.

### Gate 3: Translation Check

**Before writing ANY user-visible string in JSX:**

Every string a user can see — labels, headings, placeholders, button text, error messages, tooltips, descriptions, status text — must come from a `t()` call. Hard-coded English strings in JSX are bugs. This applies to new components, new UI sections, and modifications that add visible text. The only exceptions are punctuation-only strings, single-character symbols, and developer-facing content (console.log, comments, test assertions).

1. Add the translation key to the appropriate namespace file in `app/languages/en/` (and `app/languages/ja/` with a placeholder)
2. Use `t('key')` in the component — never a string literal
3. **One `useTranslation()` per component** — never multiple calls for different namespaces
4. Use `{ns: 'other'}` as second arg to `t()` for cross-namespace access
5. Choose the most-used namespace for `useTranslation()` to minimize overrides
6. **Before adding a new key:** search `app/languages/en/` for existing equivalent strings
7. Dynamic keys: ensure interpolated values have literal union types, not `string`

See `references/translation-patterns.md` for edge cases (keyPrefix, Trans component, dedup).

### Gate 4: Google API Check

**Before writing code that calls Google APIs (Places, Geocoding, Maps):**

1. Server function must use `cachified` with appropriate TTL
2. Client components must debounce user input with `useDebounce` (minimum 300ms)
3. Never call Google APIs directly from the client — go through a loader/action
4. Use `fetcherRef` pattern — never put `useFetcher()` in a `useEffect` dependency array

See `references/google-api-patterns.md` for caching setup, fetcherRef wiring, and prohibited patterns.

## Component Structure

- **FC typing:** `const MyComponent: FC<Props> = ({...}) => ...`
- **Named React imports:** `import {useState} from 'react'` — never `React.useState()`
- **Type imports:** `import type {FC} from 'react'` — never `React.FC`
- **One component per file**
- **Event handler types:** Use `ChangeEventHandler<HTMLInputElement>` not inline event typing
- **Event handler naming:** `handle{Action}{Element}` — e.g. `handleClickSave`, `handleChangeInput`

### Component Extraction

Extract when a section meets **all** criteria:

1. Self-contained (own state/fetcher, or pure display with no shared state)
2. Clear boundary (visible UI section with small props interface)
3. ~60+ lines of JSX/logic

**Do not extract** when state/refs are shared across sections, extraction needs 5+ props/callbacks, section is under ~60 lines, or form validation is tightly coupled.

How: Create `ParentComponent/NewSection/index.tsx`, move exclusive types/state/handlers/JSX, define minimal `Props` type.

## Route-Page Architecture

### Route files (`app/routes/`)

Thin shell only:

- `loader` / `action` functions
- `meta` export
- Zod schemas for the action
- One-line default export: `const MyRoute: FC = () => <MyPage />;`

**No UI code, hooks, state, or sub-components in route files.**

### Page components (`app/pages/`)

```
app/pages/Session/{Section}/{PageName}/index.tsx
```

Define `LoaderData` type locally, use `useLoaderData<LoaderData>()`.

Sub-components go in sibling folders. Tests/stories in `{PageName}/tests/`.

When stories need different loader data, put `stubs.reactRouter()` decorators on individual stories (not meta) to avoid nested Router errors with `composeStory`.

## Styling (Tailwind)

- **`twMerge`** — when props allow class override (merges conflicting utilities)
- **`twJoin`** — for conditional class combinations (no override needed)
- **Units:** Use Tailwind spacing scale first. For custom values, always `rem`, never `px`

## References

- `references/hook-patterns.md` — extended hook examples and anti-patterns
- `references/conform-forms.md` — full Conform + Zod form wiring walkthrough
- `references/translation-patterns.md` — i18n edge cases, Trans component, dedup rules
- `references/google-api-patterns.md` — caching, debouncing, fetcherRef for Google API calls
