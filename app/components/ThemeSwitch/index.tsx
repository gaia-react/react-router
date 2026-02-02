import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useFetcher} from 'react-router';
import {faMoon, faSun} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useForm} from '@rvf/react-router';
import {ServerOnly} from 'remix-utils/server-only';
import {twMerge} from 'tailwind-merge';
import {z} from 'zod';
import {useRequestInfo} from '~/hooks/useRequestInfo';
import type {action} from '~/routes/action+/theme-switch';
import {
  themeSchema,
  useOptimisticThemeMode,
} from '~/routes/action+/theme-switch';
import type {Theme} from '~/types';

type ThemeSwitchProps = {
  className?: string;
  userPreference?: null | Theme;
};

const ThemeSwitch: FC<ThemeSwitchProps> = ({className, userPreference}) => {
  const {t} = useTranslation('common', {keyPrefix: 'theme'});

  const fetcher = useFetcher<typeof action>();
  const requestInfo = useRequestInfo();

  const form = useForm({
    action: '/action/theme-switch',
    defaultValues: {theme: fetcher.data?.result},
    id: 'theme-switch',
    method: 'POST',
    reloadDocument: true,
    schema: z.object({theme: themeSchema}),
  });

  const optimisticTheme = useOptimisticThemeMode();

  const theme = optimisticTheme ?? userPreference ?? 'system';

  const nextTheme =
    theme === 'system' ? 'light'
    : theme === 'light' ? 'dark'
    : 'system';

  return (
    <fetcher.Form {...form.getFormProps()}>
      <ServerOnly>
        {() => (
          <input name="redirectTo" type="hidden" value={requestInfo.path} />
        )}
      </ServerOnly>
      <input name="theme" type="hidden" value={nextTheme} />
      <button
        aria-label={
          theme === 'dark' ? t('enableLightMode') : t('enableDarkMode')
        }
        className={twMerge(
          'relative flex items-center gap-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900',
          className
        )}
        type="submit"
      >
        {theme === 'dark' ?
          <FontAwesomeIcon icon={faMoon} size="sm" transform={{rotate: -20}} />
        : <FontAwesomeIcon icon={faSun} size="sm" />}
      </button>
    </fetcher.Form>
  );
};

export default ThemeSwitch;
