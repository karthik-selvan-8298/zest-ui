import * as React from 'react';
import { cx } from '../../utils';
import '../../base.css';
import './Skeleton.css';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default 'text' */
  variant?: SkeletonVariant;
  /** CSS width; numbers are px. */
  width?: number | string;
  /** CSS height; numbers are px. The `text` variant defaults to one line (1.2em). */
  height?: number | string;
  /** `false` disables the animation entirely. @default 'pulse' */
  animation?: 'pulse' | 'wave' | false;
}

/**
 * Animated placeholder shown while content loads. Decorative only
 * (`aria-hidden`) — announce loading on the container instead, e.g. with
 * `aria-busy`.
 *
 * ```tsx
 * <Skeleton width="60%" />
 * <Skeleton variant="circular" width={40} height={40} />
 * <Skeleton variant="rounded" height={120} animation="wave" />
 * ```
 */
export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, animation = 'pulse', className, style, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      aria-hidden
      className={cx('zest-skeleton', className)}
      data-variant={variant}
      data-animation={animation === false ? undefined : animation}
      style={{ width, height, ...style }}
      {...props}
    />
  );
});
