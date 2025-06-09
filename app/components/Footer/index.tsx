import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {twMerge} from 'tailwind-merge';

interface FooterProps {
  className?: string;
}

const Footer: FC<FooterProps> = ({className}) => {
  const {t} = useTranslation('common');

  return (
    <footer className={twMerge('bg-secondary w-full px-4 py-2', className)}>
      <div className="flex w-full flex-col items-center justify-between sm:flex-row">
        <small>&copy;2024 GAIA Framework</small>
        <small>
          <a
            href="https://github.com/gaia-react/remix?tab=MIT-1-ov-file#readme"
            rel="noreferrer"
            target="_blank"
          >
            {t('license')}
          </a>
        </small>
      </div>
    </footer>
  );
};

export default Footer;
