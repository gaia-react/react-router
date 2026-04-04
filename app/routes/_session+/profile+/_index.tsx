import type {RouterContextProvider} from 'react-router';
import {useLoaderData} from 'react-router';
import {getInstance} from '~/middleware/i18next';
import ProfilePage from '~/pages/Session/Profile/ProfilePage';
import type {Route} from './+types/_index';

export const loader = async ({context}: Route.LoaderArgs) => {
  const i18next = getInstance(context as RouterContextProvider);
  const title = i18next.t('profile.meta.title', {ns: 'pages'});

  return {title};
};

const ProfileRoute = () => {
  const {title} = useLoaderData<typeof loader>();

  return (
    <>
      <title>{title}</title>
      <ProfilePage />
    </>
  );
};

export default ProfileRoute;
