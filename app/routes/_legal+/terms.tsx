import type {RouterContextProvider} from 'react-router';
import {useTranslation} from 'react-i18next';
import {useLoaderData} from 'react-router';
import Layout from '~/components/Layout';
import {getInstance} from '~/middleware/i18next';
import type {Route} from './+types/terms';

export const loader = async ({context}: Route.LoaderArgs) => {
  const i18next = getInstance(context as RouterContextProvider);
  const title = i18next.t('legal.terms.title', {ns: 'pages'});
  const description = i18next.t('legal.terms.description', {ns: 'pages'});

  return {description, title};
};

const TermsRoute = () => {
  const {description, title} = useLoaderData<typeof loader>();
  const {t} = useTranslation('pages', {keyPrefix: 'legal.terms'});
  const raw = t('paragraphs', {returnObjects: true});
  const paragraphs = Array.isArray(raw) ? (raw as readonly string[]) : [];

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

export default TermsRoute;
