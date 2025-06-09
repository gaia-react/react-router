import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Form} from 'react-router';
import {twMerge} from 'tailwind-merge';
import Button from '~/components/Button';
import UserCard from '~/pages/Session/Profile/ProfilePage/UserCard';
import {useUser} from '~/state/user';

interface ProfilePageProps {
  className?: string;
}

const ProfilePage: FC<ProfilePageProps> = ({className}) => {
  const {t} = useTranslation('pages');

  const user = useUser();

  return (
    <section className={twMerge('container py-8', className)}>
      <div className="mx-auto flex max-w-screen-sm flex-col gap-4">
        <h1 className="text-3xl font-bold">{t('profile.meta.title')}</h1>
        <UserCard user={user} />
        <Form action="/action/logout" method="POST">
          <Button className="w-full" type="submit" variant="tertiary">
            {t('logout', {ns: 'auth'})}
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default ProfilePage;
