/* eslint-disable canonical/filename-match-exported */
import type {FC, ReactNode} from 'react';
import type {User} from '~/services/gaia/auth/types';
import {ExampleProvider} from '~/state/example';
import type {Theme} from '~/state/theme';
import {ThemeProvider} from '~/state/theme';
import {UserProvider} from '~/state/user';
import type {Maybe} from '~/types';

type StateProps = {
  example?: Maybe<number>;
  theme?: Theme;
  user?: Maybe<User>;
};

const State: FC<StateProps & {children: ReactNode}> = ({
  children,
  example,
  theme,
  user,
}) => (
  <ThemeProvider initialState={theme}>
    <UserProvider initialState={user}>
      <ExampleProvider initialState={example}>{children}</ExampleProvider>
    </UserProvider>
  </ThemeProvider>
);

export default State;
