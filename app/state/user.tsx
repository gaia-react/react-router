import type {FC, ReactNode} from 'react';
import {createContext, useContext} from 'react';
import type {User} from '~/services/gaia/auth/types';
import type {Maybe} from '~/types';

// Based on Kent C Dodds' blog post:
// https://kentcdodds.com/blog/how-to-use-react-context-effectively

const UserContext = createContext<Maybe<User>>(null);

export const useUser = (): User => useContext(UserContext) as User;

export const useMaybeUser = (): Maybe<User> => useContext(UserContext);

type UserProviderProps = {
  children: ReactNode;
  initialState?: Maybe<User>;
};

export const UserProvider: FC<UserProviderProps> = ({
  children,
  initialState,
}) => (
  <UserContext.Provider value={initialState}>{children}</UserContext.Provider>
);

UserProvider.displayName = 'UserProvider';
