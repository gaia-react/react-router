export const range = (start: number, end: number) =>
  (Array(end - start + 1) as number[])
    .fill(start)
    .map((value, index) => value + index);

export const uniqBy = <T, K extends keyof T>(
  array: T[],
  iteratee: (item: T) => T[K]
) =>
  array.filter(
    (value, index, self) =>
      index === self.findIndex((other) => iteratee(other) === iteratee(value))
  );

export const sortBy = <T>(array: T[], key: keyof T): T[] =>
  array.toSorted((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    return (
      valueA < valueB ? -1
      : valueA > valueB ? 1
      : 0
    );
  });
