import * as React from 'react';
import { cx } from '../../utils';
import type { ZestColor } from '../../types';
import '../../base.css';
import './CircularProgress.css';

export interface CircularProgressProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Completion between 0 and 100. `undefined` renders an indeterminate spinner. */
  value?: number;
  /** Outer diameter in px. @default 40 */
  size?: number;
  /** Stroke width in px. @default 3.6 */
  thickness?: number;
  color?: ZestColor;
}

/**
 * Circular progress indicator (pure SVG).
 *
 * ```tsx
 * <CircularProgress />              // indeterminate spinner
 * <CircularProgress value={64} />   // determinate ring
 * ```
 */
export const CircularProgress = React.forwardRef<HTMLSpanElement, CircularProgressProps>(
  function CircularProgress(
    { value, size = 40, thickness = 3.6, color = 'primary', className, style, ...props },
    ref
  ) {
    const indeterminate = value === undefined;
    const clamped = indeterminate ? undefined : Math.min(100, Math.max(0, value));
    const center = size / 2;
    const radius = (size - thickness) / 2;

    return (
      <span
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        className={cx('zest-circular-progress', className)}
        data-accent={color}
        data-indeterminate={indeterminate ? '' : undefined}
        style={{ width: size, height: size, ...style }}
        {...props}
      >
        <svg viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden>
          {!indeterminate ? (
            <circle
              className="zest-circular-progress__track"
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={thickness}
            />
          ) : null}
          <circle
            className="zest-circular-progress__arc"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={thickness}
            strokeLinecap="round"
            /* pathLength normalizes dash math to 0–100 regardless of size. */
            pathLength={100}
            strokeDasharray={indeterminate ? undefined : 100}
            strokeDashoffset={indeterminate ? undefined : 100 - (clamped as number)}
          />
        </svg>
      </span>
    );
  }
);
