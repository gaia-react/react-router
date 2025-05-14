import {unstable_createI18nextMiddleware} from 'remix-i18next/middleware';
import i18n from '~/i18n';
import {languageCookie} from '~/sessions.server/language';

export const [i18nextMiddleware, getLanguage, getInstance] =
  unstable_createI18nextMiddleware({
    detection: {
      cookie: languageCookie,
      fallbackLanguage: i18n.fallbackLng,
      supportedLanguages: i18n.supportedLngs,
    },
    i18next: {
      ...i18n,
    },
  });
