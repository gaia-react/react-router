---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, a11y]
---

# Accessibility

Source: `.claude/rules/accessibility.md` — applied to `app/components/**` and `app/pages/**`.

## Core requirements

- **Keyboard navigation** — every interactive element reachable via Tab, operable via Enter/Escape/Arrow
- **Alt text** — descriptive `alt` on every `<img>` (or `alt=""` for decorative)
- **Form labels** — GAIA's [[Form Components]] handle this. Custom inputs: `<label htmlFor>` or `aria-label`
- **Color** — never the sole indicator of meaning
- **Focus management** — modals trap focus on open and return it on close

## ARIA

- Prefer semantic HTML (`<button>`, `<nav>`, `<main>`) over ARIA roles
- `aria-label` when visible text is insufficient
- `aria-live="polite"` for dynamic updates (toasts, status)
- `aria-expanded`, `aria-controls` for disclosure widgets

## Testing

- Tab through all interactive flows
- Verify focus is visible (outline)
- No keyboard traps
- Screen reader announces dynamic content
