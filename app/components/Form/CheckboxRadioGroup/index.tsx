import type {FC, ReactNode} from 'react';
import {twMerge} from 'tailwind-merge';
import styles from './styles.module.css';

export type CheckboxRadioGroupProps = {
  children: ReactNode;
  className?: string;
  isButton?: boolean;
  isHorizontal?: boolean;
};

const CheckboxRadioGroup: FC<CheckboxRadioGroupProps> = ({
  children,
  className,
  isButton,
  isHorizontal,
}) => (
  <div
    className={twMerge(
      styles.group,
      'flex',
      isHorizontal ?
        isButton ? 'gap-2'
        : 'gap-6'
      : 'flex-col gap-2',
      className
    )}
    role="group"
  >
    {children}
  </div>
);

export default CheckboxRadioGroup;
