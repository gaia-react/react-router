import {Outlet} from 'react-router';
import Layout from '~/components/Layout';
import {requireAuthenticatedUser} from '~/sessions.server/auth';
import type {Route} from './+types/_layout';

// routes inside _session+ require a session

export const loader = async ({request}: Route.LoaderArgs) => {
  await requireAuthenticatedUser(request);

  return null;
};

const SessionRoute = () => (
  <Layout>
    <Outlet />
  </Layout>
);

export default SessionRoute;
