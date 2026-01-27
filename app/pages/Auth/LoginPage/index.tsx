import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useSubmit} from 'react-router';
import {useForm} from '@rvf/react-router';
import {z} from 'zod';
import Button from '~/components/Button';
import FormActions from '~/components/Form/FormActions';
import FormError from '~/components/Form/FormError';
import InputEmail from '~/components/Form/InputEmail';
import InputPassword from '~/components/Form/InputPassword';

const LoginPage: FC = () => {
  const {t} = useTranslation('auth');

  const submit = useSubmit();

  const form = useForm({
    // eslint-disable-next-line sonarjs/no-hardcoded-passwords
    defaultValues: {email: 'user@domain.com', password: 'passw0rd'},
    handleSubmit: async (formData) => submit(formData, {method: 'post'}),
    schema: z.object({
      email: z.email(),
      password: z.string().min(6),
    }),
    submitSource: 'dom',
  });

  return (
    <section className="mx-auto w-full max-w-screen-sm space-y-4 px-4 py-12">
      <h1 className="text-2xl font-bold">{t('login')}</h1>
      <form className="hide-required space-y-6" {...form.getFormProps()}>
        <InputEmail
          error={
            form.error('email') ? t('invalidEmail', {ns: 'errors'}) : undefined
          }
          required={true}
          {...form.getInputProps('email')}
        />
        <InputPassword
          error={
            form.error('password') ?
              t('invalidPassword', {ns: 'errors'})
            : undefined
          }
          required={true}
          {...form.getInputProps('password')}
        />
        <FormError hide={form.formState.isSubmitting} />
        <FormActions>
          <Button isLoading={form.formState.isSubmitting} type="submit">
            {t('login')}
          </Button>
        </FormActions>
      </form>
    </section>
  );
};

export default LoginPage;
