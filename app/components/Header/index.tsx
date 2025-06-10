import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router';
import AppVersion from 'app/components/AppVersion';
import {twMerge} from 'tailwind-merge';
import DarkModeToggle from '~/components/DarkModeToggle';
import LanguageSelect from '~/components/LanguageSelect';

type HeaderProps = {
  className?: string;
};

const Header: FC<HeaderProps> = ({className}) => {
  const {t} = useTranslation();

  return (
    <header className={twMerge('bg-secondary w-full px-4 py-2', className)}>
      <div className="flex w-full items-center justify-between">
        <div className="space-x-1.5">
          <Link className="text-lg font-bold" to="/">
            {t('meta.siteName', {ns: 'common'})}
          </Link>
          <AppVersion />
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelect />
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
