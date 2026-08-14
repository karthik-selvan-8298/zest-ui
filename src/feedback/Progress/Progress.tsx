import * as React from 'react';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { cx } from '../../utils';
import type { WithClassName, ZestColor } from '../../types';
import '../../base.css';
import './Progress.css';

export interface ProgressProps
  extends WithClassName<Omit<React.ComponentProps<typeof BaseProgress.Root>, 'value'>> {
  /**
   * Current value between `min` and `max` (0–100 by default).
   * `null` renders an indeterminate sliding bar.
   * @default null
   */
  value?: number | null;
  color?: ZestColor;
  size?: 'sm' | 'md';
  /** Show the formatted value (e.g. "40%") next to the label. */
  showValue?: boolean;
  /** Accessible label rendered above the bar. */
  label?: React.ReactNode;
}

/**
 * Linear progress bar on Base UI Progress.
 *
 * ```tsx
 * <Progress value={60} label="Uploading…" showValue />
 * <Progress value={null} color="info" />
 * ```
 */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value = null, color = 'primary', size = 'md', showValue = false, label, className, ...props },
  ref
) {
  return (
    <BaseProgress.Root
      ref={ref}
      value={value}
      className={cx('zest-progress', className)}
      data-accent={color}
      data-size={size}
      {...props}
    >
      {label || showValue ? (
        <div className="zest-progress__header">
          {label ? (
            <BaseProgress.Label className="zest-progress__label">{label}</BaseProgress.Label>
          ) : null}
          {showValue ? <BaseProgress.Value className="zest-progress__value" /> : null}
        </div>
      ) : null}
      <BaseProgress.Track className="zest-progress__track">
        <BaseProgress.Indicator className="zest-progress__indicator" />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
});
