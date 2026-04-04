import type {RouterContextProvider} from 'react-router';
import {useLoaderData} from 'react-router';
import Layout from '~/components/Layout';
import {getInstance} from '~/middleware/i18next';
import type {Route} from './+types/privacy';

export const loader = async ({context}: Route.LoaderArgs) => {
  const i18next = getInstance(context as RouterContextProvider);
  const title = i18next.t('legal.privacy.title', {ns: 'pages'});
  const description = i18next.t('legal.privacy.description', {ns: 'pages'});

  return {description, title};
};

const PrivacyRoute = () => {
  const {description, title} = useLoaderData<typeof loader>();

  return (
    <Layout>
      <title>{title}</title>
      <meta content={description} name="description" />
      <div className="prose dark:prose-invert p-4">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </Layout>
  );
};

export default PrivacyRoute;
