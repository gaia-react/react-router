import type {FC} from 'react';
import {useTranslation} from 'react-i18next';

const IndexPage: FC = () => {
  const {t} = useTranslation('pages', {keyPrefix: 'index'});

  return (
    <section className="flex h-full items-center justify-center p-4">
      <h1>{t('title')}</h1>
    </section>
  );
};

export default IndexPage;
