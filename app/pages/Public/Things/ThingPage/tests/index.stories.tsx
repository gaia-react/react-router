import type {Meta, StoryFn} from '@storybook/react-vite';
import database from 'test/mocks/database';
import stubs from 'test/stubs';
import type {Things} from '~/services/gaia/things/types';
import {toCamelCase} from '~/utils/object';
import ThingPage from '../index';

const meta: Meta = {
  component: ThingPage,
  decorators: [
    stubs.reactRouter({
      action: 'components-thingsgrid--default',
      routes: [{path: '/things', storyId: 'components-thingsgrid--default'}],
    }),
  ],
  parameters: {
    controls: {hideNoControlsWarning: true},
  },
  title: 'Components/ThingEdit',
};

export default meta;

export const Default: StoryFn = () => {
  const things = database.things.getAll().map(toCamelCase) as Things;

  return (
    <div className="p-4">
      <ThingPage thing={things[0]} />
    </div>
  );
};
