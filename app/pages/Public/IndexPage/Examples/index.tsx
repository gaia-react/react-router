import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {faCircleUser, faCloudArrowUp} from '@fortawesome/free-solid-svg-icons';
import ExampleConsumer from '~/components/ExampleConsumer';
import LinkButton from '~/components/LinkButton';

const Examples: FC = () => {
  const {t} = useTranslation('pages', {keyPrefix: 'index'});

  return (
    <div className="mt-2">
      <div className="flex items-center justify-center gap-8">
        <LinkButton
          className="inline-block"
          icon={faCircleUser}
          size="sm"
          to="/login"
          variant="tertiary"
        >
          {t('authExample')}
        </LinkButton>{' '}
        <LinkButton
          className="inline-block"
          icon={faCloudArrowUp}
          size="sm"
          to="/things"
          variant="tertiary"
        >
          {t('serviceExample')}
        </LinkButton>
      </div>
      <ExampleConsumer className="mt-4 w-full" />
    </div>
  );
};

export default Examples;
