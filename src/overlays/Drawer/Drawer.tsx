import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { CloseIcon } from '../../icons';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import { IconButton } from '../../actions/IconButton/IconButton';
import '../../base.css';
import './Drawer.css';

/*
 * Drawer — a modal side sheet built on the Base UI dialog primitive
 * (focus trapping, dismissal, and aria wiring come for free).
 *
 * <Drawer.Root>
 *   <Drawer.Trigger render={<Button>Open filters</Button>} />
 *   <Drawer.Content title="Filters" side="right" size="md">
 *     …body…
 *   </Drawer.Content>
 * </Drawer.Root>
 */

export interface DrawerContentProps
  extends WithClassName<Omit<React.ComponentProps<typeof BaseDialog.Popup>, 'title'>> {
  /** Edge the drawer slides in from. */
  side?: 'right' | 'left' | 'bottom';
  /** Width of the sheet (left/right sides). */
  size?: 'sm' | 'md' | 'lg';
  /** Drawer title (renders an accessible Dialog.Title). */
  title?: React.ReactNode;
  /** Supporting description under the title. */
  description?: React.ReactNode;
  /** Hide the corner close button. */
  hideClose?: boolean;
  children?: React.ReactNode;
}

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(function DrawerContent(
  {
    side = 'right',
    size = 'md',
    title,
    description,
    hideClose = false,
    className,
    children,
    ...props
  },
  ref
) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="zest-drawer__backdrop" />
      <BaseDialog.Popup
        ref={ref}
        className={cx('zest-drawer__popup', className)}
        data-side={side}
        data-size={size}
        {...props}
      >
        {title || !hideClose ? (
          <header className="zest-drawer__header">
            <div className="zest-drawer__heading">
              {title ? (
                <BaseDialog.Title className="zest-drawer__title">{title}</BaseDialog.Title>
              ) : null}
              {description ? (
                <BaseDialog.Description className="zest-drawer__description">
                  {description}
                </BaseDialog.Description>
              ) : null}
            </div>
            {!hideClose ? (
              <BaseDialog.Close
                render={<IconButton aria-label="Close drawer" size="sm" variant="ghost" color="neutral" />}
              >
                <CloseIcon />
              </BaseDialog.Close>
            ) : null}
          </header>
        ) : null}
        <div className="zest-drawer__body">{children}</div>
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
});

export const Drawer = {
  Root: BaseDialog.Root,
  Trigger: BaseDialog.Trigger,
  Close: BaseDialog.Close,
  Content: DrawerContent,
};

export type DrawerRootProps = React.ComponentProps<typeof BaseDialog.Root>;
