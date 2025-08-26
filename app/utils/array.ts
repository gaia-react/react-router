export const range = (start: number, end: number) =>
  (Array(end - start + 1) as number[])
    .fill(start)
    .map((value, index) => value + index);
