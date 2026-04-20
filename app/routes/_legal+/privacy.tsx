import type {RouterContextProvider} from 'react-router';
import {useTranslation} from 'react-i18next';
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
  const {t} = useTranslation('pages', {keyPrefix: 'legal.privacy'});
  const paragraphs = t('paragraphs', {
    returnObjects: true,
  }) as readonly string[];

  return (
    <Layout>
      <title>{title}</title>
      <meta content={description} name="description" />
      <div className="prose dark:prose-invert p-8 sm:px-16">
        <h1>{title}</h1>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </Layout>
  );
};

export default PrivacyRoute;
