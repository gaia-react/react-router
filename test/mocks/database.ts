import {factory} from '@mswjs/data';

const database = factory({});

// No-op while the template has no factories. When a service scaffolds a
// factory (e.g. via /new-service), re-seed it here so tests start clean.
export const resetTestData = () => {};

export default database;
