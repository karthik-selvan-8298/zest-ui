import * as React from 'react';
import { Field } from '@base-ui/react/field';
import { ChevronDownIcon } from '../../icons';
import { cx } from '../../utils';
import '../../base.css';
import './NativeSelect.css';

/** One `<option>` of a NativeSelect. */
export interface NativeSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface NativeSelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'size'
> {
  /** Options rendered as `<option>` elements. */
  options: NativeSelectOption[];
  /** Field size. Defaults to `md`. */
  size?: 'sm' | 'md';
  /** Error appearance; also sets `aria-invalid` on the `<select>`. */
  error?: boolean;
  /** Stretch to container width. */
  fullWidth?: boolean;
  /** Rendered as a disabled empty option, shown until a value is chosen. */
  placeholder?: string;
}

/**
 * Native `<select>` with the Zest field look. Use this where the OS picker
 * is preferable to the composed Select (mobile forms, dense settings pages).
 *
 * ```tsx
 * <NativeSelect
 *   aria-label="Country"
 *   placeholder="Choose…"
 *   options={[{ value: 'in', label: 'India' }, { value: 'us', label: 'USA' }]}
 * />
 * ```
 */
export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect(
    {
      options,
      size = 'md',
      error,
      fullWidth,
      placeholder,
      className,
      disabled,
      // Options come from `options`; stray children would replace them.
      children: _children,
      ...props
    },
    ref
  ) {
    const hasValue = props.value !== undefined || props.defaultValue !== undefined;

    return (
      <span
        className={cx('zest-native-select', className)}
        data-size={size}
        data-error={error ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-full-width={fullWidth ? '' : undefined}
      >
        {/* Field.Control (as Input uses) lets a surrounding FormField label,
            describe and validate the <select>; standalone it is a plain element. */}
        <Field.Control
          ref={ref as React.Ref<HTMLElement>}
          render={
            <select>
              {placeholder !== undefined ? (
                <option value="" disabled>
                  {placeholder}
                </option>
              ) : null}
              {options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </select>
          }
          className="zest-native-select__control zest-focusable"
          disabled={disabled}
          aria-invalid={error || undefined}
          // Select the empty placeholder option unless a value was given.
          defaultValue={placeholder !== undefined && !hasValue ? '' : undefined}
          {...(props as Field.Control.Props)}
        />
        <span className="zest-native-select__icon" aria-hidden>
          <ChevronDownIcon />
        </span>
      </span>
    );
  }
);
