import type {FC} from 'react';
import {twJoin} from 'tailwind-merge';
import styles from './styles.module.css';

type CrossHatchProps = {
  className?: string;
};

const CrossHatch: FC<CrossHatchProps> = ({className}) => (
  <div
    className={twJoin(
      'bg-gradient-to-b from-[#373737] to-[#141414]',
      className
    )}
  >
    <div className={twJoin('size-full', styles.crossHatch)} />
  </div>
);

export default CrossHatch;
