/* eslint-disable @typescript-eslint/no-unnecessary-condition */
export const canUseDOM = !!(
  typeof window !== 'undefined' && window.document?.createElement
);
