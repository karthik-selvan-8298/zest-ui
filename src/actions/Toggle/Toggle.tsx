import * as React from 'react';
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { cx } from '../../utils';
import type { WithClassName, ZestColor, ZestSize } from '../../types';
import '../../base.css';
import './Toggle.css';

export interface ToggleProps
  extends WithClassName<Omit<React.ComponentProps<typeof BaseToggle>, 'color'>> {
  /** Tone used for the pressed (soft) state. Defaults to `primary`. */
  color?: ZestColor;
  /** Control size. Defaults to `md`. */
  size?: ZestSize;
  /** Required for icon-only toggles — announces the action to screen readers. */
  'aria-label': string;
}

/**
 * Two-state icon button on Base UI Toggle. Unpressed it reads as a ghost
 * icon button; pressed it takes the soft accent treatment.
 *
 * ```tsx
 * <Toggle aria-label="Bold" defaultPressed>
 *   <BoldIcon />
 * </Toggle>
 * ```
 */
export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { color = 'primary', size = 'md', className, ...props },
  ref
) {
  return (
    <BaseToggle
      ref={ref}
      className={cx('zest-toggle', 'zest-focusable', className)}
      data-accent={color}
      data-size={size}
      {...props}
    />
  );
});
