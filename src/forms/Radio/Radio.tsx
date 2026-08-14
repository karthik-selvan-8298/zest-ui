import * as React from 'react';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { cx } from '../../utils';
import type { WithClassName, ZestColor } from '../../types';
import '../../base.css';
import './Radio.css';

export interface RadioProps extends WithClassName<Omit<React.ComponentProps<typeof BaseRadio.Root>, 'color'>> {
  label?: React.ReactNode;
  color?: ZestColor;
  size?: 'sm' | 'md';
}

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

export interface RadioGroupProps extends WithClassName<React.ComponentProps<typeof BaseRadioGroup>> {
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
