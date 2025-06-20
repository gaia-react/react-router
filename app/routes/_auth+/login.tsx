import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from 'react-router';
import {redirect} from 'react-router';
import {getInstance} from '~/middleware/i18next';
import LoginPage from '~/pages/Auth/LoginPage';
import {
  authenticator,
  requireNotAuthenticated,
  sessionStorage,
} from '~/sessions.server/auth';

export const action: ActionFunction = async ({context, request}) => {
  const user = await authenticator.authenticate('form', request);

  if (!user) {
    const i18next = getInstance(context);

    return {error: i18next.t('invalidCredentials', {ns: 'errors'})};
  }

  const session = await sessionStorage.getSession(
    request.headers.get('cookie')
  );

  session.set('user', user);

  throw redirect('/profile', {
    headers: {'Set-Cookie': await sessionStorage.commitSession(session)},
  });
};

export const loader = async ({context, request}: LoaderFunctionArgs) => {
  await requireNotAuthenticated(request);

  const i18next = getInstance(context);
  const title = i18next.t('login', {ns: 'auth'});

  return {title};
};

export const meta: MetaFunction<typeof loader> = ({data}) => [
  {title: data?.title},
];

const LoginRoute = () => <LoginPage />;

export default LoginRoute;
