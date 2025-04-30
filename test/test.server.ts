import {fetch} from 'cross-fetch';
import {setupServer} from 'msw/node';
import {afterAll, afterEach, beforeAll} from 'vitest';
import handlers from './mocks';

export const server = setupServer(...handlers);

global.fetch = fetch;

beforeAll(() => {
  // Enable the mocking in tests.
  server.listen({onUnhandledRequest: 'bypass'});
});

afterEach(() => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
});

afterAll(() => {
  // Clean up once the tests are done.
  server.close();
});
