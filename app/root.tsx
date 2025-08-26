import type {FC} from 'react';
import {useEffect} from 'react';
import type {
  LoaderFunctionArgs,
  unstable_RouterContextProvider,
} from 'react-router';
import {useTranslation} from 'react-i18next';
import {data, Outlet, useLoaderData} from 'react-router';
import {config} from '@fortawesome/fontawesome-svg-core';
import * as Tooltip from '@radix-ui/react-tooltip';
import {useChangeLanguage} from 'remix-i18next/react';
import {getToast, setToastCookieOptions} from 'remix-toast';
import {twJoin} from 'tailwind-merge';
import Document from '~/components/Document';
import RootErrorBoundary from '~/components/RootErrorBoundary';
import Toast, {toast as notify} from '~/components/Toast';
import {getLanguage, i18nextMiddleware} from '~/middleware/i18next';
import {setApiLanguage} from '~/services/api';
import {getAuthenticatedUser} from '~/sessions.server/auth';
import {languageCookie} from '~/sessions.server/language';
import {getThemeSession} from '~/sessions.server/theme';
import State from '~/state';
import {useTheme} from '~/state/theme';
import {isProductionHost} from '~/utils/http.server';
import {env, envClient} from './env.server';
import './styles/tailwind.css';

config.autoAddCss = false;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_middleware = [i18nextMiddleware];

export const loader = async ({context, request}: LoaderFunctionArgs) => {
  const isProduction = isProductionHost(request);

  const user = await getAuthenticatedUser(request);

  const language = getLanguage(context as unstable_RouterContextProvider);

  setApiLanguage(language);

  const themeSession = await getThemeSession(request);

  setToastCookieOptions({secrets: [env.SESSION_SECRET]});

  const {headers, toast} = await getToast(request);

  headers.append('Set-Cookie', await languageCookie.serialize(language));

  headers.set('Vary', 'Cookie');

  return data(
    {
      ENV: envClient,
      language,
      noIndex: !isProduction,
      theme: themeSession.getTheme(),
      toast,
      user,
    },
    {headers}
  );
};

const App: FC = () => {
  const loaderData = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  const {i18n} = useTranslation();

  const {ENV, language, noIndex, toast} = loaderData;

  useChangeLanguage(language);

  useEffect(() => {
    if (toast) {
      notify[toast.type](toast);
    }
  }, [toast]);

  return (
    <Document
      className={twJoin(theme)}
      dir={i18n.dir(i18n.language)}
      isSsrTheme={!!loaderData.theme}
      lang={i18n.language}
      noIndex={noIndex}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: `window.process = ${JSON.stringify({
            env: ENV,
          })}`,
        }}
      />
      <Tooltip.Provider>
        <Outlet />
      </Tooltip.Provider>
      <Toast />
    </Document>
  );
};

const AppWithState = () => {
  const {theme, user} = useLoaderData<typeof loader>();

  return (
    <State theme={theme} user={user}>
      <App />
    </State>
  );
};

export default AppWithState;

export const ErrorBoundary = RootErrorBoundary;
