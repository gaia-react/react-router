# Skeleton Loaders

Build skeleton loading states that are pixel-perfect matches of real content.

## Transparent Text Technique

Use real HTML elements (`<p>`, `<span>`, `<h2>`, `<button>`) with the same font classes as the real component, plus shimmer + transparency classes. This makes skeletons inherit exact line-height, font-size, and weight — producing pixel-perfect dimensions without hardcoded `h-*`/`w-*` values.

### Shimmer class constant

Define a shared class string at the top of the skeleton component:

```tsx
const S =
  'animate-shimmer rounded-sm bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 bg-size-[200%_100%] text-transparent select-none';
```

### Text elements

Copy the real component's element type and font classes, add `S`, use placeholder text of similar character count:

```tsx
// Real component
<p className="truncate text-sm font-semibold text-white">{exercise.name}</p>
<p className="text-xs text-slate-400">3 x 10 · 60s rest</p>

// Skeleton
<p className={`truncate text-sm font-semibold ${S}`}>Bench Press</p>
<p className={`text-xs ${S}`}>3 &times; 10 &middot; 60s rest</p>
```

### Non-text elements (images, icons, avatars)

Keep as empty divs with the shimmer class — no text needed:

```tsx
<div className={`size-14 shrink-0 ${S}`} />
```

### Interactive elements (buttons)

Use the real element type with `tabIndex={-1}` to prevent focus:

```tsx
<button
  className={`w-full py-2 text-xs font-medium ${S}`}
  tabIndex={-1}
  type="button"
>
  How to perform
</button>
```

## 200ms Delay Pattern

Avoid skeleton flash on fast loads. Show stale/empty content for 200ms before revealing the skeleton:

```tsx
const [showSkeleton, setShowSkeleton] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => setShowSkeleton(true), 200);
  return () => clearTimeout(timer);
}, []);

if (!showSkeleton) return null; // or return stale content
return <MySkeleton />;
```

## When to Use

- Lazy-loaded panels (side panels, detail views)
- Fetcher-driven content swaps (exercise swap in review step)
- Async data display (workout history, profile sections)
- Route transitions with pending loader data

## Reference Implementation

See `app/pages/Session/GenerateWorkoutPage/GeneratingStep/ExerciseCardSkeleton/index.tsx` for a complete example matching `ReviewStep/ExerciseCard/index.tsx`.
