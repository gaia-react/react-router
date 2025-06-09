import type {Meta, StoryFn} from '@storybook/react-vite';
import stubs from 'test/stubs';
import ExampleConsumer from '../index';

const meta: Meta = {
  component: ExampleConsumer,
  decorators: [stubs.state(), stubs.reactRouter()],
  parameters: {
    controls: {hideNoControlsWarning: true},
    wrap: 'p-4',
  },
  title: 'Components/ExampleConsumer',
};

export default meta;

export const Default: StoryFn = () => <ExampleConsumer />;
