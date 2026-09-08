import * as React from 'react';
import { OTPField } from '@base-ui/react/otp-field';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import '../../base.css';
import './OtpInput.css';

export interface OtpInputProps extends WithClassName<
  Omit<
    React.ComponentProps<typeof OTPField.Root>,
    'length' | 'onValueChange' | 'onValueComplete' | 'validationType' | 'mask' | 'children'
  >
> {
  /** Number of character cells. Defaults to 6. */
  length?: number;
  /** Controlled value (a string of up to `length` characters). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fires once every cell is filled (and again when a complete code is pasted). */
  onComplete?: (value: string) => void;
  /**
   * Accepted characters. `numeric` (default) sets a numeric keyboard hint and
   * pattern; `alphanumeric` allows letters and digits. Autocomplete is
   * `one-time-code` either way.
   */
  type?: 'numeric' | 'alphanumeric';
  /** Obscure entered characters (password-style dots). */
  mask?: boolean;
  /** Cell size — matches the Input field heights. Defaults to `md`. */
  size?: 'sm' | 'md';
  /** Error appearance (also set automatically inside an invalid FormField). */
  error?: boolean;
  disabled?: boolean;
  /** Focus the first cell on mount. */
  autoFocus?: boolean;
  /** Form field name for the hidden submit input. */
  name?: string;
  /** Node rendered between the two halves of the code (e.g. "–"). */
  separator?: React.ReactNode;
  /** Cells grow to fill the container width. */
  fullWidth?: boolean;
}

/**
 * One-time-code / PIN entry on Base UI OTP Field. Handles typing across
 * cells, paste, backspace, and form submission via a hidden input.
 *
 * ```tsx
 * <FormField name="code">
 *   <Label>Verification code</Label>
 *   <OtpInput length={6} separator="–" onComplete={verify} autoFocus />
 *   <HelperText>Sent to your phone.</HelperText>
 * </FormField>
 * ```
 */
export const OtpInput = React.forwardRef<HTMLDivElement, OtpInputProps>(function OtpInput(
  {
    length = 6,
    onValueChange,
    onComplete,
    type = 'numeric',
    mask = false,
    size = 'md',
    error,
    disabled,
    autoFocus,
    separator,
    fullWidth,
    className,
    ...props
  },
  ref
) {
  const separatorAfter = separator != null && length > 1 ? Math.floor(length / 2) - 1 : -1;

  return (
    <OTPField.Root
      ref={ref}
      length={length}
      validationType={type}
      mask={mask}
      disabled={disabled}
      onValueChange={onValueChange}
      onValueComplete={onComplete}
      className={cx('zest-otp-input', className)}
      data-size={size}
      data-error={error ? '' : undefined}
      data-full-width={fullWidth ? '' : undefined}
      {...props}
    >
      {Array.from({ length }, (_, index) => (
        <React.Fragment key={index}>
          <OTPField.Input
            className="zest-otp-input__cell"
            autoFocus={index === 0 ? autoFocus : undefined}
            // The first cell inherits the field label (FormField / <label>);
            // the rest announce their position.
            aria-label={index === 0 ? undefined : `Character ${index + 1} of ${length}`}
          />
          {index === separatorAfter ? (
            <span className="zest-otp-input__separator" aria-hidden>
              {separator}
            </span>
          ) : null}
        </React.Fragment>
      ))}
    </OTPField.Root>
  );
});
