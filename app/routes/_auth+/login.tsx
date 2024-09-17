import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import {json} from '@remix-run/node';
import {AuthorizationError} from 'remix-auth';
import {jsonWithError} from 'remix-toast';
import i18next from '~/i18next.server';
import LoginPage from '~/pages/Auth/LoginPage';
import {authenticator, requireNotAuthenticated} from '~/sessions.server/auth';
import {tryCatch} from '~/utils/function';

export const action: ActionFunction = async ({request}) => {
  const [error] = await tryCatch(async () =>
    authenticator.authenticate('email-password', request, {
      successRedirect: '/profile',
    })
  );

  if (error) {
    if (error instanceof Response) {
      return jsonWithError({result: null}, error.message);
    }

    if (error instanceof AuthorizationError) {
      return {error: 'invalidCredentials'};
    }

    return jsonWithError({result: null}, error.message);
  }

  return null;
};

export const loader = async ({request}: LoaderFunctionArgs) => {
  await requireNotAuthenticated(request);

  const t = await i18next.getFixedT(request, 'auth');
  const title = t('login');

  return json({title});
};

export const meta: MetaFunction<typeof loader> = ({data}) => [
  {title: data?.title},
];

const LoginRoute = () => <LoginPage />;

export default LoginRoute;
