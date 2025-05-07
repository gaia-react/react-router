import type {FC} from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import type {IconProp} from '@fortawesome/fontawesome-svg-core';
import {
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import type {ToastMessage} from 'remix-toast';
import {toast} from 'sonner';
import {twJoin} from 'tailwind-merge';
import ErrorStack from '~/components/ErrorStack';
import {parsePayload} from './utils';

type ToastType = 'error' | 'info' | 'success' | 'warning';

const COLOR: Record<ToastType, string> = {
  error: 'bg-red-700',
  info: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
};

const ICON: Record<ToastType, IconProp> = {
  error: faExclamationTriangle,
  info: faInfoCircle,
  success: faCheckCircle,
  warning: faExclamationTriangle,
};

const ICON_COLOR: Record<ToastType, string> = {
  error: 'text-red-300',
  info: 'text-blue-300',
  success: 'text-green-400',
  warning: 'text-yellow-300',
};

const DEFAULT_DURATION = 60_000;

type ToastNotificationProps = {
  id: number | string;
  payload: Partial<ToastMessage> | string;
  type: ToastType;
};

const ToastNotification: FC<ToastNotificationProps> = ({id, payload, type}) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(0);

  const {description, duration, message, stack} = parsePayload(payload);

  const toastDuration = duration ?? DEFAULT_DURATION;

  const handleClose = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    toast.dismiss(id);
  }, [id]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!isHovered) {
      timeoutRef.current = window.setTimeout(
        () => toast.dismiss(id),
        toastDuration
      );
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [id, isHovered, toastDuration]);

  return (
    <div
      className={twJoin(
        'relative w-[22rem] rounded p-3 text-sm text-white',
        COLOR[type]
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className="relative float-end ms-2 size-3 text-sm leading-none opacity-50 transition-transform hover:scale-125 hover:opacity-100"
        onClick={handleClose}
        type="button"
      >
        <FontAwesomeIcon className="size-4" icon={faXmark} />
      </button>
      {message && (
        <div className="flex items-start gap-1">
          <FontAwesomeIcon className={ICON_COLOR[type]} icon={ICON[type]} />
          <div
            className="-mt-0.5 leading-tight font-semibold text-pretty"
            dangerouslySetInnerHTML={{__html: message}}
          />
        </div>
      )}
      {description && (
        <div
          className={twJoin(message && 'mt-1.5')}
          dangerouslySetInnerHTML={{__html: description}}
        />
      )}
      {stack && (
        <details className={twJoin((message ?? description) && 'mt-1.5')}>
          <summary className="cursor-pointer">Details</summary>
          <ErrorStack
            className="max-h-60 overflow-y-auto text-xs"
            stack={stack}
          />
        </details>
      )}
    </div>
  );
};

export default ToastNotification;
