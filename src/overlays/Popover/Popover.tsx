import * as React from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import './Popover.css';

export interface PopoverContentProps extends WithClassName<
  React.ComponentProps<typeof BasePopover.Popup>
> {
  /** Side of the trigger the popup is placed on. @default 'bottom' */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Alignment along the chosen side. @default 'center' */
  align?: 'start' | 'center' | 'end';
  /** Gap between the trigger and the popup, in px. @default 6 */
  sideOffset?: number;
  children?: React.ReactNode;
}

/** Portal → Positioner → Popup with the shared floating-surface recipe. */
const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(
    { side = 'bottom', align = 'center', sideOffset = 6, className, children, ...props },
    ref
  ) {
    return (
      <BasePopover.Portal>
        <BasePopover.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          className="zest-popover__positioner"
        >
          <BasePopover.Popup ref={ref} className={cx('zest-popover', className)} {...props}>
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    );
  }
);

/**
 * Composable popover on Base UI — non-modal floating panel anchored to its
 * trigger, with focus management and dismissal from the primitive.
 *
 * ```tsx
 * <Popover.Root>
 *   <Popover.Trigger render={<Button>Open</Button>} />
 *   <Popover.Content side="bottom">…</Popover.Content>
 * </Popover.Root>
 * ```
 */
export const Popover = {
  Root: BasePopover.Root,
  Trigger: BasePopover.Trigger,
  Close: BasePopover.Close,
  Title: BasePopover.Title,
  Description: BasePopover.Description,
  Content: PopoverContent,
};

export type PopoverRootProps = React.ComponentProps<typeof BasePopover.Root>;
