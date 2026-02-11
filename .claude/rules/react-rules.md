# React Rules

Rules to follow when writing React code.

## React Import Rule

Always use named imports from `react` — never `import React from 'react'`.

- Use `import {useState, useCallback} from 'react'` not `React.useState()`
- Use `import type {FC, KeyboardEvent} from 'react'` not `React.KeyboardEvent`

## FC Rule

Always use the named import `FC` for functional components. 

If the component has no props, define it as `FC` without generics.

```tsx
import type {FC} from 'react'
const MyComponent: FC = () => {
  return <div>Hello, World!</div>
};
export default MyComponent;
```

If the component has props, define them in a type named after the component name with `Props` suffix.

```tsx
import type {FC} from 'react'
type MyComponentProps = {
  title: string
}
const MyComponent: FC<MyComponentProps> = ({title}) => {
  return <h1>{title}</h1>
};
export default MyComponent;
```

## Event Handler Typing
Event handler functions should be typed using the appropriate React event handler type, whenever possible. In cases where React does not have a specific event handler type, you can type the event parameter directly.

For example:
```tsx
// BAD - types the event parameter directly
const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {}

// GOOD - uses ChangeEventHandler
const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (event) => {}
```

There may be some cases where the latter is necessary, such as when the event handler is used in multiple places with different element types. In those cases, use the latter approach.

## Event Handler Naming

Event handler functions should be named using the `handle` prefix followed by the action and then:
- If the element has a name, use the element name.
- If the element doesn't have a name, use the element type.
- If there is only one element of that type, the type can be omitted.

For example:
```tsx
// Includes element name
const handleChangeFirstName: ChangeEventHandler<HTMLInputElement> = (event) => {}

// When name is not appropriate, use element type
const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (event) => {}

// When there is only one element of that type, type can be omitted
const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {}
```
