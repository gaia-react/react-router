import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
  unstable_RouterContextProvider,
} from 'react-router';
import {data, useLoaderData} from 'react-router';
import {redirectWithInfo} from 'remix-toast';
import {getInstance} from '~/middleware/i18next';
import ThingPage from '~/pages/Public/Things/ThingPage';
import {attempt} from '~/services/api/helpers';
import {api} from '~/services/index.server';

export const action: ActionFunction = async ({context, request}) => {
  if (request.method === 'PUT') {
    const formData = await request.formData();

    const [error] = await attempt(async () =>
      api.gaia.things.updateThing(formData)
    );

    const i18next = getInstance(context as unstable_RouterContextProvider);

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

export const loader = async ({params}: LoaderFunctionArgs) => {
  const thing = await api.gaia.things.getThingById(params.id!);

  return {thing};
};

export const meta: MetaFunction<typeof loader> = ({loaderData}) => [
  {title: loaderData?.thing.name},
  {
    content: loaderData?.thing.description,
    name: 'description',
  },
];

const ThingRoute = () => {
  const {thing} = useLoaderData<typeof loader>();

  return <ThingPage thing={thing} />;
};

export default ThingRoute;
