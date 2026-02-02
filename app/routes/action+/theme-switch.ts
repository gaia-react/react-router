import type {ActionFunctionArgs} from 'react-router';
import {data, redirect, useFetchers} from 'react-router';
import {invariantResponse} from '@epic-web/invariant';
import {z} from 'zod';
import {useRequestInfo} from '~/hooks/useRequestInfo';
import type {Theme} from '~/types';
import {useHints} from '~/utils/client-hints';
import {setTheme} from '~/utils/theme.server';

export const themeSchema = z.literal(['dark', 'light', 'system']);

const parseTheme = (formData: FormData) => {
  const theme = formData.get('theme') as Theme;

  return themeSchema.safeParse(theme);
};

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();

  const redirectTo = formData.get('redirectTo') as string;

  const submission = parseTheme(formData);

  invariantResponse(submission.success, 'Invalid theme received');

  const responseInit = {
    headers: {'Set-Cookie': setTheme(submission.data)},
  };

  if (redirectTo) {
    return redirect(redirectTo, responseInit);
  }

  return data({result: submission.data}, responseInit);
};

/**
 * If the user's changing their theme mode preference, this will return the
 * value it's being changed to.
 */
export const useOptimisticThemeMode = () => {
  const fetchers = useFetchers();
  const themeFetcher = fetchers.find(
    (f) => f.formAction === '/resources/theme-switch'
  );

  if (themeFetcher?.formData) {
    const submission = parseTheme(themeFetcher.formData);

    if (submission.success) {
      return submission.data;
    }
  }
};

/**
 * @returns the user's theme preference, or the client hint theme if the user
 * has not set a preference.
 */
export const useTheme = () => {
  const hints = useHints();
  const requestInfo = useRequestInfo();
  const optimisticMode = useOptimisticThemeMode();

  if (optimisticMode) {
    return optimisticMode === 'system' ? hints.theme : optimisticMode;
  }

  return requestInfo.userPreferences.theme ?? hints.theme;
};
