import * as React from 'react';
import { cx } from '../../utils';
import '../../base.css';
import './Textarea.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Field size — matches `Input`. Defaults to `md`. */
  size?: 'sm' | 'md';
  /** Error appearance (also set automatically inside an invalid FormField). */
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
    <textarea
      ref={ref}
      rows={rows}
      className={cx('zest-textarea', className)}
      data-size={size}
      data-error={error ? '' : undefined}
      data-full-width={fullWidth ? '' : undefined}
      {...props}
    />
  );
});
