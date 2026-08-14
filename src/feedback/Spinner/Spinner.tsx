import * as React from 'react';
import { cx } from '../../utils';
import type { ZestColor } from '../../types';
import '../../base.css';
import './Spinner.css';

const sizeMap = { sm: 16, md: 24, lg: 32 } as const;

export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** `'sm'` 16px, `'md'` 24px, `'lg'` 32px, or an explicit pixel size. @default 'md' */
  size?: 'sm' | 'md' | 'lg' | number;
  /** `'inherit'` follows the surrounding text color (ideal inline in buttons). @default 'inherit' */
  color?: ZestColor | 'inherit';
}

/**
 * Small indeterminate spinner for inline use (buttons, empty states).
 * Inherits the surrounding text color by default.
 *
 * ```tsx
 * <Spinner size="sm" />
 * <Spinner color="primary" size={20} />
 * ```
 */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', color = 'inherit', className, style, ...props },
  ref
) {
  const px = typeof size === 'number' ? size : sizeMap[size];
  return (
    <span
      ref={ref}
      className={cx('zest-spinner', className)}
      data-accent={color === 'inherit' ? undefined : color}
      style={{ width: px, height: px, ...style }}
      {...props}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
});
