import {useTranslation} from 'react-i18next';
import {useForm} from '@rvf/react-router';
import type {Meta, StoryFn} from '@storybook/react-vite';
import {z} from 'zod';
import stubs from 'test/stubs';
import Button from '~/components/Button';
import FormActions from '~/components/Form/FormActions';
import InputPassword from '../index';

const meta: Meta = {
  component: InputPassword,
  decorators: [stubs.reactRouter()],
  parameters: {
    controls: {hideNoControlsWarning: true},
  },
  title: 'Form/Input/Password',
};

export default meta;

export const Default: StoryFn = () => {
  const {t} = useTranslation('errors');

  const form = useForm({
    defaultValues: {password: ''},
    schema: z.object({password: z.string().min(6)}),
  });

  return (
    <form className="max-w-md space-y-4 p-4" {...form.getFormProps()}>
      <InputPassword
        error={form.error('password') ? t('invalidPassword') : undefined}
        name="password"
      />
      <FormActions>
        <Button type="submit">{t('form.submit', {ns: 'common'})}</Button>
      </FormActions>
    </form>
  );
};
