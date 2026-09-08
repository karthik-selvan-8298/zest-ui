import * as React from 'react';
import { cx } from '../../utils';
import './Kbd.css';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Shortcut text; "Ctrl+K" style strings split into separate key chips. */
  children?: React.ReactNode;
}

/**
 * Keyboard-shortcut chip — replacement for raw `<kbd>`.
 *
 * Always renders a `<kbd>` root so the ref type is stable. Combos like
 * `"Ctrl+K"` become nested `<kbd>` chips inside the root (valid HTML: a
 * `<kbd>` may contain `<kbd>` to denote a key sequence).
 *
 * ```tsx
 * <Kbd>Ctrl+K</Kbd>   // two chips
 * <Kbd>Esc</Kbd>      // one chip
 * ```
 */
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
      <kbd ref={ref} className={cx('zest-kbd-group', className)} {...props}>
        {parts.map((part, index) => (
          <kbd key={index} className="zest-kbd">
            {part}
          </kbd>
        ))}
      </kbd>
    );
  }
  return (
    <kbd ref={ref} className={cx('zest-kbd', className)} {...props}>
      {children}
    </kbd>
  );
});
