import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useThings} from '~/services/gaia/things/state';
import ThingCard from './ThingCard';

const ThingsGrid: FC = () => {
  const {t} = useTranslation('pages', {keyPrefix: 'things'});

  const things = useThings();

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 md:grid-cols-2">
      {things.length === 0 ?
        <div className="text-lg md:col-span-2">{t('none')}</div>
      : things.map((thing) => <ThingCard key={thing.id} thing={thing} />)}
    </div>
  );
};

export default ThingsGrid;
