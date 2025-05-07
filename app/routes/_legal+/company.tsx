import type {LoaderFunctionArgs, MetaFunction} from 'react-router';
import {useLoaderData} from 'react-router';
import Layout from '~/components/Layout';
import i18next from '~/i18next.server';

export const loader = async ({request}: LoaderFunctionArgs) => {
  const t = await i18next.getFixedT(request, 'pages');
  const title = t('legal.company.title');
  const description = t('legal.company.description');

  return {description, title};
};

export const meta: MetaFunction<typeof loader> = ({data}) => [
  {title: data?.title},
  {
    content: data?.description,
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
