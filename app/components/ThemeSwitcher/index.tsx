import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {faMoon, faSun} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {twMerge} from 'tailwind-merge';
import {useTheme} from '~/state/theme';

type ThemeSwitchProps = {
  className?: string;
};

const ThemeSwitcher: FC<ThemeSwitchProps> = ({className}) => {
  const {t} = useTranslation('common', {keyPrefix: 'theme'});

  const [theme, setTheme] = useTheme();

  const handleClick = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      aria-label={theme === 'dark' ? t('enableLightMode') : t('enableDarkMode')}
      className={twMerge(
        'relative flex size-4.5 items-center gap-2',
        theme === 'dark' ? 'text-white' : 'text-gray-900',
        className
      )}
      onClick={handleClick}
      type="button"
    >
      {theme === 'dark' ?
        <FontAwesomeIcon icon={faMoon} size="sm" transform={{rotate: -20}} />
      : <FontAwesomeIcon icon={faSun} size="sm" />}
    </button>
  );
};

export default ThemeSwitcher;
