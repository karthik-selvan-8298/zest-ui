import * as React from 'react';
import { Field } from '@base-ui/react/field';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import './FormField.css';

/* Base UI Field wires label / description / error to the control with
   correct aria attributes and validation state — Zest only styles it. */

export interface FormFieldProps extends WithClassName<React.ComponentProps<typeof Field.Root>> {
  children?: React.ReactNode;
}

/** Form field context wrapper: `<FormField><Label/><Input/><HelperText/><FieldError/></FormField>` */
export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  { className, ...props },
  ref
) {
  return <Field.Root ref={ref} className={cx('zest-form-field', className)} {...props} />;
});

export interface LabelProps extends WithClassName<React.ComponentProps<typeof Field.Label>> {
  /** Marks the field as required with an asterisk. */
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, required, children, ...props },
  ref
) {
  return (
    <Field.Label ref={ref} className={cx('zest-label', className)} {...props}>
      {children}
      {required ? (
        <span aria-hidden className="zest-label__asterisk">
          *
        </span>
      ) : null}
    </Field.Label>
  );
});

export type HelperTextProps = WithClassName<React.ComponentProps<typeof Field.Description>>;

export const HelperText = React.forwardRef<HTMLParagraphElement, HelperTextProps>(
  function HelperText({ className, ...props }, ref) {
    return <Field.Description ref={ref} className={cx('zest-helper-text', className)} {...props} />;
  }
);

export type FieldErrorProps = WithClassName<React.ComponentProps<typeof Field.Error>>;

export const FieldError = React.forwardRef<HTMLDivElement, FieldErrorProps>(function FieldError(
  { className, ...props },
  ref
) {
  return <Field.Error ref={ref} className={cx('zest-field-error', className)} {...props} />;
});
