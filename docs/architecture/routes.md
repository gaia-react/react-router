---
title: Routes
layout: doc
outline: deep
---

# Routes

GAIA uses [Remix Flat Routes](https://github.com/kiliman/remix-flat-routes) to define the routes for the application.

This allows you to define your routes using folders and files, rather than having to create files with long names for each route.

We find the flat routes approach easier to maintain and understand. You can switch to the standard [React Router 7 Routing](https://reactrouter.com/start/framework/routing) if you prefer.

## Structure

GAIA organizes the routes using Flat Routes nested folder syntax, prefixing with `_` and appending a `+`.

### `_auth+`

This folder contains routes related to authentication, such as login, registration, and password reset. These routes require a user to *not* have an authenticated session, and will redirect to the `_session+` routes if they do.

### `_legal+`

This folder contains routes related to legal pages, such as Terms of Service and Privacy Policy. These routes do not require authentication.

### `_public+`

This folder contains routes that are publicly accessible, such as the home page and about page. These routes do not require authentication.

### `_session+`

This folder contains routes that require a user to have an authenticated session. These routes will redirect to the `_auth+` routes if the user does not have an authenticated session.

### `action+`

This folder is for root-level [React Router 7 actions](https://reactrouter.com/start/framework/actions).

GAIA comes with 3 root-level actions:
- Logout
- Set Language
- Set Theme (Light/Dark)
