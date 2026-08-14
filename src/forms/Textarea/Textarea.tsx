import * as React from 'react';
import { cx } from '../../utils';
import '../../base.css';
import './Textarea.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, error, fullWidth, rows = 3, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cx('zest-textarea', className)}
      data-error={error ? '' : undefined}
      data-full-width={fullWidth ? '' : undefined}
      {...props}
    />
  );
});
