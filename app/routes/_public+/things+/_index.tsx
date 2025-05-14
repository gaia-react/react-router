import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from 'react-router';
import {useLoaderData} from 'react-router';
import {dataWithError, dataWithSuccess} from 'remix-toast';
import {getInstance} from '~/middleware/i18next';
import AllThingsPage from '~/pages/Public/Things/AllThingsPage';
import {attempt} from '~/services/api/helpers';
import {ThingsProvider} from '~/services/gaia/things/state';
import {api} from '~/services/index.server';

export const action: ActionFunction = async ({context, request}) => {
  if (request.method === 'DELETE') {
    const result = await request.formData();

    const id = result.get('id') as string;

    if (id) {
      const i18next = getInstance(context);

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

export const loader = async ({context}: LoaderFunctionArgs) => {
  const i18next = getInstance(context);
  const title = i18next.t('things.meta.title', {ns: 'pages'});
  const description = i18next.t('things.meta.description', {ns: 'pages'});

  const things = await api.gaia.things.getAllThings();

  return {description, things, title};
};

export const meta: MetaFunction<typeof loader> = ({data}) => [
  {title: data?.title},
  {
    content: data?.description,
    name: 'description',
  },
];

const ThingsRoute = () => {
  const {things} = useLoaderData<typeof loader>();

  return (
    <ThingsProvider things={things}>
      <AllThingsPage />
    </ThingsProvider>
  );
};

export default ThingsRoute;
