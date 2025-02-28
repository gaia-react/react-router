import ky from 'ky';
import type {KyInstance, Options} from 'ky';
import type {StringifyOptions} from 'query-string';
import i18n from '~/i18n';
import {getBaseUrl, getHooks, getUri} from './utils';

type CreateOptions = Options & {
  arrayFormat?: StringifyOptions['arrayFormat'];
  useSnakeCase?: boolean;
};

type RequestOptions = Options & {
  pathParams?: Record<string, unknown>;
  searchParams?: Record<string, unknown>;
};

const instances: KyInstance[] = [];

export const create = <ApiResponseType>({
  arrayFormat = 'comma',
  hooks,
  prefixUrl = getBaseUrl(),
  useSnakeCase = true,
  ...apiOptions
}: CreateOptions = {}) => {
  const kyInstance = ky.create({
    hooks: getHooks(useSnakeCase, hooks),
    prefixUrl,
    ...apiOptions,
  });

  instances.push(kyInstance);

  return async (
    uri: string,
    {pathParams, searchParams, ...options}: RequestOptions = {}
  ) =>
    kyInstance<ApiResponseType>(
      getUri(uri, {arrayFormat, pathParams, searchParams, useSnakeCase}),
      options
    ).json();
};

// Set Authorization Bearer header for all instances
export const setApiAuthorization = (token: string) => {
  instances.forEach((kyInstance) => {
    kyInstance.extend({
      hooks: {
        beforeRequest: [
          async (request) => {
            request.headers.set('Authorization', `Bearer ${token}`);
          },
        ],
      },
    });
  });
};

const apiLanguage = i18n.fallbackLng;

// Set Accept-Language header for all instances
export const setApiLanguage = (language: string) => {
  if (apiLanguage !== language) {
    instances.forEach((kyInstance) => {
      kyInstance.extend({
        hooks: {
          beforeRequest: [
            async (request) => {
              request.headers.set('Accept-Language', language);
            },
          ],
        },
      });
    });
  }
};
