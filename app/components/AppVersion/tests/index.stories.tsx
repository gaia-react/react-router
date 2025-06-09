import type {Meta, StoryFn} from '@storybook/react-vite';
import AppVersion from '../index';

const meta: Meta = {
  component: AppVersion,
  parameters: {
    chromatic: {disableSnapshot: true},
    controls: {hideNoControlsWarning: true},
    wrap: 'p-4',
  },
  title: 'Components/AppVersion',
};

export default meta;

export const Default: StoryFn = () => <AppVersion />;
