---
title: Languages
layout: doc
outline: deep
---

# Languages

The languages folder contains the internationalization (i18n) files for the application. Each folder on the root corresponds to a different language supported by the application.

Each file contains an object with key-value pairs, where the keys are the identifiers used in the application, and the values are the translated strings.

GAIA has type safety built-in, which means you will get auto-completion as you code, as well as TypeScript errors if you reference a string that does not exist.

This ensures common mistakes like typos or renamed keys not also being updated in the code can no longer happen since the lint-staged on commit ensures you won't be able to commit code that references a string that does not exist.

## TypeScript vs JSON

In most examples online, JSON files are used to define the strings for each language. However, GAIA uses TypeScript files, instead.

One of the benefits of using TypeScript files is that they can be imported into one another, creating logical dot-chains to reference strings. For example:

- `pages.account.profile.fullName`
- `auth.login.errors.invalidPassword`

This allows you to organize your translations in a hierarchical manner, making it easier to manage and maintain them.

Additionally, you get the benefits of ESLint and Prettier to ensure there are no syntax errors. And, you can import and access the language strings in your tests.

The tradeoff is that all the strings for all the pages for all the languages are included in the initial load. However, considering that all the strings are gzipped, strings compress **extremely** well, and bundle files get cached, this is not a significant issue in practice.

GAIA recommends starting with the convenience of the TypeScript approach, and only switching to JSON if and when you actually need to optimize by switching to JSON and loading each language and translation file on-demand, instead.

## Structure

The index file inside each language folder imports the root level files for that language.

GAIA's example structure has auth, common, and error string at the root level, and then a folder called `pages` that contains the strings for each page in the application.

Inside the pages folder, there are subfolders for each page, and each page folder contains a file called `index.ts` which imports any sub-pages for that page. You will also see a file named `_index.ts`. This file contains the strings for the root of that page, rather than put them in the index file, which is reserved for importing sub-pages.

In most cases, the `_index` will be imported using destructuring like this:

```ts
import index from './_index';

export default {
  ...index,
};
```

However, in the GAIA example, you will see on the root of pages, it is imported like this:

```ts
import index from './_index';

export default {
  index,
};
```

This is because in this case, it is the actual index page of the entire site, so it is named "index" accordingly.
