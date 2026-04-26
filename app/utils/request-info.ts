import {useRouteLoaderData} from 'react-router';
import type {getHints} from '~/utils/client-hints';
import type {Theme} from '~/utils/theme.server';

export type RequestInfo = {
  hints: ReturnType<typeof getHints>;
  origin: string;
  path: string;
  userPrefs: {theme: null | Theme};
};

type RootLoaderShape = {requestInfo: RequestInfo};

export const useRequestInfo = (): RequestInfo => {
  const data = useRouteLoaderData<RootLoaderShape>('root');

  if (!data?.requestInfo) {
    throw new Error('useRequestInfo: root loader data missing requestInfo');
  }

  return data.requestInfo;
};

export const useOptionalRequestInfo = (): RequestInfo | undefined => {
  const data = useRouteLoaderData<RootLoaderShape>('root');

  return data?.requestInfo;
};
