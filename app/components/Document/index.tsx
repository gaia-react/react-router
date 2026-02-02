import type {FC, ReactNode} from 'react';
import {Links, Meta, Scripts, ScrollRestoration} from 'react-router';
import ClientHintCheck from './ClientHintCheck';
import MetaHydrated from './MetaHydrated';

type DocumentProps = {
  children: ReactNode;
  className?: string;
  dir?: string;
  lang: string;
  // eslint-disable-next-line react/boolean-prop-naming
  noIndex?: boolean;
  title?: string;
};

const Document: FC<DocumentProps> = ({
  children,
  className,
  dir,
  lang,
  noIndex,
  title,
}) => (
  <html className={className} dir={dir} lang={lang}>
    <head>
      <ClientHintCheck />
      <meta charSet="utf-8" />
      <meta content="width=device-width,initial-scale=1" name="viewport" />
      <MetaHydrated />
      <Meta />
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
