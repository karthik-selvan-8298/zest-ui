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
 *
 * Auto-dismiss timers, pause-on-hover, swipe, and live-region announcements
 * are owned by the Base UI toast manager.
 */

export type ToastSeverity = 'info' | 'success' | 'warning' | 'error';

const severityIcons: Record<ToastSeverity, React.ReactNode> = {
  info: <InfoCircleIcon />,
  success: <CheckCircleIcon />,
  warning: <WarningTriangleIcon />,
  error: <ErrorCircleIcon />,
};

/** Narrows Base UI's free-form `toast.type` back to a Zest severity. */
function isSeverity(type: string | undefined): type is ToastSeverity {
  return type === 'info' || type === 'success' || type === 'warning' || type === 'error';
}

/** Context provider for the toast stack. Wrap your app (or a subtree) once. */
export const ZestToastProvider = BaseToast.Provider;
export type ZestToastProviderProps = React.ComponentProps<typeof BaseToast.Provider>;

export type ToasterPosition = 'bottom-right' | 'top-right' | 'bottom-center';

export interface ToasterProps extends WithClassName<
  React.ComponentProps<typeof BaseToast.Viewport>
> {
  /** Screen corner the stack anchors to. @default 'bottom-right' */
  position?: ToasterPosition;
}

/** Renders every toast in the manager's stack. */
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
        {...props}
        // After the spread so a stray `data-position` in props can't move the stack.
        data-position={position}
      >
        <ToastList />
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
});

export interface ToastOptions {
  /** Bold first line. */
  title?: React.ReactNode;
  /** Secondary text under the title. */
  description?: React.ReactNode;
  /** Tone and leading icon; omit for a plain toast. */
  severity?: ToastSeverity;
  /** Action button rendered under the description. */
  action?: {
    label: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  };
  /**
   * Auto-dismiss delay in ms; `0` keeps the toast until closed. Defaults to
   * the provider's `timeout` (5000).
   */
  timeout?: number;
}

/** A promise-stage message: a plain title string or full toast options. */
type ToastPromiseMessage = string | ToastOptions;

export interface ToastPromiseOptions<Value> {
  /** Shown while the promise is pending. */
  loading: ToastPromiseMessage;
  /** Shown on resolve; may derive the message from the result. */
  success: ToastPromiseMessage | ((result: Value) => ToastPromiseMessage);
  /** Shown on reject; may derive the message from the error. */
  error: ToastPromiseMessage | ((error: unknown) => ToastPromiseMessage);
}

/** Maps the Zest options shape onto Base UI's toast-manager options. */
function toManagerOptions({ severity, action, ...rest }: ToastOptions) {
  return {
    ...rest,
    type: severity,
    actionProps: action ? { children: action.label, onClick: action.onClick } : undefined,
  };
}

function normalize(message: ToastPromiseMessage, fallbackSeverity?: ToastSeverity) {
  const options = typeof message === 'string' ? { title: message } : message;
  // `??` (not spread order) so an explicit `severity: undefined` still falls back.
  return toManagerOptions({ ...options, severity: options.severity ?? fallbackSeverity });
}

/** Resolves a static or result-derived promise-stage message. */
function stage<Arg>(
  message: ToastPromiseMessage | ((arg: Arg) => ToastPromiseMessage),
  fallbackSeverity: ToastSeverity
) {
  return typeof message === 'function'
    ? (arg: Arg) => normalize(message(arg), fallbackSeverity)
    : normalize(message, fallbackSeverity);
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

/**
 * Imperative toast API. Must be called under `ZestToastProvider`.
 *
 * ```tsx
 * const toast = useToast();
 * toast.add({ title: 'Saved', severity: 'success' });
 * toast.promise(save(), { loading: 'Saving…', success: 'Saved', error: 'Save failed' });
 * ```
 */
export function useToast(): UseToastReturnValue {
  // Depend on the manager's methods, not the manager object: Base UI rebuilds
  // that object whenever the toast list changes, which would give `useToast()`
  // a new identity after every `add` (and loop effects that list it as a dep).
  const { add, close, promise } = BaseToast.useToastManager();
  return React.useMemo(
    () => ({
      add: (options: ToastOptions) => add(toManagerOptions(options)),
      promise: <Value,>(tracked: Promise<Value>, options: ToastPromiseOptions<Value>) =>
        promise(tracked, {
          loading: normalize(options.loading),
          success: stage(options.success, 'success'),
          error: stage(options.error, 'error'),
        }),
      close: (toastId?: string) => close(toastId),
    }),
    [add, close, promise]
  );
}
