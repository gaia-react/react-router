/* eslint-disable react/button-has-type */
import type {ComponentProps, FC, ReactNode} from 'react';
import type {IconProp} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {twJoin, twMerge} from 'tailwind-merge';
import Spinner from '~/components/Loaders/Spinner';
import type {Size} from '~/types';

export const SIZES: Record<Size, string> = {
  base: 'px-3 py-2 text-base',
  lg: 'px-4 py-2 text-lg',
  sm: 'px-3 py-1.5 text-sm',
  xl: 'px-4 py-2.5 text-xl',
  xs: 'px-1.5 py-1 text-xs',
};

export const ICON_SIZES: Record<Size, string> = {
  base: 'px-2.5',
  lg: 'px-2.5',
  sm: 'px-2',
  xl: 'px-2.5',
  xs: 'px-1.5',
};

export const ICON_POSITION: Record<'left' | 'right', string> = {
  left: '',
  right: 'flex-row-reverse',
};

export type Variant =
  | 'borderless'
  | 'custom'
  | 'destructive'
  | 'primary'
  | 'secondary'
  | 'tertiary';

export const VARIANTS: Record<Variant, string> = {
  borderless:
    'bg-transparent hover:bg-gray-400/10 disabled:hover:bg-transparent dark:hover:bg-gray-500/10 dark:disabled:hover:bg-transparent',
  custom: '',
  destructive:
    'border border-red-400 bg-red-500 text-white hover:bg-red-600 disabled:hover:bg-red-500 dark:border-red-500 dark:bg-red-600 dark:hover:bg-red-700 dark:disabled:hover:bg-red-600',
  primary:
    'border border-blue-400 bg-blue-500 text-white hover:bg-blue-600 disabled:hover:bg-blue-500 dark:border-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:hover:bg-blue-600',
  secondary:
    'border border-blue-500 bg-white text-blue-500 hover:bg-blue-50 disabled:hover:bg-white dark:border-blue-500 dark:bg-gray-900 dark:text-blue-100 dark:hover:bg-blue-900/15 dark:disabled:hover:bg-gray-900',
  tertiary:
    'border border-gray-500 bg-gray-600 text-white hover:bg-gray-700 disabled:hover:bg-gray-600',
};

export type ButtonProps = ComponentProps<'button'> &
  IconUnion & {
    isLoading?: boolean;
    size?: Size;
    variant?: Variant;
  };

export type IconUnion = MaybeIcon | OnlyIcon;

type MaybeIcon = {
  children: ReactNode;
  classNameIcon?: string;
  icon?: IconProp;
  iconPosition?: 'left' | 'right';
};

type OnlyIcon = {
  children?: never;
  classNameIcon?: string;
  icon: IconProp;
  iconPosition?: never;
};

const Button: FC<ButtonProps> = ({
  children,
  className,
  classNameIcon,
  disabled,
  icon,
  iconPosition = 'left',
  isLoading,
  ref,
  size = 'base',
  type = 'button',
  variant = 'primary',
  ...props
}) => {
  const iconComponent =
    icon ?
      <FontAwesomeIcon
        className={twJoin(children && 'flex-none', classNameIcon)}
        fixedWidth={true}
        icon={icon}
        size="1x"
      />
    : null;

  const innerClassName = twJoin(
    icon &&
      children &&
      `flex items-center justify-center gap-1.5 ${ICON_POSITION[iconPosition]}`
  );

  return (
    <button
      ref={ref}
      className={twMerge(
        'text-center whitespace-nowrap select-none',
        VARIANTS[variant],
        SIZES[size],
        icon && ICON_SIZES[size],
        variant !== 'custom' && 'rounded-sm transition-colors duration-200',
        isLoading ? 'cursor-wait' : (
          'disabled:cursor-not-allowed disabled:opacity-50'
        ),
        className
      )}
      disabled={disabled ?? isLoading}
      type={type}
      {...props}
    >
      {isLoading ?
        <span className="relative block">
          <span className={twJoin('invisible', innerClassName)}>
            {iconComponent}
            {children}
          </span>
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner size={size} />
          </span>
        </span>
      : <span className={innerClassName}>
          {iconComponent}
          {children}
        </span>
      }
    </button>
  );
};

export default Button;
