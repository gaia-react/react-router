import type {PartialStoryFn} from 'storybook/internal/types';
import State from '~/state';
import type {Maybe} from '~/types';

type StateDecoratorProps = {
  example?: Maybe<number>;
};

const decorator = (props?: StateDecoratorProps) => (Story: PartialStoryFn) => (
  <State example={props?.example}>
    <Story />
  </State>
);

export default decorator;
