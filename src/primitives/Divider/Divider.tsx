import * as React from 'react';
import { cx } from '../../utils';
import './Divider.css';

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Dashed rule, as used by Sigma card sections. */
  variant?: 'solid' | 'dashed';
  /** Optional inline label, centered on the rule. */
  children?: React.ReactNode;
}

/**
 * Thematic break. Without a label it renders a real `<hr>` (implicit
 * `separator` role); with a label it renders a `<div>` carrying the text
 * between two rules, so the label stays readable by assistive tech.
 *
 * ```tsx
 * <Divider />
 * <Divider variant="dashed">or</Divider>
 * <Divider orientation="vertical" />
 * ```
 */
export const Divider = React.forwardRef<HTMLElement, DividerProps>(function Divider(
  { orientation = 'horizontal', variant = 'solid', className, children, ...props },
  ref
) {
  if (!children) {
    return (
      <hr
        ref={ref as React.Ref<HTMLHRElement>}
        aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
        className={cx('zest-divider', className)}
        data-orientation={orientation}
        data-variant={variant}
        {...props}
      />
    );
  }
  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={cx('zest-divider', className)}
      data-orientation={orientation}
      data-variant={variant}
      data-with-label=""
      {...props}
    >
      <span className="zest-divider__label">{children}</span>
    </div>
  );
});
