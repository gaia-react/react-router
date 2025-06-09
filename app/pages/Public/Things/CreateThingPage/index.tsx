import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Form, useNavigation} from 'react-router';
import {twJoin} from 'tailwind-merge';
import Button from '~/components/Button';
import FormActions from '~/components/Form/FormActions';
import FormError from '~/components/Form/FormError';
import InputText from '~/components/Form/InputText';
import LinkButton from '~/components/LinkButton';

interface CreateThingPageProps {
  className?: string;
}

const CreateThingPage: FC<CreateThingPageProps> = ({className}) => {
  const {t} = useTranslation('common');

  const {state} = useNavigation();
  const isSubmitting = state === 'submitting';

  return (
    <section
      className={twJoin('mx-auto w-full max-w-screen-sm px-4 py-12', className)}
    >
      <Form className="space-y-8" method="post">
        <InputText
          defaultValue=""
          label={t('name')}
          name="name"
          placeholder={t('name')}
          required={true}
        />
        <InputText
          defaultValue=""
          label={t('description')}
          name="description"
          placeholder={t('description')}
          required={true}
        />
        <FormError />
        <FormActions>
          <LinkButton to="/things" variant="tertiary">
            {t('form.cancel')}
          </LinkButton>
          <Button isLoading={isSubmitting} type="submit">
            {t('things.create', {ns: 'pages'})}
          </Button>
        </FormActions>
      </Form>
    </section>
  );
};

export default CreateThingPage;
