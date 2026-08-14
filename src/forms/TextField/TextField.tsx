import * as React from 'react';
import { FormField, Label, HelperText, FieldError } from '../FormField/FormField';
import { Input, type InputProps } from '../Input/Input';

export interface TextFieldProps extends InputProps {
  /** Field label. */
  label?: React.ReactNode;
  /**
   * Where the label lives: static above the field (default) or floating
   * inside the field onto its border — the Sigma dashboard field style.
   */
  labelPlacement?: 'top' | 'floating';
  /** Helper text below the input. */
  helperText?: React.ReactNode;
  /** Error message. When set, the field renders in its error state. */
  errorText?: React.ReactNode;
  required?: boolean;
  /** Name for form submission and Field wiring. */
  name?: string;
}

/**
 * Batteries-included text field: label + input + helper/error, fully wired
 * for accessibility via Base UI Field.
 *
 * ```tsx
 * <TextField label="Email" placeholder="you@company.com" helperText="Work email" />
 * ```
 */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    labelPlacement = 'top',
    helperText,
    errorText,
    required,
    name,
    disabled,
    error,
    ...inputProps
  },
  ref
) {
  const hasError = Boolean(errorText) || error;
  const floating = labelPlacement === 'floating' && label;
  return (
    <FormField name={name} disabled={disabled} invalid={hasError || undefined}>
      {label && !floating ? <Label required={required}>{label}</Label> : null}
      <Input
        ref={ref}
        error={hasError}
        required={required}
        floatingLabel={
          floating ? (
            <Label className="zest-input__label" required={required}>
              {label}
            </Label>
          ) : undefined
        }
        {...inputProps}
      />
      {errorText ? (
        <FieldError match>{errorText}</FieldError>
      ) : null}
      {helperText && !errorText ? <HelperText>{helperText}</HelperText> : null}
    </FormField>
  );
});
