import type {LoaderFunctionArgs, MetaFunction} from 'react-router';
import {getInstance} from '~/middleware/i18next';
import IndexPage from '~/pages/Public/IndexPage';

export const loader = async ({context}: LoaderFunctionArgs) => {
  const i18next = getInstance(context);
  const title = i18next.t('index.meta.title', {ns: 'pages'});
  const description = i18next.t('index.meta.description', {ns: 'pages'});

  return {description, title};
};

export const meta: MetaFunction<typeof loader> = ({data}) => [
  {title: data?.title},
  {
    content: data?.description,
    name: 'description',
  },
];

const IndexRoute = () => <IndexPage />;

export default IndexRoute;
