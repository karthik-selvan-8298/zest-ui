import * as React from 'react';
import { Meter as BaseMeter } from '@base-ui/react/meter';
import { cx } from '../../utils';
import type { WithClassName, ZestColor } from '../../types';
import '../../base.css';
import './Meter.css';

interface MeterBaseProps extends WithClassName<
  Omit<React.ComponentProps<typeof BaseMeter.Root>, 'aria-label' | 'aria-labelledby'>
> {
  /** Current measurement between `min` and `max` (0–100 by default). */
  value: number;
  /** Tone of the indicator. Overridden by `thresholds` once they are crossed. */
  color?: ZestColor;
  size?: 'sm' | 'md';
  /** Show the formatted value (e.g. "40%") next to the label. */
  showValue?: boolean;
  /**
   * Tone escalation points. The indicator turns `warning` once
   * `value >= thresholds.warning` and `error` once `value >= thresholds.error`
   * (e.g. storage at 80% / 95%).
   */
  thresholds?: { warning?: number; error?: number };
  /**
   * Split the track into this many equal segments separated by 2px gaps
   * (password-strength style). Values ≤ 1 render a continuous bar.
   */
  segments?: number;
}

/** A Meter must have an accessible name: a visible `label`, or an aria name. */
type MeterLabelling =
  | { label: React.ReactNode; 'aria-label'?: string; 'aria-labelledby'?: string }
  | { label?: React.ReactNode; 'aria-label': string; 'aria-labelledby'?: string }
  | { label?: React.ReactNode; 'aria-label'?: string; 'aria-labelledby': string };

export type MeterProps = MeterBaseProps & MeterLabelling;

/**
 * Static measurement bar on Base UI Meter — quota used, storage, password
 * strength. Semantically distinct from Progress (a task in flight).
 *
 * ```tsx
 * <Meter value={72} label="Storage" showValue thresholds={{ warning: 80, error: 95 }} />
 * <Meter value={50} segments={4} aria-label="Password strength" color="success" />
 * ```
 */
export const Meter = React.forwardRef<HTMLDivElement, MeterProps>(function Meter(
  {
    value,
    color = 'primary',
    size = 'md',
    showValue = false,
    label,
    thresholds,
    segments,
    className,
    style,
    ...props
  },
  ref
) {
  let accent: ZestColor = color;
  if (thresholds?.error !== undefined && value >= thresholds.error) {
    accent = 'error';
  } else if (thresholds?.warning !== undefined && value >= thresholds.warning) {
    accent = 'warning';
  }

  const segmented = segments !== undefined && segments > 1;

  return (
    <BaseMeter.Root
      ref={ref}
      value={value}
      className={cx('zest-meter', className)}
      data-accent={accent}
      data-size={size}
      data-segmented={segmented ? '' : undefined}
      style={segmented ? ({ ...style, '--_segments': segments } as React.CSSProperties) : style}
      {...props}
    >
      {label || showValue ? (
        <div className="zest-meter__header">
          {label ? <BaseMeter.Label className="zest-meter__label">{label}</BaseMeter.Label> : null}
          {showValue ? <BaseMeter.Value className="zest-meter__value" /> : null}
        </div>
      ) : null}
      <BaseMeter.Track className="zest-meter__track">
        <BaseMeter.Indicator className="zest-meter__indicator" />
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
});
