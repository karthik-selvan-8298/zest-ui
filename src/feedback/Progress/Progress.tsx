import * as React from 'react';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { cx } from '../../utils';
import type { AccessibleName, WithClassName, ZestColor } from '../../types';
import '../../base.css';
import './Progress.css';

interface ProgressBaseProps extends WithClassName<
  Omit<React.ComponentProps<typeof BaseProgress.Root>, 'value' | 'aria-label' | 'aria-labelledby'>
> {
  /**
   * Current value between `min` and `max` (0–100 by default).
   * `null` (the default) renders an indeterminate sliding bar.
   * @default null
   */
  value?: number | null;
  color?: ZestColor;
  size?: 'sm' | 'md';
  /** Show the formatted value (e.g. "40%") next to the label. */
  showValue?: boolean;
}

/**
 * A progress bar has no text of its own, so one of `label` (visible, rendered
 * above the bar), `aria-label`, or `aria-labelledby` is required.
 */
export type ProgressProps = ProgressBaseProps & AccessibleName;

/**
 * Linear progress bar on Base UI Progress.
 *
 * ```tsx
 * <Progress value={60} label="Uploading…" showValue />
 * <Progress value={null} color="info" aria-label="Loading" />
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
