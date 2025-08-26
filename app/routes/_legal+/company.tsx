import type {
  LoaderFunctionArgs,
  MetaFunction,
  unstable_RouterContextProvider,
} from 'react-router';
import {useLoaderData} from 'react-router';
import Layout from '~/components/Layout';
import {getInstance} from '~/middleware/i18next';

export const loader = ({context}: LoaderFunctionArgs) => {
  const i18next = getInstance(context as unstable_RouterContextProvider);
  const title = i18next.t('legal.company.title', {ns: 'pages'});
  const description = i18next.t('legal.company.description', {ns: 'pages'});

  return {description, title};
};

export const meta: MetaFunction<typeof loader> = ({loaderData}) => [
  {title: loaderData?.title},
  {
    content: loaderData?.description,
    name: 'description',
  },
];

const CompanyRoute = () => {
  const {description, title} = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="prose dark:prose-invert pt-4">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </Layout>
  );
};

export default CompanyRoute;
