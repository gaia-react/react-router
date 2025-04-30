import type {FC} from 'react';
import type {ToastMessage} from 'remix-toast';
import {toast as notify, Toaster} from 'sonner';
import {md5} from '~/utils/object';
import ToastNotification from './ToastNotification';

// Reference
// https://sonner.emilkowal.ski/toaster

const Toast: FC = () => (
  <Toaster
    className="w-88"
    duration={Number.POSITIVE_INFINITY}
    expand={true}
    offset={16}
    position="top-right"
    toastOptions={{unstyled: true}}
    visibleToasts={9}
  />
);

export default Toast;

export const toast = {
  error: (payload: Partial<ToastMessage> | string) =>
    notify.custom(
      (id) => <ToastNotification id={id} payload={payload} type="error" />,
      {id: md5({payload})}
    ),
  info: (payload: Partial<ToastMessage> | string) =>
    notify.custom(
      (id) => <ToastNotification id={id} payload={payload} type="info" />,
      {id: md5({payload})}
    ),
  success: (payload: Partial<ToastMessage> | string) =>
    notify.custom(
      (id) => <ToastNotification id={id} payload={payload} type="success" />,
      {id: md5({payload})}
    ),
  warning: (payload: Partial<ToastMessage> | string) =>
    notify.custom(
      (id) => <ToastNotification id={id} payload={payload} type="warning" />,
      {id: md5({payload})}
    ),
};
