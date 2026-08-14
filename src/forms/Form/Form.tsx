import * as React from 'react';
import { Form as BaseForm } from '@base-ui/react/form';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import './Form.css';

export interface FormProps extends WithClassName<React.ComponentProps<typeof BaseForm>> {
  /** Gap between form rows. Defaults to a comfortable 16px stack. */
  gap?: 'sm' | 'md' | 'lg';
}

/**
 * Form on Base UI — wires submit handling and server-side field `errors`
 * into the FormField/FieldError components automatically.
 *
 * ```tsx
 * <Form onSubmit={handleSubmit} errors={serverErrors}>
 *   <TextField name="email" label="Email" required />
 *   <Button type="submit">Save</Button>
 * </Form>
 * ```
 */
export const Form = React.forwardRef<HTMLFormElement, FormProps>(function Form(
  { className, gap = 'md', ...props },
  ref
) {
  return <BaseForm ref={ref} className={cx('zest-form', className)} data-gap={gap} {...props} />;
});
