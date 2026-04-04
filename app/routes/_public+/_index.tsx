import type {RouterContextProvider} from 'react-router';
import {useLoaderData} from 'react-router';
import {getInstance} from '~/middleware/i18next';
import IndexPage from '~/pages/Public/IndexPage';
import type {Route} from './+types/_index';

export const loader = async ({context}: Route.LoaderArgs) => {
  const i18next = getInstance(context as RouterContextProvider);
  const title = i18next.t('index.meta.title', {ns: 'pages'});
  const description = i18next.t('index.meta.description', {ns: 'pages'});

  return {description, title};
};

const IndexRoute = () => {
  const {description, title} = useLoaderData<typeof loader>();

  return (
    <>
      <title>{title}</title>
      <meta content={description} name="description" />
      <IndexPage />
    </>
  );
};

export default IndexRoute;
