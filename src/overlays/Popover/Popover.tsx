import * as React from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import './Popover.css';

/*
 * Composable popover on Base UI.
 *
 * <Popover.Root>
 *   <Popover.Trigger render={<Button>Open</Button>} />
 *   <Popover.Content side="bottom">…</Popover.Content>
 * </Popover.Root>
 */

export interface PopoverContentProps extends WithClassName<React.ComponentProps<typeof BasePopover.Popup>> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  children?: React.ReactNode;
}

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

export const Popover = {
  Root: BasePopover.Root,
  Trigger: BasePopover.Trigger,
  Close: BasePopover.Close,
  Title: BasePopover.Title,
  Description: BasePopover.Description,
  Content: PopoverContent,
};

export type PopoverRootProps = React.ComponentProps<typeof BasePopover.Root>;
