import {createCookieSessionStorage, redirect} from 'react-router';
import {Authenticator} from 'remix-auth';
import {FormStrategy} from 'remix-auth-form';
import SparkMD5 from 'spark-md5';
import {env} from '~/env.server';
import {setApiAuthorization} from '~/services/api';
import type {User} from '~/services/gaia/auth/types';
import {api} from '~/services/index.server';
import type {Maybe} from '~/types';

// Built on @sergiodxa's remix-auth
// https://github.com/sergiodxa/remix-auth

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    httpOnly: true, // for security reasons, make this cookie http only
    maxAge: 60 * 60, // 1 hour
    name: '__session', // use any name you want here
    path: '/', // remember to add this so the cookie will work in all routes
    sameSite: 'lax', // this helps with CSRF
    secrets: [env.SESSION_SECRET],
    secure: env.NODE_ENV === 'production', // for Safari compatability
  },
});

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>();

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({form}) => {
    const password = form.get('password');
    const hashedPassword = SparkMD5.hash(password as string);

    const formData = new FormData();
    formData.set('email', form.get('email') as string);
    formData.set('password', hashedPassword);

    const user = await api.gaia.auth.login(formData);

    setApiAuthorization(user.token);

    return user;
  }),
  'form'
);

export const getAuthenticatedUser = async (request: Request) => {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );

  return session.get('user') as Maybe<User>;
};

// utility for routes which require a session
export const requireAuthenticatedUser = async (request: Request) => {
  const session = await sessionStorage.getSession(
    request.headers.get('cookie')
  );
  const user = session.get('user') as Maybe<User>;

  if (!user) {
    throw redirect('/login');
  }

  return null;
};

//utility for routes which require no session (login, signup, forgot password)
export const requireNotAuthenticated = async (request: Request) => {
  const session = await sessionStorage.getSession(
    request.headers.get('cookie')
  );
  const user = session.get('user') as Maybe<User>;

  if (user) {
    throw redirect('/profile');
  }

  return null;
};
