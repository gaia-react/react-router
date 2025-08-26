import type {
  LoaderFunctionArgs,
  MetaFunction,
  unstable_RouterContextProvider,
} from 'react-router';
import {getInstance} from '~/middleware/i18next';
import IndexPage from '~/pages/Public/IndexPage';

export const loader = async ({context}: LoaderFunctionArgs) => {
  const i18next = getInstance(context as unstable_RouterContextProvider);
  const title = i18next.t('index.meta.title', {ns: 'pages'});
  const description = i18next.t('index.meta.description', {ns: 'pages'});

  return {description, title};
};

export const meta: MetaFunction<typeof loader> = ({loaderData}) => [
  {title: loaderData?.title},
  {
    content: loaderData?.description,
    name: 'description',
  },
];

const IndexRoute = () => <IndexPage />;

export default IndexRoute;
