import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {faComputerMouse} from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import {useExample} from '~/state/example';

interface ExampleConsumerProps {
  className?: string;
}

const ExampleConsumer: FC<ExampleConsumerProps> = ({className}) => {
  const {t} = useTranslation('common');

  const [example, setExample] = useExample();

  return (
    <Button
      className={className}
      icon={faComputerMouse}
      onClick={() => setExample((p) => (p ?? 0) + 1)}
      size="sm"
      variant="tertiary"
    >
      {t('counters.clicks', {count: example ?? 0})}
    </Button>
  );
};

export default ExampleConsumer;
