/* eslint-disable prefer-arrow/prefer-arrow-functions,no-console */
/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type {RenderToPipeableStreamOptions} from 'react-dom/server';
import type {EntryContext, unstable_RouterContextProvider} from 'react-router';
import {renderToPipeableStream} from 'react-dom/server';
import {I18nextProvider} from 'react-i18next';
import {ServerRouter} from 'react-router';
import {createReadableStreamFromReadable} from '@react-router/node';
import {isbot} from 'isbot';
import {PassThrough} from 'node:stream';
import {getInstance} from '~/middleware/i18next';
import {startApiMocks} from '../test/msw.server';
import {env} from './env.server';
import 'dotenv/config';

if (env.NODE_ENV !== 'production' && env.MSW_ENABLED) {
  startApiMocks();
}

const streamTimeout = 5000;

// eslint-disable-next-line max-params
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  entryContext: EntryContext,
  routerContext: unstable_RouterContextProvider
) {
  let shellRendered = false;

  const url = new URL(request.url);

  // disallow www subdomain
  if (url.host.includes('www.')) {
    url.host = url.host.replace('www.', '');

    return Response.redirect(url.toString(), 301);
  }

  // remove trailing slash on all routes
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);

    return Response.redirect(url.toString(), 301);
  }

  // force lowercase URLs to prevent duplicate content for SEO
  if (url.pathname !== url.pathname.toLowerCase()) {
    url.pathname = url.pathname.toLowerCase();

    return Response.redirect(url.toString(), 301);
  }

  const userAgent = request.headers.get('user-agent') ?? '';

  const readyOption: keyof RenderToPipeableStreamOptions =
    (userAgent && isbot(userAgent)) || entryContext.isSpaMode ?
      'onAllReady'
    : 'onShellReady';

  return new Promise((resolve, reject) => {
    const {abort, pipe} = renderToPipeableStream(
      <I18nextProvider i18n={getInstance(routerContext)}>
        <ServerRouter context={entryContext} url={request.url} />
      </I18nextProvider>,
      {
        onError(error: unknown) {
          // eslint-disable-next-line sonarjs/no-parameter-reassignment
          responseStatusCode = 500;

          if (shellRendered) {
            console.error(error);
          }
        },
        onShellError(error: unknown) {
          reject(error);
        },
        [readyOption]: () => {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          /* Optional response headers for SEO
          responseHeaders.set(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains'
          );
          responseHeaders.set('X-Content-Type-Options', 'nosniff');
          responseHeaders.set('X-Frame-Options', 'DENY');
          */

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
      }
    );

    setTimeout(abort, streamTimeout + 1000);
  });
}
