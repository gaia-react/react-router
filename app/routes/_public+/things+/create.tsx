import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
  unstable_RouterContextProvider,
} from 'react-router';
import {data} from 'react-router';
import {redirectWithSuccess} from 'remix-toast';
import {getInstance} from '~/middleware/i18next';
import CreateThingPage from '~/pages/Public/Things/CreateThingPage';
import {attempt} from '~/services/api/helpers';
import {api} from '~/services/index.server';

export const action: ActionFunction = async ({context, request}) => {
  if (request.method === 'POST') {
    const formData = await request.formData();

    const [error] = await attempt(async () =>
      api.gaia.things.createThing(formData)
    );

    const i18next = getInstance(context as unstable_RouterContextProvider);

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

export const loader = async ({context}: LoaderFunctionArgs) => {
  const i18next = getInstance(context as unstable_RouterContextProvider);
  const title = i18next.t('things.meta.title', {ns: 'pages'});
  const description = i18next.t('things.meta.description', {ns: 'pages'});

  return {description, title};
};

export const meta: MetaFunction<typeof loader> = ({loaderData}) => [
  {title: loaderData?.title},
  {
    content: loaderData?.description,
    name: 'description',
  },
];

const CreateThingRoute = () => <CreateThingPage />;

export default CreateThingRoute;
