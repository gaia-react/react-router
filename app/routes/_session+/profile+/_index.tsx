import type {
  LoaderFunctionArgs,
  MetaFunction,
  RouterContextProvider,
} from 'react-router';
import {data} from 'react-router';
import {getInstance} from '~/middleware/i18next';
import ProfilePage from '~/pages/Session/Profile/ProfilePage';

export const loader = async ({context}: LoaderFunctionArgs) => {
  const i18next = getInstance(context as RouterContextProvider);
  const title = i18next.t('profile.meta.title', {ns: 'pages'});

  return data({title});
};

export const meta: MetaFunction<typeof loader> = ({loaderData}) => [
  {title: loaderData?.title},
];

const ProfileRoute = () => <ProfilePage />;

export default ProfileRoute;
