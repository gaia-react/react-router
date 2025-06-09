import type {Dispatch, FC, ReactNode, SetStateAction} from 'react';
import {createContext, useContext, useState} from 'react';
import type {Maybe} from '~/types';
import {noop} from '~/utils/function';

// Editable Context Example

// Based on Kent C Dodds' blog post:
// https://kentcdodds.com/blog/how-to-use-react-context-effectively

type ExampleContextValue = [
  Maybe<number>,
  Dispatch<SetStateAction<Maybe<number>>>,
];

const ExampleContext = createContext<ExampleContextValue>([undefined, noop]);

export const useExample = () => {
  const context = useContext(ExampleContext) as Maybe<ExampleContextValue>;

  if (!context) {
    throw new Error('useExample must be used within an ExampleProvider');
  }

  return context;
};

interface ExampleProviderProps {
  children: ReactNode;
  initialState?: Maybe<number>;
}

export const ExampleProvider: FC<ExampleProviderProps> = ({
  children,
  initialState,
}) => {
  const value = useState<Maybe<number>>(initialState);

  return (
    <ExampleContext.Provider value={value}>{children}</ExampleContext.Provider>
  );
};

ExampleProvider.displayName = 'ExampleProvider';
