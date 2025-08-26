/* eslint-disable no-console */
import {isRouteErrorResponse} from 'react-router';
import type {Route} from '.react-router/types/app/+types/root';
import {twJoin} from 'tailwind-merge';
import Document from '~/components/Document';
import ErrorStack from '~/components/ErrorStack';
import {getPreferredTheme} from '~/state/theme';
import {canUseDOM} from '~/utils/dom';

const RootErrorBoundary = ({error}: Route.ErrorBoundaryProps) => {
  if (!canUseDOM) {
    // Server-Side log of error
    console.log(error);
  }
  const theme = getPreferredTheme();

  try {
    if (isRouteErrorResponse(error)) {
      return (
        <Document
          className={twJoin(theme)}
          lang="en"
          noIndex={true}
          title={error.statusText}
        >
          <main className="absolute inset-0 flex items-center justify-center p-4">
            <div className="flex flex-col items-center gap-5 text-center">
              <h1 className="flex items-center gap-4 text-2xl tracking-wide">
                <span className="text-2xl leading-none">{error.status}</span>
                {error.statusText && (
                  <>
                    <span className="mt-[0.1875rem] h-8 w-px bg-gray-900" />
                    <span className="mt-0.5 text-base leading-none font-light">
                      {error.statusText}
                    </span>
                  </>
                )}
              </h1>
              {process.env.NODE_ENV !== 'production' &&
                error.status !== 404 && (
                  <ErrorStack
                    className="max-h-[32rem] overflow-y-auto"
                    stack={error.data as string}
                  />
                )}
            </div>
          </main>
        </Document>
      );
    }
  } catch {
    // ignore
  }

  if (error instanceof Error) {
    return (
      <Document
        className={twJoin(theme)}
        lang="en"
        noIndex={true}
        title="Error"
      >
        <main className="space-y-4 p-4">
          <h1 className="text-2xl">Error</h1>
          <p>{error.message}</p>
          <ErrorStack stack={error.stack} />
        </main>
      </Document>
    );
  }

  return (
    <Document
      className={twJoin(theme)}
      lang="en"
      noIndex={true}
      title="Unexpected error"
    >
      <main className="p-4">
        <h1 className="text-2xl">An unexpected error occurred</h1>
      </main>
    </Document>
  );
};

export default RootErrorBoundary;
