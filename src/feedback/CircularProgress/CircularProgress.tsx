import * as React from 'react';
import { cx } from '../../utils';
import type { AccessibleName, ZestColor } from '../../types';
import '../../base.css';
import './CircularProgress.css';

interface CircularProgressBaseProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  'color' | 'aria-label' | 'aria-labelledby'
> {
  /** Completion between 0 and 100. `undefined` renders an indeterminate spinner. */
  value?: number;
  /** Outer diameter in px. @default 40 */
  size?: number;
  /** Stroke width in px. @default 3.6 */
  thickness?: number;
  /** Tone of the arc. @default 'primary' */
  color?: ZestColor;
}

/**
 * The ring has no text of its own, so one of `label` (announced, not
 * rendered), `aria-label`, or `aria-labelledby` is required.
 */
export type CircularProgressProps = CircularProgressBaseProps & AccessibleName;

/**
 * Circular progress indicator (pure SVG).
 *
 * ```tsx
 * <CircularProgress aria-label="Loading" />       // indeterminate spinner
 * <CircularProgress value={64} label="Upload" />  // determinate ring
 * ```
 */
export const CircularProgress = React.forwardRef<HTMLSpanElement, CircularProgressProps>(
  function CircularProgress(
    {
      value,
      size = 40,
      thickness = 3.6,
      color = 'primary',
      label,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      className,
      style,
      ...props
    },
    ref
  ) {
    const indeterminate = value === undefined;
    const clamped = indeterminate ? undefined : Math.min(100, Math.max(0, value));
    const center = size / 2;
    const radius = (size - thickness) / 2;

    // `progressbar` takes its name from author attributes only, so a
    // non-string `label` is rendered visually hidden and referenced by id.
    const labelId = React.useId();
    const labelIsText = typeof label === 'string' || typeof label === 'number';
    const resolvedAriaLabel = ariaLabel ?? (labelIsText ? String(label) : undefined);
    const resolvedLabelledby =
      ariaLabelledby ?? (label != null && !labelIsText ? labelId : undefined);

    return (
      <span
        ref={ref}
        role="progressbar"
        aria-label={resolvedAriaLabel}
        aria-labelledby={resolvedLabelledby}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        className={cx('zest-circular-progress', className)}
        data-accent={color}
        data-indeterminate={indeterminate ? '' : undefined}
        style={{ width: size, height: size, ...style }}
        {...props}
      >
        {label != null && !labelIsText ? (
          <span id={labelId} className="zest-visually-hidden">
            {label}
          </span>
        ) : null}
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
