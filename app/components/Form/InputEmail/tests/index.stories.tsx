import {useTranslation} from 'react-i18next';
import {useForm} from '@rvf/react-router';
import type {Meta, StoryFn} from '@storybook/react-vite';
import {z} from 'zod/v4';
import stubs from 'test/stubs';
import Button from '~/components/Button';
import FormActions from '~/components/Form/FormActions';
import InputEmail from '../index';

const meta: Meta = {
  component: InputEmail,
  decorators: [stubs.reactRouter()],
  parameters: {
    controls: {hideNoControlsWarning: true},
  },
  title: 'Form/Input/Email',
};

export default meta;

export const Default: StoryFn = () => {
  const {t} = useTranslation('errors');

  const form = useForm({
    defaultValues: {email: ''},
    schema: z.object({email: z.email()}),
  });

  return (
    <form className="max-w-md space-y-4 p-4" {...form.getFormProps()}>
      <InputEmail
        error={form.error('email') ? t('invalidEmail') : undefined}
        name="email"
      />
      <FormActions>
        <Button type="submit">{t('form.submit', {ns: 'common'})}</Button>
      </FormActions>
    </form>
  );
};
