import type {RouterContextProvider} from 'react-router';
import {redirect, useLoaderData} from 'react-router';
import {getInstance} from '~/middleware/i18next';
import LoginPage from '~/pages/Auth/LoginPage';
import {
  authenticator,
  requireNotAuthenticated,
  sessionStorage,
} from '~/sessions.server/auth';
import type {Route} from './+types/login';

export const action = async ({context, request}: Route.ActionArgs) => {
  const user = await authenticator.authenticate('form', request);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!user) {
    const i18next = getInstance(context as RouterContextProvider);

    return {error: i18next.t('invalidCredentials', {ns: 'errors'})};
  }

  const session = await sessionStorage.getSession(
    request.headers.get('cookie')
  );

  session.set('user', user);

  return redirect('/profile', {
    headers: {'Set-Cookie': await sessionStorage.commitSession(session)},
  });
};

export const loader = async ({context, request}: Route.LoaderArgs) => {
  await requireNotAuthenticated(request);

  const i18next = getInstance(context as RouterContextProvider);
  const title = i18next.t('login', {ns: 'auth'});

  return {title};
};

const LoginRoute = () => {
  const {title} = useLoaderData<typeof loader>();

  return (
    <>
      <title>{title}</title>
      <LoginPage />
    </>
  );
};

export default LoginRoute;
