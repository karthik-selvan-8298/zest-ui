import * as React from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { cx } from '../../utils';
import '../../base.css';
import './Input.css';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Field size. Defaults to `md`. */
  size?: 'sm' | 'md';
  /** Error appearance (also set automatically inside an invalid FormField). */
  error?: boolean;
  /** Leading adornment (icon, prefix text). */
  startAdornment?: React.ReactNode;
  /** Trailing adornment (icon, suffix text). */
  endAdornment?: React.ReactNode;
  /** Convenience alias for a leading icon (same slot as startAdornment). */
  startIcon?: React.ReactNode;
  /** Convenience alias for a trailing icon (same slot as endAdornment). */
  endIcon?: React.ReactNode;
  /** Stretch to container width. */
  fullWidth?: boolean;
  /**
   * Label rendered inside the field that floats onto the top border on
   * focus/value (the Sigma field style). Pass a ready label element —
   * TextField wires this up via its `labelPlacement="floating"` prop.
   */
  floatingLabel?: React.ReactNode;
}

/**
 * Text input. Integrates with FormField (Base UI Field) for automatic
 * label/description/error wiring.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    error,
    startAdornment,
    endAdornment,
    startIcon,
    endIcon,
    fullWidth,
    floatingLabel,
    placeholder,
    className,
    disabled,
    ...props
  },
  ref
) {
  const start = startAdornment ?? startIcon;
  const end = endAdornment ?? endIcon;
  return (
    <span
      className={cx('zest-input', className)}
      data-size={size}
      data-error={error ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-full-width={fullWidth ? '' : undefined}
      data-floating={floatingLabel ? '' : undefined}
    >
      {start ? <span className="zest-input__adornment">{start}</span> : null}
      <BaseInput
        ref={ref}
        className="zest-input__control"
        disabled={disabled}
        // :placeholder-shown drives the floating-label rest position.
        placeholder={floatingLabel ? (placeholder ?? ' ') : placeholder}
        {...props}
      />
      {floatingLabel}
      {end ? <span className="zest-input__adornment">{end}</span> : null}
    </span>
  );
});
