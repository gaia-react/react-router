import type {FC, ReactNode} from 'react';
import {Links, Scripts, ScrollRestoration} from 'react-router';
import {twJoin} from 'tailwind-merge';
import type {Theme} from '~/state/theme';
import {ThemeHead} from '~/state/theme';
import MetaHydrated from './MetaHydrated';

type DocumentProps = {
  children: ReactNode;
  className?: string;
  dir?: string;
  isSsrTheme?: boolean;
  lang: string;
  // eslint-disable-next-line react/boolean-prop-naming
  noIndex?: boolean;
  theme?: Theme;
  title?: string;
};

const Document: FC<DocumentProps> = ({
  children,
  className,
  dir,
  isSsrTheme,
  lang,
  noIndex,
  theme,
  title,
}) => (
  <html
    className={twJoin(theme === 'dark' && 'dark', className)}
    dir={dir}
    lang={lang}
    suppressHydrationWarning={true}
  >
    <head>
      <meta charSet="utf-8" />
      <meta content="width=device-width,initial-scale=1" name="viewport" />
      <MetaHydrated />
      <Links />
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link
        crossOrigin="anonymous"
        href="https://fonts.gstatic.com"
        rel="preconnect"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
        rel="stylesheet"
      />
      <ThemeHead isSsrTheme={isSsrTheme} />
      {noIndex && <meta content="noindex" name="robots" />}
      {title && <title>{title}</title>}
    </head>
    <body>
      {children}
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
);

export default Document;
