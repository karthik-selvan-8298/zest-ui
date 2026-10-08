import * as React from 'react';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { cx } from '../../utils';
import type { WithClassName, ZestColor } from '../../types';
import '../../base.css';
import './Radio.css';

export interface RadioProps extends WithClassName<
  Omit<React.ComponentProps<typeof BaseRadio.Root>, 'color'>
> {
  /**
   * Visible label rendered next to the circle. When set, the control is
   * wrapped in a `<label>` and `className` moves to that wrapper.
   */
  label?: React.ReactNode;
  /** Ring and dot tone when checked. Defaults to `primary`. */
  color?: ZestColor;
  /** Circle size (16px / 20px). Defaults to `md`. */
  size?: 'sm' | 'md';
}

/**
 * Single radio option on Base UI Radio. Must be placed inside a `RadioGroup`,
 * which owns the selected value.
 *
 * ```tsx
 * <RadioGroup aria-label="Plan" defaultValue="pro">
 *   <Radio value="free" label="Free" />
 *   <Radio value="pro" label="Pro" />
 * </RadioGroup>
 * ```
 */
export const Radio = React.forwardRef<HTMLButtonElement, RadioProps>(function Radio(
  { label, color = 'primary', size = 'md', className, ...props },
  ref
) {
  const control = (
    <BaseRadio.Root
      ref={ref}
      className={cx('zest-radio', 'zest-focusable', !label && className)}
      data-accent={color}
      data-size={size}
      {...props}
    >
      {/* Kept mounted so the dot can scale in/out via CSS. */}
      <BaseRadio.Indicator className="zest-radio__indicator" keepMounted />
    </BaseRadio.Root>
  );

  if (!label) return control;
  return (
    <label className={cx('zest-radio-label', className)}>
      {control}
      <span className="zest-radio-label__text">{label}</span>
    </label>
  );
});

export interface RadioGroupProps extends WithClassName<
  React.ComponentProps<typeof BaseRadioGroup>
> {
  /** Stack options vertically (default) or lay them out in a wrapping row. */
  orientation?: 'vertical' | 'horizontal';
}

/** Radio group — arrow-key navigation and form integration via Base UI. */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { className, orientation = 'vertical', ...props },
  ref
) {
  return (
    <BaseRadioGroup
      ref={ref}
      className={cx('zest-radio-group', className)}
      data-orientation={orientation}
      {...props}
    />
  );
});
