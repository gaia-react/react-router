import type {Dispatch, FC, ReactNode, SetStateAction} from 'react';
import {createContext, useContext, useEffect, useRef, useState} from 'react';
import {useFetcher} from 'react-router';
import type {Maybe} from '~/types';
import {noop} from '~/utils/function';

// Based on a combination of Kent C Dodds' and Matt Stobb's blog posts:
// https://kentcdodds.com/blog/how-to-use-react-context-effectively
// https://www.mattstobbs.com/remix-dark-mode/

export type Theme = Maybe<'dark' | 'light'>;
const themes = ['dark', 'light'];

const LOCAL_STORAGE_KEY = 'theme';

type ThemeContextValue = [Theme, Dispatch<SetStateAction<Theme>>];

const ThemeContext = createContext<ThemeContextValue>([undefined, noop]);

export const useTheme = () => {
  const context = useContext(ThemeContext) as Maybe<ThemeContextValue>;

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

const prefersDarkMQ = '(prefers-color-scheme: dark)';

export const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (stored) {
    return stored as Theme;
  }

  return window.matchMedia(prefersDarkMQ).matches ? 'dark' : 'light';
};

type ThemeProviderProps = {
  children: ReactNode;
  initialState: Theme;
};

export const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  initialState,
}) => {
  const state = useState<Maybe<Theme>>(() => {
    // On the server, if we don't have a specified theme then we should
    // return null and the clientThemeCode will set the theme for us
    // before hydration. Then (during hydration), this code will get the same
    // value that clientThemeCode got so hydration is happy.
    if (initialState) {
      if (themes.includes(initialState)) {
        return initialState;
      }

      return null;
    }

    // there's no way for us to know what the theme should be in this context
    // the client will have to figure it out before hydration.
    if (typeof document === 'undefined') {
      return null;
    }

    return getPreferredTheme();
  });

  const [theme, setTheme] = state;

  const persistTheme = useFetcher();
  // TODO: remove this when persistTheme is memoized properly
  const persistThemeRef = useRef(persistTheme);
  useEffect(() => {
    persistThemeRef.current = persistTheme;
  }, [persistTheme]);

  const mountRun = useRef(false);

  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true;

      return;
    }

    if (!theme) {
      return;
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, theme);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    persistThemeRef.current.submit(
      {theme},
      {action: 'action/set-theme', method: 'POST'}
    );
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersDarkMQ);

    const handleChange = () => {
      setTheme(mediaQuery.matches ? 'dark' : 'light');
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        mediaQuery.matches ? 'dark' : 'light'
      );
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={state}>{children}</ThemeContext.Provider>
  );
};

const themeMatchMedia = `const theme = window.matchMedia(${JSON.stringify(
  prefersDarkMQ
)}).matches
    ? 'dark'
    : 'light';`;

const clientThemeCode = `
// hi there dear reader 👋
// this is how I make certain we avoid a flash of the wrong theme. If you select
// a theme, then I'll know what you want in the future and you'll not see this
// script anymore.
;(() => {
  ${themeMatchMedia}
  const cl = document.documentElement.classList;
  const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');
  if (themeAlreadyApplied) {
    // The theme is already applied...
    // this script shouldn't exist if the theme is already applied!
    console.warn(
      "Hi there, could you let me know you're seeing this message? Thanks!",
    );
  } else {
    cl.add(theme);
  }

  const meta = document.querySelector('meta[name=color-scheme]');
  if (meta) {
    if (theme === 'dark') {
      meta.content = 'dark light';
    } else if (theme === 'light') {
      meta.content = 'light dark';
    }
  } else {
    console.warn(
      "Hey, could you let me know you're seeing this message? Thanks!",
    );
  }
})();`
  // Remove double slash comments & replace excess white space with a single space.
  .replaceAll(/((?<=[^:])\/\/.*|\s)+/g, ' ')
  .trim();

type ThemeHeadProps = {
  isSsrTheme?: boolean;
};

export const ThemeHead: FC<ThemeHeadProps> = ({isSsrTheme}) => {
  const [theme] = useTheme();

  return (
    <>
      {/*
          On the server, "theme" might be `null`, so clientThemeCode ensures that
          this is correct before hydration.
      */}
      <meta
        content={theme === 'light' ? 'light dark' : 'dark light'}
        name="color-scheme"
      />
      {/*
        If we know what the theme is from the server then we don't need
        to do fancy tricks prior to hydration to make things match.
      */}
      {isSsrTheme ? null : (
        <script
          // NOTE: we cannot use type="module" because that automatically makes
          // the script "defer". That doesn't work for us because we need
          // this script to run synchronously before the rest of the document
          // is finished loading.
          dangerouslySetInnerHTML={{__html: clientThemeCode}}
        />
      )}
    </>
  );
};

export const isSupportedTheme = (value: unknown): value is Theme =>
  typeof value === 'string' && themes.includes(value);
