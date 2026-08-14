import * as React from 'react';
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import { Button } from '../../actions/Button/Button';
import '../../base.css';
import './AlertDialog.css';

/*
 * Alert dialog on Base UI — an interruption that requires an explicit choice,
 * so there is no corner close button and no outside-press dismissal.
 *
 * <AlertDialog.Root>
 *   <AlertDialog.Trigger render={<Button variant="danger">Delete</Button>} />
 *   <AlertDialog.Content title="Delete project?" description="This cannot be undone.">
 *     <AlertDialog.Footer>
 *       <AlertDialog.Close render={<Button variant="ghost" color="neutral" />}>Cancel</AlertDialog.Close>
 *       <Button variant="danger">Delete</Button>
 *     </AlertDialog.Footer>
 *   </AlertDialog.Content>
 * </AlertDialog.Root>
 * ```
 */

export interface AlertDialogContentProps
  extends WithClassName<Omit<React.ComponentProps<typeof BaseAlertDialog.Popup>, 'title'>> {
  /** Dialog title (renders an accessible AlertDialog.Title). */
  title?: React.ReactNode;
  /** Supporting description under the title. */
  description?: React.ReactNode;
  children?: React.ReactNode;
}

const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  function AlertDialogContent({ title, description, className, children, ...props }, ref) {
    return (
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className="zest-alert-dialog__backdrop" />
        <BaseAlertDialog.Popup
          ref={ref}
          className={cx('zest-alert-dialog__popup', className)}
          {...props}
        >
          {title || description ? (
            <header className="zest-alert-dialog__header">
              {title ? (
                <BaseAlertDialog.Title className="zest-alert-dialog__title">
                  {title}
                </BaseAlertDialog.Title>
              ) : null}
              {description ? (
                <BaseAlertDialog.Description className="zest-alert-dialog__description">
                  {description}
                </BaseAlertDialog.Description>
              ) : null}
            </header>
          ) : null}
          {children}
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    );
  }
);

function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <footer className={cx('zest-alert-dialog__footer', className)} {...props} />;
}

export const AlertDialog = {
  Root: BaseAlertDialog.Root,
  Trigger: BaseAlertDialog.Trigger,
  Close: BaseAlertDialog.Close,
  Content: AlertDialogContent,
  Footer: AlertDialogFooter,
};

export type AlertDialogRootProps = React.ComponentProps<typeof BaseAlertDialog.Root>;

export interface ConfirmDialogProps {
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the dialog, e.g. a Button. */
  trigger?: React.ReactElement<Record<string, unknown>>;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  /** Styles the confirm action with the error tone. */
  destructive?: boolean;
  onConfirm: () => void;
  /** Shows a spinner on the confirm action and blocks interaction. */
  loading?: boolean;
}

/**
 * Prewired confirmation dialog on top of AlertDialog.
 *
 * ```tsx
 * <ConfirmDialog
 *   trigger={<Button variant="danger">Delete</Button>}
 *   title="Delete project?"
 *   description="This action cannot be undone."
 *   destructive
 *   onConfirm={handleDelete}
 * />
 * ```
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  const isControlled = open !== undefined;
  const confirmButton = (
    <Button variant="solid" color={destructive ? 'error' : 'primary'} loading={loading} />
  );

  return (
    <BaseAlertDialog.Root
      open={open}
      onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
    >
      {trigger ? <BaseAlertDialog.Trigger render={trigger} /> : null}
      <AlertDialogContent title={title} description={description}>
        <AlertDialogFooter>
          <BaseAlertDialog.Close
            render={<Button variant="ghost" color="neutral" disabled={loading} />}
          >
            {cancelLabel}
          </BaseAlertDialog.Close>
          {isControlled ? (
            /* The consumer owns `open` — close explicitly when the work is done. */
            React.cloneElement(confirmButton, { onClick: () => onConfirm(), children: confirmLabel })
          ) : (
            <BaseAlertDialog.Close render={confirmButton} onClick={() => onConfirm()}>
              {confirmLabel}
            </BaseAlertDialog.Close>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </BaseAlertDialog.Root>
  );
}
