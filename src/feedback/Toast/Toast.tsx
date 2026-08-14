import * as React from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import {
  CheckCircleIcon,
  CloseIcon,
  ErrorCircleIcon,
  InfoCircleIcon,
  WarningTriangleIcon,
} from '../../icons';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import { IconButton } from '../../actions/IconButton/IconButton';
import '../../base.css';
import './Toast.css';

/*
 * Toasts on Base UI Toast.
 *
 * 1. Wrap the app once:      <ZestToastProvider>…<Toaster /></ZestToastProvider>
 * 2. Fire from anywhere:     const toast = useToast();
 *                            toast.add({ title: 'Saved', severity: 'success' });
 */

export type ToastSeverity = 'info' | 'success' | 'warning' | 'error';

const severityIcons: Record<ToastSeverity, React.ReactNode> = {
  info: <InfoCircleIcon />,
  success: <CheckCircleIcon />,
  warning: <WarningTriangleIcon />,
  error: <ErrorCircleIcon />,
};

function isSeverity(type: string | undefined): type is ToastSeverity {
  return type === 'info' || type === 'success' || type === 'warning' || type === 'error';
}

/** Context provider for the toast stack. Wrap your app (or a subtree) once. */
export const ZestToastProvider = BaseToast.Provider;
export type ZestToastProviderProps = React.ComponentProps<typeof BaseToast.Provider>;

export type ToasterPosition = 'bottom-right' | 'top-right' | 'bottom-center';

export interface ToasterProps
  extends WithClassName<React.ComponentProps<typeof BaseToast.Viewport>> {
  /** Screen corner the stack anchors to. @default 'bottom-right' */
  position?: ToasterPosition;
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return (
    <>
      {toasts.map((toast) => {
        const severity = isSeverity(toast.type) ? toast.type : undefined;
        return (
          <BaseToast.Root
            key={toast.id}
            toast={toast}
            className="zest-toast"
            data-accent={severity}
          >
            {severity ? (
              <span className="zest-toast__icon" aria-hidden>
                {severityIcons[severity]}
              </span>
            ) : null}
            <div className="zest-toast__content">
              <BaseToast.Title className="zest-toast__title" />
              <BaseToast.Description className="zest-toast__description" />
              <BaseToast.Action className={cx('zest-toast__action', 'zest-focusable')} />
            </div>
            <BaseToast.Close
              className="zest-toast__close"
              render={<IconButton aria-label="Close notification" size="sm" color="neutral" />}
            >
              <CloseIcon />
            </BaseToast.Close>
          </BaseToast.Root>
        );
      })}
    </>
  );
}

/**
 * Renders the portal + viewport for the toast stack.
 * Place once inside `ZestToastProvider`.
 */
export const Toaster = React.forwardRef<HTMLDivElement, ToasterProps>(function Toaster(
  { position = 'bottom-right', className, ...props },
  ref
) {
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport
        ref={ref}
        className={cx('zest-toaster', className)}
        data-position={position}
        {...props}
      >
        <ToastList />
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
});

export interface ToastOptions {
  /** Bold first line. */
  title?: React.ReactNode;
  description?: React.ReactNode;
  severity?: ToastSeverity;
  /** Action button rendered under the description. */
  action?: {
    label: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  };
  /** Auto-dismiss delay in ms; `0` keeps the toast until closed. */
  timeout?: number;
}

type ToastPromiseMessage = string | ToastOptions;

export interface ToastPromiseOptions<Value> {
  loading: ToastPromiseMessage;
  success: ToastPromiseMessage | ((result: Value) => ToastPromiseMessage);
  error: ToastPromiseMessage | ((error: unknown) => ToastPromiseMessage);
}

function toManagerOptions({ severity, action, ...rest }: ToastOptions) {
  return {
    ...rest,
    type: severity,
    actionProps: action ? { children: action.label, onClick: action.onClick } : undefined,
  };
}

function normalize(message: ToastPromiseMessage, fallbackSeverity?: ToastSeverity) {
  const options = typeof message === 'string' ? { title: message } : message;
  return toManagerOptions({ severity: fallbackSeverity, ...options });
}

export interface UseToastReturnValue {
  /** Shows a toast; returns its id. */
  add: (options: ToastOptions) => string;
  /**
   * Tracks a promise with loading → success/error toasts.
   * Success and error default to matching severities unless overridden.
   */
  promise: <Value>(promise: Promise<Value>, options: ToastPromiseOptions<Value>) => Promise<Value>;
  /** Closes one toast by id, or all toasts when called without arguments. */
  close: (toastId?: string) => void;
}

/** Imperative toast API. Must be called under `ZestToastProvider`. */
export function useToast(): UseToastReturnValue {
  const manager = BaseToast.useToastManager();
  return React.useMemo(
    () => ({
      add: (options: ToastOptions) => manager.add(toManagerOptions(options)),
      promise: <Value,>(promise: Promise<Value>, options: ToastPromiseOptions<Value>) =>
        manager.promise(promise, {
          loading: normalize(options.loading),
          success:
            typeof options.success === 'function'
              ? (result: Value) =>
                  normalize(
                    (options.success as (r: Value) => ToastPromiseMessage)(result),
                    'success'
                  )
              : normalize(options.success, 'success'),
          error:
            typeof options.error === 'function'
              ? (error: unknown) =>
                  normalize((options.error as (e: unknown) => ToastPromiseMessage)(error), 'error')
              : normalize(options.error, 'error'),
        }),
      close: (toastId?: string) => manager.close(toastId),
    }),
    [manager]
  );
}
