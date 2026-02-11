# useTranslation Rule

Only call `useTranslation()` **once** per component. Never create multiple variables for different namespaces.

## How to access other namespaces

Pass `{ns: 'other'}` as the second argument to `t()`:

```tsx
// GOOD — single useTranslation call
const {t} = useTranslation('pages');
t('onboarding.step1.title');           // uses 'pages' namespace
t('previous', {ns: 'common'});        // overrides to 'common' namespace

// BAD — multiple useTranslation calls
const {t} = useTranslation('pages');
const {t: tc} = useTranslation('common');
tc('previous');
```

## Choose the most-used namespace

The namespace passed to `useTranslation()` should be whichever is used **most frequently** in that component. This minimizes the number of `t()` calls that need `{ns}` overrides.

If more `t()` calls override the namespace than use the declared one, change the declared namespace and update the overrides accordingly.

## keyPrefix exception

You should use the `keyPrefix` option if you have many keys with the same prefix in a component to avoid repeating it unnecessarily.

However, if you have to override the namespace in any `t()` calls, and `keyPrefix` is being used in `useTranslation()`, remove it and prefix keys manually in the `t()` calls instead. This way you still only call `useTranslation` once.

```tsx
// BAD — keyPrefix prevents namespace overrides
const {t} = useTranslation('pages', {keyPrefix: 'onboarding.step1'});
// Can't override namespace now

// GOOD — prefix manually
const {t} = useTranslation('pages');
t('onboarding.step1.title');
t('previous', {ns: 'common'});
```
