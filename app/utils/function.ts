type TryCatchError = [error: Error, result: null | undefined];
type TryCatchResult<T> = TryCatchError | TryCatchSuccess<T>;
// Based on forthcoming Safe Assignment Operator ?=
// https://github.com/arthurfiorette/proposal-safe-assignment-operator
type TryCatchSuccess<T> = [error: null | undefined, result: Awaited<T>];

export const tryCatch = async <T, A extends readonly unknown[]>(
  fn: (...args: A) => T,
  ...args: A
): Promise<TryCatchResult<T>> => {
  let error;
  let result;

  try {
    result = await fn(...args);
  } catch (caughtError) {
    error = caughtError as Error;
  }

  if (result) {
    return [undefined, result] as TryCatchSuccess<T>;
  }

  return [error, undefined] as TryCatchError;
};

export const noop = () => {};

export const sleep = async (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
