---
type: component
path: app/components/Form/{Chain,FormActions,FormError}/
status: active
language: typescript
purpose: Form composition helpers — input rows, action rows, server-error banner
depends_on: [[Form Components]]
created: 2026-04-20
updated: 2026-04-20
tags: [component, forms, layout]
---

# Form Layout

Three small helpers that sit around actual input components.

## Components

| Component     | Renders                  | Key props / behaviour                                                                                                                                                                                  |
| ------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Chain`       | `role="group"` flex row  | Groups inputs into one chained field (currency+amount, country code+phone). `isFullWidth` stretches to container. CSS-module selectors round only outermost corners.                                   |
| `FormActions` | Horizontal button row    | `align='right'` (default, `justify-end`) or `'left'` (`pl-0.5` optical nudge). `gap-4`; override via `className`.                                                                                      |
| `FormError`   | Dismissible error banner | Reads `error` from `useActionData`. Dismisses until a new error string arrives; `hide` prop suppresses. `<button type="button">` prevents accidental submit; `<span role="alert">` for screen readers. |

## Composition

Place `<FormError />` at the top of the form, `<Chain>` around any grouped inputs, and `<FormActions>` last with submit/cancel buttons.
