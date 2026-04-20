/* eslint-disable canonical/filename-match-exported */
import type {FC, ReactNode} from 'react';
import type {Theme} from '~/state/theme';
import {ThemeProvider} from '~/state/theme';

type StateProps = {
  theme?: Theme;
};

const State: FC<StateProps & {children: ReactNode}> = ({children, theme}) => (
  <ThemeProvider initialState={theme}>{children}</ThemeProvider>
);

export default State;
