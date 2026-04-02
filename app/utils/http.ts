export const toHeadersObject = (
  headers?: Headers | Record<string, string>
): Record<string, string> | undefined =>
  headers ?
    headers instanceof Headers ?
      Object.fromEntries(headers)
    : headers
  : undefined;
