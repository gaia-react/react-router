import type {FormatFunction} from 'i18next';
import resources, {LANGUAGES} from '~/languages';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatFn: FormatFunction = (value: any, format?: string) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
