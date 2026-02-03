import type {ActionFunction, RouterContextProvider} from 'react-router';
import {redirect} from 'react-router';
import {redirectWithInfo} from 'remix-toast';
import {getInstance} from '~/middleware/i18next';
import {sessionStorage} from '~/sessions.server/auth';

export const action: ActionFunction = async ({context, request}) => {
  const session = await sessionStorage.getSession(
    request.headers.get('cookie')
  );

  const i18next = getInstance(context as RouterContextProvider);
  const message = i18next.t('loggedOut', {ns: 'auth'});

  return redirectWithInfo('/', message, {
    headers: {'Set-Cookie': await sessionStorage.destroySession(session)},
  });
};

export const loader = async () => redirect('/', {status: 404});
