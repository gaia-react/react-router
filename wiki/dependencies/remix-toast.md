---
type: dependency
status: active
package: "remix-toast, sonner"
version: "4.0.0, 2.0.7"
role: toasts
created: 2026-04-20
updated: 2026-04-20
tags: [dependency, ui]
---

# remix-toast + Sonner

Cookie-backed flash messages for redirect-based UX, rendered with [Sonner](https://sonner.emilkowal.ski/).

- `getToast(request)` in `root.tsx` extracts the toast cookie
- `setToastCookieOptions({secrets: [env.SESSION_SECRET]})` signs it
- `<Toast />` component subscribes; `notify[type](toast)` triggers render
- `dataWithToast(...)` (from `remix-toast`) returns toast-bearing responses from actions

See [[Form Submit Flow]].
