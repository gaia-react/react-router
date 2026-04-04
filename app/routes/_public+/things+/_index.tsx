import type {RouterContextProvider} from 'react-router';
import {useLoaderData} from 'react-router';
import {dataWithError, dataWithSuccess} from 'remix-toast';
import {getInstance} from '~/middleware/i18next';
import AllThingsPage from '~/pages/Public/Things/AllThingsPage';
import {attempt} from '~/services/api/helpers';
import {ThingsProvider} from '~/services/gaia/things/state';
import {api} from '~/services/index.server';
import type {Route} from './+types/_index';

export const action = async ({context, request}: Route.ActionArgs) => {
  if (request.method === 'DELETE') {
    const result = await request.formData();

    const id = result.get('id') as string;

    if (id) {
      const i18next = getInstance(context as RouterContextProvider);

      const [error] = await attempt(async () =>
        api.gaia.things.deleteThing(id)
      );

      if (error) {
        return dataWithError({result: null}, error.statusText);
      }

      return dataWithSuccess(
        {result: null},
        i18next.t('things.thingDeleted', {ns: 'pages'})
      );
    }
  }

  return null;
};

export const loader = async ({context}: Route.LoaderArgs) => {
  const i18next = getInstance(context as RouterContextProvider);
  const title = i18next.t('things.meta.title', {ns: 'pages'});
  const description = i18next.t('things.meta.description', {ns: 'pages'});

  const things = await api.gaia.things.getAllThings();

  return {description, things, title};
};

const ThingsRoute = () => {
  const {description, things, title} = useLoaderData<typeof loader>();

  return (
    <>
      <title>{title}</title>
      <meta content={description} name="description" />
      <ThingsProvider things={things}>
        <AllThingsPage />
      </ThingsProvider>
    </>
  );
};

export default ThingsRoute;
