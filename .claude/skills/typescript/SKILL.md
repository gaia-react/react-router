# TypeScript

Patterns and conventions for all TypeScript code in `app/`.

## Types

- `import type {}` for type-only imports: `import type {FC} from 'react'`

## Naming — camelCase

All identifiers use camelCase: Zod fields, form `name`/`id`/`htmlFor`, props, state, params.

**Exceptions (snake_case OK):**

- `app/types/database.ts` — mirrors DB column names
- `scripts/data/`, `supabase/` — DB seed/migration scripts
- Object literals in Supabase `.insert()`/`.update()` calls — must match DB columns
- Dynamic template literal names where variable part is already lowercase
- Environment variable names (`SUPABASE_URL`)

Map snake_case ↔ camelCase at the Supabase call boundary, not in schemas or UI code.

## Naming — Descriptive and Self-Documenting

Follow Apple's Swift API Design Guidelines: names should be clear at the point of use, reading like prose. Favor long, descriptive names over short or abbreviated ones. Code should be readable without consulting documentation.

**Functions and methods** — read like imperative verb phrases that describe what they do and what they act on:

```ts
// BAD — vague, what does "handle" mean? what is "data"?
const handle = (data: unknown) => { ... }
const proc = (u: User) => { ... }
const calc = (a: number, b: number) => { ... }

// GOOD — clear intent at every call site
const handleWorkoutSessionTimeout = (session: WorkoutSession) => { ... }
const processUserOnboardingProfile = (user: User) => { ... }
const calculateProgressPercentageFromCompletedSets = (completedSets: number, totalSets: number) => { ... }
```

> **Exception — React event handlers** follow `handle{Action}{Element}` from the react-code skill
> (e.g. `handleClickSave`, `handleChangeInput`). The descriptive naming guidelines above apply
> to utilities, hooks, callbacks, and non-event-handler functions.

**Parameters and arguments** — named for their role, not their type:

```ts
// BAD — type as name, single-letter params
const formatDuration = (n: number): string => { ... }
const findUser = (s: string): User | null => { ... }

// GOOD — role is immediately clear
const formatDurationInSeconds = (totalSeconds: number): string => { ... }
const findUserByEmailAddress = (emailAddress: string): User | null => { ... }
```

**Variables and constants** — describe what they hold, not how they're used:

```ts
// BAD — abbreviations, vague names
const btn = document.querySelector('button');
const val = form.get('weight');
const temp = calculateRestDuration();
const MAX = 3;

// GOOD — unambiguous at a glance
const submitButton = document.querySelector('button');
const weightInputValue = form.get('weight');
const restDurationInSeconds = calculateRestDuration();
const maximumRetryAttemptCount = 3;
```

**Avoid abbreviations** — spell out words in full unless the abbreviation is universally known (e.g., `url`, `id`, `api`):

```ts
// BAD
const calcBMI = (ht: number, wt: number) => { ... }
const usrPref = getUserPref();
const animDur = 300;

// GOOD
const calculateBodyMassIndex = (heightInCentimeters: number, weightInKilograms: number) => { ... }
const userDisplayPreferences = getUserDisplayPreferences();
const animationDurationInMilliseconds = 300;
```

**Omit redundant words, but not clarity** — don't pad names, but don't sacrifice readability for brevity:

```ts
// BAD — redundant type noise
const userObject = fetchUser();
const exerciseArray = getExercises();

// BAD — too terse
const ex = getExercises();
const u = fetchUser();

// GOOD — just right
const currentUser = fetchUser();
const availableExercises = getExercises();
```

## Exported Functions — Explicit Return Types

All exported functions must have explicit return types.

**Exceptions:**

- Route loaders/actions (complex generics)
- React components typed with `FC<Props>` (return type provided by generic)

```tsx
// BAD
export const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

// GOOD
export const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd');
```

## General Rules

- `type` not `interface` (enforced)
- Arrays: `string[]` not `Array<string>`
- Boolean naming: `^((can|has|hide|is|show)[A-Z]|checked|disabled|required)`

## Code Patterns

- No `switch` statements — use if/else chains or object maps
- No TypeScript enums — use `as const` objects with derived types
- JSX boolean props: always explicit `={true}`
- Max 3 function parameters — use an options object beyond that

## Zod

- **`z.literal()` not `z.enum()`** — sort values alphanumerically
- **`@conform-to/zod`** — always import from `/v4` subpath (runtime error otherwise)

```tsx
// BAD — runtime error with Zod v4
import {parseWithZod} from '@conform-to/zod';

// GOOD
import {parseWithZod} from '@conform-to/zod/v4';
```

```tsx
// BAD
z.enum(['metric', 'imperial']);

// GOOD
z.literal(['imperial', 'metric']);
```
