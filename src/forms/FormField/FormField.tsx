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

/* Base UI's Field parts throw without a Field.Root ancestor. Zest tracks the
   ancestor itself so Label/HelperText/FieldError degrade to plain elements
   when used standalone (a toolbar label, a caption under a custom control). */
const InFieldContext = React.createContext(false);

/**
 * Field context wrapper (Base UI Field.Root). Associates its `Label`,
 * `HelperText` and `FieldError` with the control inside and carries the
 * `name`, `disabled`, `invalid` and validation state.
 *
 * ```tsx
 * <FormField name="email" invalid={!!error}>
 *   <Label required>Email</Label>
 *   <Input type="email" error={!!error} />
 *   <HelperText>We never share it.</HelperText>
 *   <FieldError match>{error}</FieldError>
 * </FormField>
 * ```
 */
export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  { className, ...props },
  ref
) {
  return (
    <InFieldContext.Provider value={true}>
      <Field.Root ref={ref} className={cx('zest-form-field', className)} {...props} />
    </InFieldContext.Provider>
  );
});

export interface LabelProps extends WithClassName<React.ComponentProps<typeof Field.Label>> {
  /** Marks the field as required with an asterisk. */
  required?: boolean;
}

/** Field label. Inside a `FormField` it labels the control; standalone it is a plain `<label>`. */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, required, children, ...props },
  ref
) {
  // The asterisk is decorative (aria-hidden); the requirement itself is
  // announced from the control (`required` on Input/Select sets
  // aria-required there — `aria-required` is not a valid attribute on <label>).
  const inField = React.useContext(InFieldContext);
  const content = (
    <>
      {children}
      {required ? (
        <span aria-hidden className="zest-label__asterisk">
          *
        </span>
      ) : null}
    </>
  );
  if (!inField) {
    const { render: _render, ...labelProps } = props as typeof props & { render?: unknown };
    return (
      <label
        ref={ref}
        className={cx('zest-label', className)}
        {...(labelProps as React.LabelHTMLAttributes<HTMLLabelElement>)}
      >
        {content}
      </label>
    );
  }
  return (
    <Field.Label ref={ref} className={cx('zest-label', className)} {...props}>
      {content}
    </Field.Label>
  );
});

export type HelperTextProps = WithClassName<React.ComponentProps<typeof Field.Description>>;

/** Supporting text under a control, wired as its description inside a `FormField`. */
export const HelperText = React.forwardRef<HTMLParagraphElement, HelperTextProps>(
  function HelperText({ className, ...props }, ref) {
    const inField = React.useContext(InFieldContext);
    if (!inField) {
      const { render: _render, ...rest } = props as typeof props & { render?: unknown };
      return (
        <p
          ref={ref}
          className={cx('zest-helper-text', className)}
          {...(rest as React.HTMLAttributes<HTMLParagraphElement>)}
        />
      );
    }
    return <Field.Description ref={ref} className={cx('zest-helper-text', className)} {...props} />;
  }
);

export type FieldErrorProps = WithClassName<React.ComponentProps<typeof Field.Error>>;

/**
 * Validation message. Inside a `FormField` it shows when the field is invalid
 * (or always, with `match`); standalone it renders an always-visible alert.
 */
export const FieldError = React.forwardRef<HTMLDivElement, FieldErrorProps>(function FieldError(
  { className, ...props },
  ref
) {
  const inField = React.useContext(InFieldContext);
  if (!inField) {
    const {
      render: _render,
      match: _match,
      ...rest
    } = props as typeof props & { render?: unknown };
    return (
      <div
        ref={ref}
        role="alert"
        className={cx('zest-field-error', className)}
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      />
    );
  }
  return <Field.Error ref={ref} className={cx('zest-field-error', className)} {...props} />;
});
