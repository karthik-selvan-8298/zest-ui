import * as React from 'react';
import { Field } from '@base-ui/react/field';
import { cx } from '../../utils';
import '../../base.css';
import './Textarea.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Field size — matches `Input`. Defaults to `md`. */
  size?: 'sm' | 'md';
  /** Error appearance; also sets `aria-invalid` on the control. */
  error?: boolean;
  /** Stretch to container width. */
  fullWidth?: boolean;
}

/**
 * Multi-line text control sharing the Input field look. Compose with
 * `FormField` for label/helper/error wiring.
 *
 * ```tsx
 * <Textarea placeholder="Describe the issue…" rows={4} fullWidth />
 * ```
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, size = 'md', error, fullWidth, rows = 3, ...props },
  ref
) {
  return (
    // Rendered through Field.Control (as Input is) so a surrounding FormField
    // can associate its Label, HelperText and validation state with the
    // <textarea>; standalone it behaves like a plain element.
    <Field.Control
      ref={ref as React.Ref<HTMLElement>}
      render={<textarea rows={rows} />}
      className={cx('zest-textarea', className)}
      data-size={size}
      data-error={error ? '' : undefined}
      data-full-width={fullWidth ? '' : undefined}
      aria-invalid={error || undefined}
      {...(props as Field.Control.Props)}
    />
  );
});
