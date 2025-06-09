import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {faMoon, faSun} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {twMerge} from 'tailwind-merge';
import {useTheme} from '~/state/theme';

interface DarkModeToggleProps {
  className?: string;
  onChange?: () => void;
}

const DarkModeToggle: FC<DarkModeToggleProps> = ({className, onChange}) => {
  const {t} = useTranslation('common', {keyPrefix: 'theme'});

  const [theme, setTheme] = useTheme();

  const handleClick = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    onChange?.();
  };

  return (
    <button
      aria-label={theme === 'dark' ? t('enableLightMode') : t('enableDarkMode')}
      className={twMerge(
        'relative flex items-center gap-2',
        theme === 'dark' ? 'text-white' : 'text-gray-900',
        className
      )}
      onClick={handleClick}
      type="button"
    >
      {theme === 'dark' ?
        <FontAwesomeIcon
          fixedWidth={true}
          icon={faMoon}
          size="sm"
          transform={{rotate: -20}}
        />
      : <FontAwesomeIcon fixedWidth={true} icon={faSun} size="sm" />}
    </button>
  );
};

export default DarkModeToggle;
