import type {Hooks, Options} from 'ky';
import type {StringifyOptions} from 'query-string';
import queryString from 'query-string';
import {tryCatch} from '~/utils/function';
import {toCamelCase, toSnakeCase} from '~/utils/object';

const requestToSnakeCase = async (request: Request, options: Options) => {
  if (options.body && !(options.body instanceof FormData)) {
    const body = JSON.stringify(
      toSnakeCase(JSON.parse(options.body as string))
    );

    // eslint-disable-next-line unicorn/no-invalid-fetch-options
    return new Request(request, {body});
  }
};

const responseToCamelCase = async (
  _request: Request,
  _options: Options,
  response: Response
) => {
  const [, result] = await tryCatch(async () => {
    const original = await response.json();

    return new Response(JSON.stringify(toCamelCase(original)), response);
  });

  if (result) {
    return result;
  }
};

export const getHooks = (useSnakeCase?: boolean, hooks?: Hooks) =>
  useSnakeCase ?
    {
      afterResponse: [responseToCamelCase, ...(hooks?.afterResponse ?? [])],
      beforeRequest: [requestToSnakeCase, ...(hooks?.beforeRequest ?? [])],
      ...hooks,
    }
  : hooks;

export const appendSearchParams = (
  uri: string,
  options?: {
    arrayFormat?: StringifyOptions['arrayFormat'];
    searchParams?: Record<string, unknown>;
    useSnakeCase?: boolean;
  }
) => {
  const {
    arrayFormat = 'comma',
    searchParams,
    useSnakeCase = true,
  } = options || {};

  if (!searchParams) {
    return uri;
  }

  const casedParams =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useSnakeCase ? toSnakeCase<any>(searchParams) : searchParams;

  const safeParams = queryString.stringify(casedParams, {arrayFormat});
  const q = uri.includes('?') ? '&' : '?';
  const search = safeParams ? `${q}${safeParams}` : '';

  return `${uri}${search}`;
};

export const setPathParams = (
  url: string,
  pathParams?: Record<string, unknown>
) =>
  pathParams ?
    Object.entries(pathParams).reduce(
      (acc, [key, value]) => acc.replace(`:${key}`, value as string),
      url
    )
  : url;

export const getUri = (
  uri: string,
  {
    pathParams,
    ...options
  }: {
    arrayFormat?: StringifyOptions['arrayFormat'];
    pathParams?: Record<string, unknown>;
    searchParams?: Record<string, unknown>;
    useSnakeCase?: boolean;
  } = {}
) => appendSearchParams(setPathParams(uri, pathParams), options);

export const getBaseUrl = () => {
  if (process.env.API_URL) {
    // server api call
    return process.env.API_URL;
  }

  if (typeof window !== 'undefined' && window.process.env.API_URL) {
    // client api call
    return window.process.env.API_URL;
  }

  // fallback
  return '';
};
