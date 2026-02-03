import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import Examples from './Examples';
import TechStack from './TechStack';
import GaiaLogo from './TechStack/Logos/GaiaLogo';

const IndexPage: FC = () => {
  const {t} = useTranslation('pages', {keyPrefix: 'index'});

  return (
    <section className="relative flex h-full items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex flex-col items-center">
          <GaiaLogo height={125} />
          <h1 className="inline-block text-center text-xl font-bold tracking-wider text-pretty text-[#797979] uppercase">
            {t('title')}
          </h1>
        </div>
        <TechStack />
        <Examples />
      </div>
    </section>
  );
};

export default IndexPage;
