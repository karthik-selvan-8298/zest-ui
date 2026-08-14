import * as React from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import './ScrollArea.css';

export interface ScrollAreaProps
  extends WithClassName<React.ComponentProps<typeof BaseScrollArea.Root>> {
  /** Constrain the scrollable height (number of px or CSS length). */
  maxHeight?: number | string;
  /** Constrain the scrollable width. */
  maxWidth?: number | string;
  children?: React.ReactNode;
}

/**
 * Themed scroll container — replacement for a raw `overflow: auto` div,
 * with overlay scrollbars that match the design system in every browser.
 */
export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { maxHeight, maxWidth, className, children, style, ...props },
  ref
) {
  return (
    <BaseScrollArea.Root
      ref={ref}
      className={cx('zest-scroll-area', className)}
      style={{ maxHeight, maxWidth, ...style }}
      {...props}
    >
      <BaseScrollArea.Viewport className="zest-scroll-area__viewport">
        {children}
      </BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar className="zest-scroll-area__scrollbar" orientation="vertical">
        <BaseScrollArea.Thumb className="zest-scroll-area__thumb" />
      </BaseScrollArea.Scrollbar>
      <BaseScrollArea.Scrollbar className="zest-scroll-area__scrollbar" orientation="horizontal">
        <BaseScrollArea.Thumb className="zest-scroll-area__thumb" />
      </BaseScrollArea.Scrollbar>
      <BaseScrollArea.Corner className="zest-scroll-area__corner" />
    </BaseScrollArea.Root>
  );
});
