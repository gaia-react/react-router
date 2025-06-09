import {useForm} from '@rvf/react-router';
import type {Meta, StoryFn} from '@storybook/react-vite';
import {z} from 'zod/v4';
import stubs from 'test/stubs';
import YearMonthDay from '../index';

const meta: Meta = {
  component: YearMonthDay,
  decorators: [stubs.reactRouter()],
  parameters: {
    controls: {hideNoControlsWarning: true},
  },
  title: 'Form/YearMonthDay',
};

export default meta;

export const Default: StoryFn = () => {
  const form = useForm({
    defaultValues: {dob: '2000-01-01'},
    schema: z.object({dob: z.iso.date()}),
  });

  return (
    <form className="max-w-md p-4" {...form.getFormProps()}>
      <YearMonthDay {...form.getControlProps('dob')} />
    </form>
  );
};
