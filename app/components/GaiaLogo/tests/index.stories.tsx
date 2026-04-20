import type {Meta, StoryFn} from '@storybook/react-vite';
import GaiaLogo from '..';

const meta: Meta = {
  component: GaiaLogo,
  parameters: {controls: {hideNoControlsWarning: true}, wrap: 'p-4'},
  title: 'Components/GaiaLogo',
};

export default meta;

export const Default: StoryFn = () => <GaiaLogo className="h-12" />;

export const Small: StoryFn = () => <GaiaLogo className="h-6" />;

export const Large: StoryFn = () => <GaiaLogo className="h-24" />;
