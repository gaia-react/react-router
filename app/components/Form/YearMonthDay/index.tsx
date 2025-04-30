import type {ComponentProps, FC, FormEvent, ReactNode} from 'react';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {
  addDays,
  differenceInDays,
  endOfMonth,
  set,
  startOfMonth,
} from 'date-fns';
import {
  formatAbbreviatedMonth,
  formatFullYear,
  formatOrdinalDay,
} from '~/utils/date';
import FieldLabel from '../Field/FieldLabel';
import Select from '../Select';
import {
  DEFAULT_DATE,
  DEFAULT_VALUE,
  getSafeValue,
  getValues,
  MONTHS,
  YEARS,
} from './utils';

export type YearMonthDayProps = Omit<ComponentProps<'select'>, 'onChange'> & {
  className?: string;
  error?: ReactNode;
  label?: string;
  name?: string;
  onBlur?: () => void;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
};

const YearMonthDay: FC<YearMonthDayProps> = ({
  className,
  error,
  label,
  name = 'dob',
  onBlur,
  onChange,
  ref,
  required,
  value = DEFAULT_VALUE,
}) => {
  const {
    i18n: {language},
    t,
  } = useTranslation('common');

  const [year, month, date] = getValues(value);

  const handleChange = (event: FormEvent<HTMLSelectElement>) => {
    if (event.currentTarget.name.includes('Date')) {
      onChange(`${year}-${month}-${event.currentTarget.value}`);
    } else {
      onChange(getSafeValue(value, event.currentTarget));
    }
  };

  const years = useMemo(
    () =>
      YEARS.map((y) => ({
        label: formatFullYear(set(DEFAULT_DATE, {year: y}), language),
        value: String(y),
      })),
    [language]
  );

  const months = useMemo(
    () =>
      MONTHS.map((m) => ({
        label: formatAbbreviatedMonth(
          set(DEFAULT_DATE, {month: m - 1}),
          language
        ),
        value: String(m).padStart(2, '0'),
      })),
    [language]
  );

  const dates = useMemo(() => {
    const current = set(DEFAULT_DATE, {
      month: month ? +month - 1 : 0,
      year: year ? +year : 2000,
    });
    const start = startOfMonth(current);
    const end = endOfMonth(current);

    return Array(differenceInDays(end, start) + 1)
      .fill(start)
      .map((s, index) => {
        const d = addDays(s, index);

        return {
          label:
            language === 'en' ?
              String(d.getDate())
            : formatOrdinalDay(d, language),
          value: String(d.getDate()).padStart(2, '0'),
        };
      });
  }, [language, month, year]);

  return (
    <fieldset className={className} onBlur={onBlur}>
      <FieldLabel error={error} isLegend={true} required={required}>
        {label ?? t('form.dateOfBirth')}
      </FieldLabel>
      <div className="mt-2 flex justify-between gap-4 md:gap-6">
        <input name={name} type="hidden" value={value} />
        <Select
          ref={ref}
          aria-label={t('date.year')}
          className="flex-1"
          name={`${name}Year`}
          onChange={handleChange}
          options={years}
          value={year}
        />
        <Select
          aria-label={t('date.month')}
          className="flex-1"
          name={`${name}Month`}
          onChange={handleChange}
          options={months}
          value={month}
        />
        <Select
          aria-label={t('date.day')}
          className="flex-1"
          name={`${name}Date`}
          onChange={handleChange}
          options={dates}
          value={date}
        />
      </div>
    </fieldset>
  );
};

export default YearMonthDay;
