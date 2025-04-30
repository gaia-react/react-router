import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {twMerge} from 'tailwind-merge';
import ExampleConsumer from '~/components/ExampleConsumer';
import type {User} from '~/services/gaia/auth/types';

type UserCardProps = {
  className?: string;
  user: User;
};

const UserCard: FC<UserCardProps> = ({className, user}) => {
  const {t} = useTranslation('pages');

  const {email, familyName, givenName} = user;

  return (
    <div
      className={twMerge(
        'border-normal bg-secondary flex items-center justify-between rounded-md border p-4',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div>
          <div>{t('profile.fullName', {familyName, givenName})}</div>
          <div className="text-gray-500 dark:text-gray-400">{email}</div>
        </div>
      </div>
      <ExampleConsumer />
    </div>
  );
};

export default UserCard;
