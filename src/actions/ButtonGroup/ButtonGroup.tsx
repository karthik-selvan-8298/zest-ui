import * as React from 'react';
import { cx } from '../../utils';
import './ButtonGroup.css';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Layout axis. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Buttons stretch equally to fill the group. */
  fullWidth?: boolean;
  children?: React.ReactNode;
}

/**
 * Visually joins adjacent Buttons/IconButtons into one segmented control
 * (`role="group"`).
 *
 * ```tsx
 * <ButtonGroup aria-label="Text alignment">
 *   <Button variant="outlined">Left</Button>
 *   <Button variant="outlined">Center</Button>
 *   <Button variant="outlined">Right</Button>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { orientation = 'horizontal', fullWidth, className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      role="group"
      className={cx('zest-button-group', className)}
      data-orientation={orientation}
      data-full-width={fullWidth ? '' : undefined}
      {...props}
    >
      {children}
    </div>
  );
});
