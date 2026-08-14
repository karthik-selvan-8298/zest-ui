import * as React from 'react';
import { cx } from '../../utils';
import './ButtonGroup.css';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Buttons stretch equally to fill the group. */
  fullWidth?: boolean;
  children?: React.ReactNode;
}

/** Visually joins adjacent Buttons/IconButtons into one segmented control. */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup(
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
  }
);
