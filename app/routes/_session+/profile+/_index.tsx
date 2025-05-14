import type {LoaderFunctionArgs, MetaFunction} from 'react-router';
import {data} from 'react-router';
import {getInstance} from '~/middleware/i18next';
import ProfilePage from '~/pages/Session/Profile/ProfilePage';

export const loader = async ({context}: LoaderFunctionArgs) => {
  const i18next = getInstance(context);
  const title = i18next.t('profile.meta.title', {ns: 'pages'});

  return data({title});
};

export const meta: MetaFunction<typeof loader> = (loaderData) => [
  {title: loaderData?.data?.title},
];

const ProfileRoute = () => <ProfilePage />;

export default ProfileRoute;
