import type {FormatFunction} from 'i18next';
import resources, {LANGUAGES} from '~/languages';

const formatFn: FormatFunction = (value: any, format?: string) =>
  format === 'number' ? Number(value).toLocaleString() : value;

const i18n = {
  defaultNS: 'common',
  fallbackLng: 'en',
  fallbackNS: ['common'],
  interpolation: {
    escapeValue: false,
    format: formatFn,
  },
  lowerCaseLng: true,
  react: {useSuspense: false},
  resources,
  returnNull: false,
  supportedLngs: LANGUAGES,
};

export default i18n;
