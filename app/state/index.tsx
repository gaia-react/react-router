/* eslint-disable canonical/filename-match-exported */
import type {FC, ReactNode} from 'react';
import type {User} from '~/services/gaia/auth/types';
import type {Theme} from '~/state/theme';
import {ThemeProvider} from '~/state/theme';
import {UserProvider} from '~/state/user';
import type {Maybe} from '~/types';

type StateProps = {
  theme?: Theme;
  user?: Maybe<User>;
};

const State: FC<StateProps & {children: ReactNode}> = ({
  children,
  theme,
  user,
}) => (
  <ThemeProvider initialState={theme}>
    <UserProvider initialState={user}>{children}</UserProvider>
  </ThemeProvider>
);

export default State;
