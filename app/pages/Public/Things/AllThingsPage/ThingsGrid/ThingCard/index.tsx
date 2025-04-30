import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Form, useNavigation} from 'react-router';
import {faPencil, faTrash} from '@fortawesome/free-solid-svg-icons';
import {format} from 'date-fns';
import {ja} from 'date-fns/locale';
import {twMerge} from 'tailwind-merge';
import Button from '~/components/Button';
import LinkButton from '~/components/LinkButton';
import useBreakpoint from '~/hooks/useBreakpoint';
import type {Thing} from '~/services/gaia/things/types';

type ThingCardProps = {
  className?: string;
  thing: Thing;
};

const formatDate = (date: string, language: string) =>
  format(new Date(date), 'P p', {locale: language === 'ja' ? ja : undefined});

const ThingCard: FC<ThingCardProps> = ({className, thing}) => {
  const {
    i18n: {language},
    t,
  } = useTranslation('pages', {keyPrefix: 'things'});

  const {formData, state} = useNavigation();
  const isSubmitting =
    state === 'submitting' && formData?.get('id') === thing.id;

  const showButtonLabels = useBreakpoint('md');

  return (
    <div
      className={twMerge(
        'bg-secondary flex justify-between gap-8 rounded-md border border-gray-500 p-4',
        className
      )}
    >
      <div>
        <div
          className="line-clamp-2 text-xl text-pretty text-blue-600 dark:text-blue-400"
          title={thing.name}
        >
          {thing.name}
        </div>
        <div className="line-clamp-3 text-pretty" title={thing.description}>
          {thing.description}
        </div>
        <div className="mt-2 text-xs text-pretty text-gray-500 dark:text-gray-400">
          {t('lastUpdated')}:{' '}
          {formatDate(thing.updatedAt ?? thing.createdAt, language)}
        </div>
      </div>
      <Form className="flex flex-col gap-4 pt-1" method="DELETE">
        <LinkButton icon={faPencil} size="xs" to={`/things/${thing.id}`}>
          {showButtonLabels ? t('edit') : null}
        </LinkButton>
        <Button
          icon={faTrash}
          isLoading={isSubmitting}
          name="id"
          size="xs"
          type="submit"
          value={thing.id}
          variant="destructive"
        >
          {showButtonLabels ? t('delete') : null}
        </Button>
      </Form>
    </div>
  );
};

export default ThingCard;
