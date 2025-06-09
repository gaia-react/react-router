import type {FC, ReactNode} from 'react';

interface FieldErrorProps {
  error?: ReactNode;
}

const FieldError: FC<FieldErrorProps> = ({error}) => (
  <div
    className="text-sm whitespace-pre-wrap text-red-600 dark:text-red-500"
    role="alert"
  >
    {error}
  </div>
);

export default FieldError;
