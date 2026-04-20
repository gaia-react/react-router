Scaffold a new API service with request functions, Zod schemas, URL constants, and optional MSW mock handlers.

## Step 1: Gather user input

Ask the user these questions using AskUserQuestion:

- Service name (e.g. `projects`, `users`, `orders`)
- API endpoints — list of method + path pairs (e.g. `GET /projects`, `GET /projects/:id`, `POST /projects`, `PUT /projects/:id`, `DELETE /projects/:id`)
- Describe the schema fields for the resource (e.g. `id: string, name: string, createdAt: datetime`)
- Does it need MSW mock handlers? (yes/no) — default yes

## Step 2: Derive names

From the service name, derive:

- **serviceDir**: `app/services/gaia/{serviceName}/`
- **urlKeys**: camelCase keys for each endpoint path (e.g. `projects`, `projectsId`)
- **schemaName**: singular form + `Schema` (e.g. `projectSchema`)
- **listSchemaName**: plural form + `Schema` (e.g. `projectsSchema`)
- **typeName**: singular PascalCase (e.g. `Project`)
- **listTypeName**: plural PascalCase (e.g. `Projects`)

## Step 3: Add URL constants

Edit `app/services/gaia/urls.ts` — add new URL keys to `GAIA_URLS`, maintaining alphabetical order:

```ts
export const GAIA_URLS = {
  login: 'login',
  projects: 'projects', // new
  projectsId: 'projects/:id', // new
};
```

## Step 4: Create schema parsers

Create `app/services/gaia/{serviceName}/parsers.ts` following the things pattern:

```ts
import {z} from 'zod';

export const {schemaName} = z.object({
  // fields from user input, using appropriate Zod types
  // z.string(), z.iso.datetime(), z.number(), z.boolean(), etc.
});

export const {listSchemaName} = z.array({schemaName});
```

## Step 5: Create types

Create `app/services/gaia/{serviceName}/types.ts`:

```ts
import type {z} from 'zod';
import type {{schemaName}, {listSchemaName}} from './parsers';

export type {TypeName} = z.infer<typeof {schemaName}>;

export type {ListTypeName} = z.infer<typeof {listSchemaName}>;
```

## Step 6: Create request functions

Create `app/services/gaia/{serviceName}/requests.server.ts` following the things pattern:

```ts
import {api} from '../api';
import {GAIA_URLS} from '../urls';
import {{schemaName}, {listSchemaName}} from './parsers';
import type {{TypeName}, {ListTypeName}} from './types';
```

Generate one function per endpoint:

- **GET (list)**: `getAll{PluralName}` — uses `listSchemaName.parse(result.data)`
- **GET (single)**: `get{SingularName}ById` — uses `schemaName.parse(result.data)`, accepts `id: string`
- **POST**: `create{SingularName}` — accepts `body: FormData`, uses `schemaName.parse(result.data)`
- **PUT**: `update{SingularName}` — accepts `body: FormData`, uses `pathParams: {id: body.get('id')}`
- **DELETE**: `delete{SingularName}` — accepts `id: string`, returns `ReturnType<typeof api>`

## Step 7: Update barrel export

Edit `app/services/gaia/index.server.ts` — add the new service import and export, maintaining alphabetical order:

```ts
import * as {serviceName} from './{serviceName}/requests.server';
```

## Step 8: Create MSW mocks (if requested)

### 8a: Create mock data

Create `test/mocks/{serviceName}/data.ts` following the things mock data pattern:

```ts
import {nullable, primaryKey} from '@mswjs/data';
import {z} from 'zod';
import {date} from 'test/utils';

export const server{TypeName}Schema = z.object({
  // snake_case server versions of the schema fields
});

export type Server{TypeName} = z.infer<typeof server{TypeName}Schema>;

const schema = {
  // @mswjs/data schema using primaryKey(String), String, Number, nullable(String), etc.
};

const data: Server{TypeName}[] = [
  // 2 sample records
];

export default {data, schema};
```

### 8b: Create mock handlers

Create one file per HTTP method in `test/mocks/{serviceName}/`:

- `get.ts` — GET handlers using `http.get` and `database.{serviceName}.getAll()` / `findFirst()`
- `post.ts` — POST handler using `http.post`, `request.formData()`, `database.{serviceName}.create()`
- `put.ts` — PUT handler using `http.put`, `request.formData()`, `database.{serviceName}.update()`
- `delete.ts` — DELETE handler using `http.delete`, `database.{serviceName}.delete()`

Each handler uses `${process.env.API_URL}${GAIA_URLS.{urlKey}}` for the URL.

### 8c: Create mock barrel

Create `test/mocks/{serviceName}/index.ts`:

```ts
import del from './delete';
import get from './get';
import post from './post';
import put from './put';

export default [...get, post, put, del];
```

Only include the methods that match the user's requested endpoints.

### 8d: Update mock database

Edit `test/mocks/database.ts`:

- Add import for the new mock data
- Add schema to the factory
- Add cleanup to `resetTestData` (deleteMany + forEach create)

### 8e: Update mock barrel

Edit `test/mocks/index.ts`:

- Add import for the new mock handlers
- Spread into the handlers array

## Step 9: Verify

Run these commands sequentially, stopping if any fails:

```bash
npm run typecheck && npm run lint && npm run test -- --run
```

Fix any issues before reporting to the user.
