---
title: Folder Structure
layout: doc
outline: deep
---

# Folder Structure

Inside the `app` folder, you will find the following folders:

- <a href="/architecture/assets">assets</a>
- <a href="/architecture/components">components</a>
- <a href="/architecture/hooks">hooks</a>
- <a href="/architecture/languages">languages</a>
- <a href="/architecture/middleware">middleware</a>
- <a href="/architecture/pages">pages</a>
- <a href="/architecture/routes">routes</a>
- <a href="/architecture/services">services</a>
- <a href="/architecture/sessions">sessions.server</a>
- <a href="/architecture/state">state</a>
- <a href="/architecture/styles">styles</a>
- <a href="/architecture/types">types</a>
- <a href="/architecture/utils">utils</a>

## Files

You will also find these files:

- `entry.client.tsx` and `entry.server.tsx` are required for React Router. They have everything set up for i18n, environment variables, and MSW.
- `root.tsx` - is required by React Router.
- `env.server.ts` - Zod schemas for typed environment variables.
- `i18n.ts` and `i18next.server.ts` - i18n setup files.
