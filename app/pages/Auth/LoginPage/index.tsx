import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from 'react-router';
import {getFormProps, getInputProps, useForm} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod/v4';
import {z} from 'zod';
import Button from '~/components/Button';
import FormActions from '~/components/Form/FormActions';
import FormError from '~/components/Form/FormError';
import InputEmail from '~/components/Form/InputEmail';
import InputPassword from '~/components/Form/InputPassword';

const schema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

const LoginPage: FC = () => {
  const {t} = useTranslation('auth');

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [form, fields] = useForm({
    // eslint-disable-next-line sonarjs/no-hardcoded-passwords
    defaultValue: {email: 'user@domain.com', password: 'passw0rd'},
    onValidate: ({formData}) => parseWithZod(formData, {schema}),
  });

  return (
    <section className="mx-auto w-full max-w-screen-sm space-y-4 px-4 py-12">
      <h1 className="text-2xl font-bold">{t('login')}</h1>
      <form
        className="hide-required space-y-6"
        method="POST"
        {...getFormProps(form)}
      >
        <InputEmail
          error={
            fields.email.errors?.length ?
              t('invalidEmail', {ns: 'errors'})
            : undefined
          }
          required={true}
          {...getInputProps(fields.email, {type: 'email'})}
        />
        <InputPassword
          error={
            fields.password.errors?.length ?
              t('invalidPassword', {ns: 'errors'})
            : undefined
          }
          required={true}
          {...getInputProps(fields.password, {type: 'password'})}
        />
        <FormError hide={isSubmitting} />
        <FormActions>
          <Button isLoading={isSubmitting} type="submit">
            {t('login')}
          </Button>
        </FormActions>
      </form>
    </section>
  );
};

export default LoginPage;
