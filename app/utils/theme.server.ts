import * as cookie from 'cookie';
import type {Theme} from '~/types';

const cookieName = 'theme';

export const getTheme = (request: Request) => {
  const cookieHeader = request.headers.get('cookie');
  const parsed =
    cookieHeader ? cookie.parse(cookieHeader)[cookieName] : 'light';

  if (parsed === 'light' || parsed === 'dark') {
    return parsed as Theme;
  }

  return null;
};

export const setTheme = (theme: 'system' | Theme) => {
  if (theme === 'system') {
    return cookie.serialize(cookieName, '', {maxAge: -1, path: '/'});
  }

  return cookie.serialize(cookieName, theme, {maxAge: 31_536_000, path: '/'});
};
