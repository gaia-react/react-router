# Hook Patterns — Extended Examples

## useEffect Anti-Patterns

### Don't transform data for rendering

```tsx
// BAD — unnecessary state + Effect + extra render cycle
const [filtered, setFiltered] = useState<Exercise[]>([]);
useEffect(() => {
  setFiltered(exercises.filter((e) => e.muscleGroup === selected));
}, [exercises, selected]);

// GOOD — derive inline
const filtered = exercises.filter((e) => e.muscleGroup === selected);
```

### Don't use Effects for expensive calculations

```tsx
// BAD
useEffect(() => {
  setSorted(exercises.slice().sort((a, b) => a.name.localeCompare(b.name)));
}, [exercises]);

// GOOD — useMemo runs synchronously, no extra render
const sorted = useMemo(
  () => exercises.slice().sort((a, b) => a.name.localeCompare(b.name)),
  [exercises]
);
```

### Don't derive redundant state

```tsx
// BAD
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// GOOD
const fullName = `${firstName} ${lastName}`;
```

### Don't put user-event logic in Effects

```tsx
// BAD — notification in Effect triggered by state change
useEffect(() => {
  if (justAdded) showToast(`${product.name} added`);
}, [justAdded]);

// GOOD — in the event handler
function handleAddToPlan() {
  dispatch({type: 'add', product});
  showToast(`${product.name} added to your plan`);
}
```

### Don't chain Effects

```tsx
// BAD — multiple Effects cascading state updates
useEffect(() => {
  setCard(deck[index]);
}, [index]);
useEffect(() => {
  setGoldCount(card.isGold ? count + 1 : count);
}, [card]);

// GOOD — derive everything from the event
function pickCard(index: number) {
  const card = deck[index];
  const newGoldCount = card.isGold ? goldCardCount + 1 : goldCardCount;
  setIndex(index);
  setCard(card);
  setGoldCardCount(newGoldCount);
  setIsWon(newGoldCount >= 5);
}
```

### Don't notify parent via Effect

```tsx
// BAD
useEffect(() => {
  onChange(isOn);
}, [isOn]);

// GOOD
function handleToggle() {
  const next = !isOn;
  setIsOn(next);
  onChange(next);
}
```

### State reset — use key, not Effect

```tsx
// BAD
useEffect(() => {
  setNotes('');
  setEditing(false);
}, [userId]);

// GOOD — key forces unmount/remount, all state resets
<WorkoutNotes key={userId} userId={userId} />;
```

## When Effects ARE Correct

Effects are appropriate for synchronizing with external systems.

### Data fetching with ignore flag

```tsx
useEffect(() => {
  let ignore = false;

  async function fetchExercises() {
    const {data} = await supabase
      .from('exercises')
      .select('*')
      .eq('gym_id', gymId);
    if (!ignore) setExercises(data ?? []);
  }

  fetchExercises();
  return () => {
    ignore = true;
  };
}, [gymId]);
```

### External store subscription

Prefer `useSyncExternalStore` when possible. Use Effect for third-party widgets or browser APIs that don't expose a subscribe/getSnapshot pattern.

## useCallback — When to Use

```tsx
// ✅ Passed to memo-wrapped child
const handleSubmit = useCallback((data: FormData) => {
  post('/api/submit', data);
}, []);
return <MemoizedForm onSubmit={handleSubmit} />;

// ✅ Used in useEffect dependency array
const fetchData = useCallback(async () => {
  const result = await api.get(endpoint);
  setData(result);
}, [endpoint]);

useEffect(() => {
  fetchData();
}, [fetchData]);

// ❌ Not passed to memo child, not in any hook deps — skip useCallback
const handleClick = () => {
  setCount(count + 1);
};
```
