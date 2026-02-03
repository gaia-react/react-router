export const toInitialCap = (value?: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

export const toTitleCase = (value: string, delimiter = '_') =>
  value.split(delimiter).map(toInitialCap).join(' ');

export const isString = (value?: unknown) => typeof value === 'string';
