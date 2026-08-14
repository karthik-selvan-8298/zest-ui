import * as React from 'react';
import { cx } from '../../utils';
import './Divider.css';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Dashed rule, as used by Sigma card sections. */
  variant?: 'solid' | 'dashed';
  /** Optional inline label, centered on the rule. */
  children?: React.ReactNode;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = 'horizontal', variant = 'solid', className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      role={children ? undefined : 'separator'}
      aria-orientation={children ? undefined : orientation}
      className={cx('zest-divider', className)}
      data-orientation={orientation}
      data-variant={variant}
      data-with-label={children ? '' : undefined}
      {...props}
    >
      {children ? <span className="zest-divider__label">{children}</span> : null}
    </div>
  );
});
