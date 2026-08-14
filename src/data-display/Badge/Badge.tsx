import * as React from 'react';
import { cx } from '../../utils';
import type { ZestColor } from '../../types';
import '../../base.css';
import './Badge.css';

/*
 * Badge — a small count or dot anchored to a child element,
 * or an inline pill when used standalone (no children).
 *
 * <Badge count={5} color="error"><IconButton …/></Badge>
 * <Badge dot color="success"><Avatar …/></Badge>
 * <Badge count={120} max={99} />   // standalone "99+" pill
 */

export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Number shown in the badge. */
  count?: number;
  /** Counts above this render as "max+". */
  max?: number;
  /** Render a small dot instead of a count. */
  dot?: boolean;
  color?: ZestColor;
  /** Show the badge when `count` is 0. */
  showZero?: boolean;
  /** Corner the badge is anchored to (wrapping usage only). */
  position?: BadgePosition;
  /** Element the badge is anchored to; omit for a standalone inline pill. */
  children?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    count,
    max = 99,
    dot = false,
    color = 'error',
    showZero = false,
    position = 'top-right',
    className,
    children,
    ...props
  },
  ref
) {
  const hasCount = count !== undefined && (count !== 0 || showZero);
  const visible = dot || hasCount;
  const label = dot ? null : hasCount ? (count > max ? `${max}+` : String(count)) : null;

  const indicator = visible ? (
    <span
      className="zest-badge__indicator"
      data-accent={color}
      data-dot={dot ? '' : undefined}
      data-position={children ? position : undefined}
    >
      {label}
    </span>
  ) : null;

  if (children === undefined) {
    return (
      <span
        ref={ref}
        className={cx('zest-badge', className)}
        data-standalone=""
        {...props}
      >
        {indicator}
      </span>
    );
  }

  return (
    <span ref={ref} className={cx('zest-badge', className)} {...props}>
      {children}
      {indicator}
    </span>
  );
});
