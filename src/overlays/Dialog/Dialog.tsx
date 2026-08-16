import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { CloseIcon } from '../../icons';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import { IconButton } from '../../actions/IconButton/IconButton';
import '../../base.css';
import './Dialog.css';

/*
 * Composable dialog on Base UI — focus trapping, dismissal, and aria wiring
 * come from the primitive.
 *
 * <Dialog.Root>
 *   <Dialog.Trigger render={<Button>Open</Button>} />
 *   <Dialog.Content title="Settings" description="Manage your preferences">
 *     …body…
 *     <Dialog.Footer><Button>Save</Button></Dialog.Footer>
 *   </Dialog.Content>
 * </Dialog.Root>
 */

export interface DialogContentProps
  extends WithClassName<Omit<React.ComponentProps<typeof BaseDialog.Popup>, 'title'>> {
  /** Dialog title (renders an accessible Dialog.Title). */
  title?: React.ReactNode;
  /** Supporting description under the title. */
  description?: React.ReactNode;
  /** Max width of the dialog. */
  size?: 'sm' | 'md' | 'lg';
  /** Hide the corner close button. */
  hideClose?: boolean;
  children?: React.ReactNode;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(
    { title, description, size = 'md', hideClose = false, className, children, ...props },
    ref
  ) {
    // A Dialog.Footer child is lifted out of the scrollable body so it stays
    // pinned below it, mirroring the fixed header above.
    const childArray = React.Children.toArray(children);
    const footerChildren = childArray.filter(
      (child) => React.isValidElement(child) && child.type === DialogFooter
    );
    const bodyChildren = childArray.filter(
      (child) => !(React.isValidElement(child) && child.type === DialogFooter)
    );
    return (
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="zest-dialog__backdrop" />
        <BaseDialog.Popup
          ref={ref}
          className={cx('zest-dialog__popup', className)}
          data-size={size}
          {...props}
        >
          {title || !hideClose ? (
            <header className="zest-dialog__header">
              <div className="zest-dialog__heading">
                {title ? (
                  <BaseDialog.Title className="zest-dialog__title">{title}</BaseDialog.Title>
                ) : null}
                {description ? (
                  <BaseDialog.Description className="zest-dialog__description">
                    {description}
                  </BaseDialog.Description>
                ) : null}
              </div>
              {!hideClose ? (
                <BaseDialog.Close
                  render={<IconButton aria-label="Close dialog" size="sm" variant="ghost" color="neutral" />}
                >
                  <CloseIcon />
                </BaseDialog.Close>
              ) : null}
            </header>
          ) : null}
          <div className="zest-dialog__body">{bodyChildren}</div>
          {footerChildren}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    );
  }
);

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <footer className={cx('zest-dialog__footer', className)} {...props} />;
}

/* Explicit composition parts — alternatives to Content's `title`/`description`
   props when a dialog needs a fully custom header or body. */

export interface DialogHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

function DialogHeader({ title, description, className, children, ...props }: DialogHeaderProps) {
  return (
    <header className={cx('zest-dialog__header', className)} {...props}>
      <div className="zest-dialog__heading">
        {title ? (
          <BaseDialog.Title className="zest-dialog__title">{title}</BaseDialog.Title>
        ) : null}
        {description ? (
          <BaseDialog.Description className="zest-dialog__description">
            {description}
          </BaseDialog.Description>
        ) : null}
        {children}
      </div>
    </header>
  );
}

function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('zest-dialog__body', className)} {...props} />;
}

export const Dialog = {
  Root: BaseDialog.Root,
  Trigger: BaseDialog.Trigger,
  Close: BaseDialog.Close,
  Content: DialogContent,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
};

export type DialogRootProps = React.ComponentProps<typeof BaseDialog.Root>;
