import type {RouterContextProvider} from 'react-router';
import {data, useLoaderData} from 'react-router';
import {redirectWithSuccess} from 'remix-toast';
import {getInstance} from '~/middleware/i18next';
import CreateThingPage from '~/pages/Public/Things/CreateThingPage';
import {attempt} from '~/services/api/helpers';
import {api} from '~/services/index.server';
import type {Route} from './+types/create';

export const action = async ({context, request}: Route.ActionArgs) => {
  if (request.method === 'POST') {
    const formData = await request.formData();

    const [error] = await attempt(async () =>
      api.gaia.things.createThing(formData)
    );

    const i18next = getInstance(context as RouterContextProvider);

    if (error) {
      return data(
        {error: i18next.t('things.duplicateName', {ns: 'pages'})},
        error
      );
    }

    return redirectWithSuccess(
      '/things',
      i18next.t('things.thingCreated', {ns: 'pages'}),
      {
        status: 303,
      }
    );
  }

  return data(null, {status: 400});
};

export const loader = async ({context}: Route.LoaderArgs) => {
  const i18next = getInstance(context as RouterContextProvider);
  const title = i18next.t('things.meta.title', {ns: 'pages'});
  const description = i18next.t('things.meta.description', {ns: 'pages'});

  return {description, title};
};

const CreateThingRoute = () => {
  const {description, title} = useLoaderData<typeof loader>();

  return (
    <>
      <title>{title}</title>
      <meta content={description} name="description" />
      <CreateThingPage />
    </>
  );
};

export default CreateThingRoute;
