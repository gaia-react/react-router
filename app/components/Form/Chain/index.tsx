import type {FC, ReactNode} from 'react';
import {twJoin} from 'tailwind-merge';
import styles from './styles.module.css';

export interface ChainProps {
  children: ReactNode;
  className?: string;
  isFullWidth?: boolean;
}

const Chain: FC<ChainProps> = ({children, className, isFullWidth}) => (
  <div
    className={twJoin(styles.chain, isFullWidth && styles.fullWidth, className)}
    role="group"
  >
    {children}
  </div>
);

export default Chain;
