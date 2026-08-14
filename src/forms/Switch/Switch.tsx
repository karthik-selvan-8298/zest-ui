import * as React from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { cx } from '../../utils';
import type { WithClassName, ZestColor } from '../../types';
import '../../base.css';
import './Switch.css';

export interface SwitchProps
  extends WithClassName<Omit<React.ComponentProps<typeof BaseSwitch.Root>, 'color'>> {
  label?: React.ReactNode;
  color?: ZestColor;
  size?: 'sm' | 'md';
}

/** Toggle switch on Base UI Switch. */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, color = 'primary', size = 'md', className, ...props },
  ref
) {
  const control = (
    <BaseSwitch.Root
      ref={ref}
      className={cx('zest-switch', 'zest-focusable', !label && className)}
      data-accent={color}
      data-size={size}
      {...props}
    >
      <BaseSwitch.Thumb className="zest-switch__thumb" />
    </BaseSwitch.Root>
  );

  if (!label) return control;
  return (
    <label className={cx('zest-switch-label', className)}>
      {control}
      <span className="zest-switch-label__text">{label}</span>
    </label>
  );
});
