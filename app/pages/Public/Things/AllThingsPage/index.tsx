import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {twJoin} from 'tailwind-merge';
import LinkButton from '~/components/LinkButton';
import ThingsGrid from './ThingsGrid';

type AllThingsPageProps = {
  className?: string;
};

const AllThingsPage: FC<AllThingsPageProps> = ({className}) => {
  const {t} = useTranslation('pages', {keyPrefix: 'things'});

  return (
    <section className={twJoin('container space-y-8 py-12', className)}>
      <ThingsGrid />
      <div className="mx-auto flex max-w-screen-lg justify-end px-4">
        <LinkButton size="sm" to="/things/create" variant="tertiary">
          {t('create')}
        </LinkButton>
      </div>
    </section>
  );
};

export default AllThingsPage;
