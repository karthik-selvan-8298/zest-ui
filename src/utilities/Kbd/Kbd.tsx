import * as React from 'react';
import { cx } from '../../utils';
import './Kbd.css';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Shortcut text; "Ctrl+K" style strings split into separate keys. */
  children?: React.ReactNode;
}

/** Keyboard-shortcut chip — replacement for raw `<kbd>`. */
export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, children, ...props },
  ref
) {
  const parts =
    typeof children === 'string' && children.includes('+')
      ? children.split('+').map((part) => part.trim())
      : null;
  if (parts) {
    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} className={cx('zest-kbd-group', className)} {...props}>
        {parts.map((part, index) => (
          <kbd key={index} className="zest-kbd">
            {part}
          </kbd>
        ))}
      </span>
    );
  }
  return (
    <kbd ref={ref} className={cx('zest-kbd', className)} {...props}>
      {children}
    </kbd>
  );
});
