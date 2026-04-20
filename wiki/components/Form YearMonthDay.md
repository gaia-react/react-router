---
type: component
path: app/components/Form/YearMonthDay/
status: active
language: typescript
purpose: Composite date-of-birth input — three locale-aware Selects + hidden ISO date
depends_on: [[Form Select]], [[Conform]], [[Form Components]]
created: 2026-04-20
updated: 2026-04-20
tags: [component, forms, date, gotcha]
---

# Form YearMonthDay

Three [[Form Select]]s (year, month, day) feeding one hidden `<input type="hidden" name="dob">` that carries the ISO-8601 date string to the server. The canonical example of a custom stateful component that integrates with Conform.

## Props

`name` (default `'dob'`), `value` (ISO 8601 `yyyy-MM-dd`), `onChange`, `onBlur?`, `error?`, `label?`, `required?`, `className?`, `classNameSelect?`. See `app/components/Form/YearMonthDay/index.tsx:27-37`.

## Year / Month / Day option generation

`YearMonthDay/utils.ts`:

- `YEARS = range(thisYear - 120, thisYear - 12).toReversed()` — 120-year span ending 12 years ago (minor)
- `MONTHS = range(1, 12)`
- Dates recompute per-render via `useMemo` keyed on `language`, `year`, `month` — count matches `getDaysInMonth`
- Labels localize through `date-fns`: `formatFullYear`, `formatAbbreviatedMonth`, `formatOrdinalDay` (Japanese etc. use ordinal day labels — English uses plain numbers)

## `getSafeValue` — leap-year / month-end clamping

When the user changes year or month, `getSafeValue` computes the new ISO string, clamping the day to the last valid day of the new month. Prevents 2024-02-29 from rolling over to 2023-02-29.

## > [!warning] Conform integration — two non-obvious gotchas

### 1. Block native `input` events from bubbling to Conform

```tsx
const containerRef = useCallback((node: HTMLDivElement | null) => {
  if (node) {
    node.addEventListener('input', (event) => event.stopPropagation());
  }
}, []);
```

Conform's `useForm` attaches an `input` listener on `document` that reads `FormData` and uses it to revalidate. When the three child Selects fire `input`, Conform reads **stale** FormData (the hidden input hasn't been repopulated yet) and overwrites the controlled Select values.

**Why native `addEventListener` and not React `onInput`?** React's synthetic event system delegates to the document root after SSR hydration, so both React's handler and Conform's handler live on the same document node. `stopPropagation` is a no-op between two listeners on the same element. Attaching natively at the container div stops propagation before the event ever reaches `document`.

### 2. Sync the hidden input's DOM value before calling `onChange`

```tsx
if (hiddenRef.current) {
  hiddenRef.current.value = newValue;
}
onChange(newValue);
```

`onChange` eventually triggers Conform revalidation, which reads `FormData` from the form. FormData reads DOM values, not React state — so the hidden input must carry the new value **at DOM level** before validation runs.

## Caller pattern — `useInputControl`

```tsx
const dobControl = useInputControl(fields.dob);

<YearMonthDay
  error={fields.dob.errors}
  name={fields.dob.name}
  onBlur={dobControl.blur}
  onChange={dobControl.change}
  value={dobControl.value ?? DEFAULT_VALUE}
/>;
```

Without `useInputControl`, local `useState` in the caller will desync from Conform once validation fails. See [[Component Testing]] for the canonical test for this component.

## Related

- [[Form Select]] — the primitive
- [[Conform]] — form library
- [[Form Components]] — overview
