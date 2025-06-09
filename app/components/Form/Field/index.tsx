import type {FC, ReactNode} from 'react';
import FieldLabel from './FieldLabel';
import FieldStatus from './FieldStatus';

type FieldProps = (WithLabel | WithMaxLength | WithoutLabel | WithValue) & {
  children: ReactNode;
  className?: string;
  classNameDescription?: string;
  classNameLabel?: string;
  description?: ReactNode;
  disabled?: boolean;
  error?: ReactNode;
  extra?: ReactNode;
  hideMaxLength?: boolean;
  id?: string;
  label?: ReactNode;
  length?: number;
  required?: boolean;
};

interface WithLabel {
  maxLength?: never;
  name: string;
  type: 'select';
}

interface WithMaxLength {
  maxLength?: number;
  name: string;
  type: 'input' | 'password' | 'textarea';
}

interface WithoutLabel {
  maxLength?: never;
  name?: never;
  type: 'button' | 'checkbox' | 'radio';
}

interface WithValue {
  maxLength?: never;
  name?: never;
  type: 'value';
}

const Field: FC<FieldProps> = ({
  children,
  className,
  classNameDescription,
  classNameLabel,
  description,
  disabled,
  error,
  extra,
  hideMaxLength,
  id,
  label,
  length,
  maxLength,
  name,
  required,
}) => {
  const status =
    description || error || maxLength ?
      <FieldStatus
        className={classNameDescription}
        description={description}
        disabled={disabled}
        error={error}
        hideMaxLength={hideMaxLength}
        id={id ?? name}
        length={length}
        maxLength={maxLength}
      />
    : null;

  const fieldLabel =
    label ?
      <FieldLabel
        className={classNameLabel}
        disabled={disabled}
        error={error}
        extra={extra}
        htmlFor={name}
        required={required}
      >
        {label}
      </FieldLabel>
    : null;

  return (
    <div className={className} role="presentation">
      {fieldLabel}
      {children}
      {status}
    </div>
  );
};

export default Field;
