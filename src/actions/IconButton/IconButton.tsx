import * as React from 'react';
import { cx, spawnRipple } from '../../utils';
import type { ZestColor, ZestSize } from '../../types';
import '../../base.css';
import './IconButton.css';

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** Accessible name — required, icon-only buttons have no visible label. */
  'aria-label': string;
  variant?: 'solid' | 'outlined' | 'ghost' | 'soft';
  color?: ZestColor;
  size?: ZestSize;
  /** Rounded square (default, the Sigma/QA dashboard style) or circle. */
  shape?: 'square' | 'round';
  disabled?: boolean;
  children?: React.ReactNode;
}

/** Square icon-only button. Requires `aria-label`. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      variant = 'ghost',
      color = 'neutral',
      size = 'md',
      shape = 'square',
      className,
      type,
      children,
      onPointerDown,
      disabled,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        disabled={disabled}
        onPointerDown={(event) => {
          if (!disabled) spawnRipple(event.currentTarget, event);
          onPointerDown?.(event);
        }}
        className={cx('zest-icon-button', 'zest-focusable', 'zest-ripple-host', className)}
        data-variant={variant}
        data-accent={color}
        data-size={size}
        data-shape={shape}
        {...props}
      >
        {children}
      </button>
    );
  }
);
