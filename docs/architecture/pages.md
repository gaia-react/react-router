---
title: Pages
layout: doc
outline: deep
---

# Pages

The `pages` folder contains page-specific components for your application, organized by route. Each folder inside the `pages` folder corresponds to a specific route in your application, and contains components that are only used for that particular page or set of pages.

This is different from the Components folder, which contains components that are used across multiple pages.

This is not a strict rule, simply a best-practice suggestion to keep things organized.

## Structure

Each folder corresponds to a route in your application.

### `Auth`

The `Auth` folder contains components related to authentication, such as login and registration pages.

### `Public`

The `Public` folder contains components that are accessible to all users, such as the home page and about page.

### `Session`

The `Session` folder contains components that require user authentication, such as the user dashboard and profile page.

## Legal Pages

GAIA doesn't come with a folder for the legal pages, although you can add one if you like.

Generally speaking, legal pages like Terms of Service and Privacy Policy don't change often, and they are usually static content, so putting that static HTML directly in the route files inside the `routes/_legal+` folder is perfectly fine.
