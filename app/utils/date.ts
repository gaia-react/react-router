import type {Locale} from 'date-fns';
import {format} from 'date-fns';
import {ja} from 'date-fns/locale';

const LOCALE_FORMATS: Record<string, Locale> = {
  ja,
};

// Jan 15, Nov 3, etc.
export const formatAbbreviatedMonthDay = (
  date: Date,
  language: string
): string =>
  format(
    date,
    `MMM d${language === 'en' ? '' : 'o'}`,
    language === 'en' ? undefined : {locale: LOCALE_FORMATS[language]}
  );

// Jan 15th, Nov 3rd, etc.
export const formatAbbreviatedMonthOrdinalDay = (
  date: Date,
  language: string
): string =>
  format(
    date,
    'MMM do',
    language === 'en' ? undefined : {locale: LOCALE_FORMATS[language]}
  );

export const formatISO8601Date = (date: Date): string =>
  format(date, 'yyyy-MM-dd');

export const formatFullDate = (date: Date, language: string): string =>
  language === 'en' ?
    format(date, 'PPPP')
  : format(date, 'PPPP', {
      locale: LOCALE_FORMATS[language],
    });

export const formatMY = (date = new Date()): string => format(date, 'MM/yy');

export const formatFullYear = (date: Date, language: string): string =>
  language === 'en' ? format(date, 'yyyy') : `${format(date, 'yyyy')}年`;

export const formatAbbreviatedMonth = (date: Date, language: string): string =>
  language === 'en' ?
    format(date, 'MMM')
  : format(date, 'MMM', {
      locale: LOCALE_FORMATS[language],
    });

export const formatOrdinalDay = (date: Date, language: string): string =>
  format(
    date,
    'do',
    language === 'en' ? undefined : {locale: LOCALE_FORMATS[language]}
  );

export const formatTime = (date: Date, language: string): string =>
  format(
    date,
    'p',
    language === 'en' ? undefined : {locale: LOCALE_FORMATS[language]}
  );

export const formatTime24 = (date: Date): string => format(date, 'HH:mm');
