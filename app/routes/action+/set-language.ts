import type {ActionFunction} from 'react-router';
import {data, redirect, replace} from 'react-router';
import {languageCookie} from '~/sessions.server/language';

export const action: ActionFunction = async ({request}) => {
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const language = form.get('language') as string;
  const redirectUrl = form.get('redirectUrl') as string;

  if (!['en', 'ja'].includes(language) || !redirectUrl) {
    return data(
      {
        message: `language value of ${language} is not a valid language`,
        ok: false,
      },
      {status: 400}
    );
  }

  return replace(redirectUrl, {
    headers: {
      'Set-Cookie': await languageCookie.serialize(language),
    },
  });
};

export const loader = async () => redirect('/', {status: 404});
