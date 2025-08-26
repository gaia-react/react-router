import {camelCase, isObject, snakeCase} from 'lodash';
import SparkMD5 from 'spark-md5';

export const every = (
  obj: Record<string, unknown>,
  predicate: (value: unknown) => boolean
): boolean => {
  const values = Object.values(obj);

  return values.length > 0 && values.every(predicate);
};

export const some = (
  obj: Record<string, unknown>,
  predicate: (value: unknown) => boolean
): boolean => Object.values(obj).some(predicate);

export const md5 = (obj: Record<string, unknown>): string =>
  SparkMD5.hash(JSON.stringify(obj));

export const isNil = (value: unknown): boolean =>
  value === null || value === undefined;

export const deepRemoveNil = (input: unknown): unknown => {
  if (isNil(input)) {
    return;
  }

  if (Array.isArray(input)) {
    return input
      .filter((value) => !isNil(value))
      .map((value) => deepRemoveNil(value));
  }

  if (isObject(input)) {
    const keys = Object.keys(input);

    return Object.fromEntries(
      keys
        .filter((key) => !isNil((input as Record<string, unknown>)[key]))
        .map((key) => [
          key,
          deepRemoveNil((input as Record<string, unknown>)[key]),
        ])
    );
  }

  return input;
};

export const mapKeys = (
  obj: Record<string, unknown>,
  fn: (key: string) => string
): Record<string, unknown> =>
  Object.entries(obj).reduce((acc: Record<string, unknown>, [key, value]) => {
    acc[fn(key)] = value;

    return acc;
  }, {});

export const mapValues = (
  obj: Record<string, unknown>,
  fn: (p: unknown) => unknown
): Record<string, unknown> =>
  Object.entries(obj).reduce((acc: Record<string, unknown>, [key, value]) => {
    acc[key] = fn(value);

    return acc;
  }, {});

export const convertCase = (
  fn: (s: string) => string,
  obj: unknown
): unknown => {
  if (obj === undefined) {
    return;
  }

  if (Array.isArray(obj)) {
    return obj.map((value: unknown) => convertCase(fn, value));
  }

  if (isObject(obj)) {
    return Object.entries(obj).reduce(
      (acc: Record<string, unknown>, [key, value]) => {
        if (Array.isArray(value)) {
          acc[fn(key)] = value.map<unknown>((item) =>
            isObject(item) ? convertCase(fn, item) : item
          );
        } else if (isObject(value)) {
          acc[fn(key)] = convertCase(fn, value);
        } else {
          acc[fn(key)] = value;
        }

        return acc;
      },
      {}
    );
  }

  return obj;
};

export const toSnakeCase = <T = unknown>(obj: unknown) =>
  obj ? (convertCase(snakeCase, obj) as T) : undefined;

export const toCamelCase = <T = unknown>(obj: unknown) =>
  obj ? (convertCase(camelCase, obj) as T) : undefined;

export const compact = (
  obj: Record<string, unknown>,
  options?: {keepEmptyArray?: boolean; keepFalsy?: boolean}
): Record<string, unknown> =>
  Object.entries(obj).reduce((acc: Record<string, unknown>, [key, value]) => {
    if (
      ((options?.keepFalsy && !isNil(value)) || value) &&
      (!Array.isArray(value) || options?.keepEmptyArray || value.length > 0)
    ) {
      acc[key] = value;
    }

    return acc;
  }, {});
