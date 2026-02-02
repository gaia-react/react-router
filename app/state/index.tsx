/* eslint-disable canonical/filename-match-exported */
import type {FC, ReactNode} from 'react';
import type {User} from '~/services/gaia/auth/types';
import {ExampleProvider} from '~/state/example';
import {UserProvider} from '~/state/user';
import type {Maybe} from '~/types';

type StateProps = {
  example?: Maybe<number>;
  user?: Maybe<User>;
};

const State: FC<StateProps & {children: ReactNode}> = ({
  children,
  example,
  user,
}) => (
  <UserProvider initialState={user}>
    <ExampleProvider initialState={example}>{children}</ExampleProvider>
  </UserProvider>
);

export default State;
