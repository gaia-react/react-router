import type {RouterContextProvider} from 'react-router';
import {data, useLoaderData} from 'react-router';
import {redirectWithInfo} from 'remix-toast';
import {getInstance} from '~/middleware/i18next';
import ThingPage from '~/pages/Public/Things/ThingPage';
import {attempt} from '~/services/api/helpers';
import {api} from '~/services/index.server';
import type {Route} from './+types/$id';

export const action = async ({context, request}: Route.ActionArgs) => {
  if (request.method === 'PUT') {
    const formData = await request.formData();

    const [error] = await attempt(async () =>
      api.gaia.things.updateThing(formData)
    );

    const i18next = getInstance(context as RouterContextProvider);

    if (error) {
      return data(
        {error: i18next.t('things.duplicateName', {ns: 'pages'})},
        error
      );
    }

    return redirectWithInfo(
      '/things',
      i18next.t('things.thingUpdated', {ns: 'pages'}),
      {status: 303}
    );
  }

  return data(null, {status: 400});
};

export const loader = async ({params}: Route.LoaderArgs) => {
  const thing = await api.gaia.things.getThingById(params.id);

  return {thing};
};

const ThingRoute = () => {
  const {thing} = useLoaderData<typeof loader>();

  return (
    <>
      <title>{thing.name}</title>
      <meta content={thing.description} name="description" />
      <ThingPage thing={thing} />
    </>
  );
};

export default ThingRoute;
