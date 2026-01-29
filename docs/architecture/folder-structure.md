---
title: Folder Structure
layout: doc
outline: deep
---

# Folder Structure

Inside the `app` folder, you will find the following folders:

- [assets](/architecture/assets)
- [components](/architecture/components)
- [hooks](/architecture/hooks)
- [languages](/architecture/languages)
- [middleware](/architecture/middleware)
- [pages](/architecture/pages)
- [routes](/architecture/routes)
- [services](/architecture/services)
- [sessions.server](/architecture/sessions)
- [state](/architecture/state)
- [styles](/architecture/styles)
- [types](/architecture/types)
- [utils](/architecture/utils)

## Files

You will also find these files:

- `entry.client.tsx` and `entry.server.tsx` are required for React Router. They have everything set up for i18n, environment variables, and MSW.
- `root.tsx` - is required by React Router.
- `env.server.ts` - Zod schemas for typed environment variables.
- `i18n.ts` and `i18next.server.ts` - i18n setup files.
