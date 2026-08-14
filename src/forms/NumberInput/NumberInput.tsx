import * as React from 'react';
import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { PlusIcon, MinusIcon } from '../../icons';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import '../../base.css';
import './NumberInput.css';

export interface NumberInputProps
  extends WithClassName<Omit<React.ComponentProps<typeof BaseNumberField.Root>, 'color'>> {
  /** Field size. Defaults to `md`. */
  size?: 'sm' | 'md';
  /** Error appearance. */
  error?: boolean;
  /** Stretch to container width. */
  fullWidth?: boolean;
  /** Placeholder forwarded to the inner input. */
  placeholder?: string;
}

/**
 * Numeric field on Base UI NumberField with stepper buttons. Shares the
 * Input field look; supports min/max/step, keyboard stepping, and forms.
 *
 * ```tsx
 * <NumberInput aria-label="Quantity" defaultValue={1} min={0} max={99} />
 * ```
 */
export const NumberInput = React.forwardRef<HTMLDivElement, NumberInputProps>(
  function NumberInput(props, ref) {
    const {
      size = 'md',
      error,
      fullWidth,
      placeholder,
      className,
      'aria-label': ariaLabel,
      ...rest
    } = props;

    return (
      <BaseNumberField.Root
        ref={ref}
        className={cx('zest-number-input', className)}
        data-size={size}
        data-error={error ? '' : undefined}
        data-full-width={fullWidth ? '' : undefined}
        {...rest}
      >
        <BaseNumberField.Group className="zest-number-input__group">
          <BaseNumberField.Decrement
            className="zest-number-input__step zest-focusable"
            aria-label="Decrease"
          >
            <MinusIcon />
          </BaseNumberField.Decrement>
          <BaseNumberField.Input
            className="zest-number-input__control"
            placeholder={placeholder}
            aria-label={ariaLabel}
          />
          <BaseNumberField.Increment
            className="zest-number-input__step zest-focusable"
            aria-label="Increase"
          >
            <PlusIcon />
          </BaseNumberField.Increment>
        </BaseNumberField.Group>
      </BaseNumberField.Root>
    );
  }
);
