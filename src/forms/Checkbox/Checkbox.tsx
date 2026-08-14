import * as React from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { cx } from '../../utils';
import type { WithClassName, ZestColor } from '../../types';
import '../../base.css';
import './Checkbox.css';

export interface CheckboxProps
  extends WithClassName<Omit<React.ComponentProps<typeof BaseCheckbox.Root>, 'color'>> {
  /** Visible label rendered next to the box. */
  label?: React.ReactNode;
  color?: ZestColor;
  size?: 'sm' | 'md';
}

/**
 * Checkbox on Base UI — supports checked/unchecked/indeterminate, keyboard
 * interaction, and form integration.
 */
export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { label, color = 'primary', size = 'md', className, ...props },
  ref
) {
  const control = (
    <BaseCheckbox.Root
      ref={ref}
      className={cx('zest-checkbox', 'zest-focusable', !label && className)}
      data-accent={color}
      data-size={size}
      {...props}
    >
      <BaseCheckbox.Indicator className="zest-checkbox__indicator" keepMounted>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
          <path className="zest-checkbox__check" d="M5 12.5 10 17.5 19 7" strokeLinecap="round" strokeLinejoin="round" />
          <path className="zest-checkbox__dash" d="M6 12h12" strokeLinecap="round" />
        </svg>
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );

  if (!label) return control;
  return (
    <label className={cx('zest-checkbox-label', className)} data-size={size}>
      {control}
      <span className="zest-checkbox-label__text">{label}</span>
    </label>
  );
});

export type CheckboxGroupProps = WithClassName<React.ComponentProps<typeof BaseCheckboxGroup>>;

/** Groups checkboxes sharing a `value` array (Base UI CheckboxGroup). */
export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  function CheckboxGroup({ className, ...props }, ref) {
    return (
      <BaseCheckboxGroup ref={ref} className={cx('zest-checkbox-group', className)} {...props} />
    );
  }
);
