import * as React from 'react';
import { cx } from '../../utils';
import type { ZestColor } from '../../types';
import '../../base.css';
import './IconTile.css';

export interface IconTileProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Tone of the tile. `gradient` is the brand/hero emphasis style. */
  color?: ZestColor | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children?: React.ReactNode;
}

/**
 * Rounded-square icon container used before titles, nav items, and rows —
 * the QA dashboard tile style.
 *
 * ```tsx
 * <IconTile color="primary"><SettingsIcon /></IconTile>
 * <IconTile color="gradient" size="xl"><ZapIcon /></IconTile>
 * ```
 */
export const IconTile = React.forwardRef<HTMLSpanElement, IconTileProps>(function IconTile(
  { color = 'primary', size = 'md', className, children, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      aria-hidden
      className={cx('zest-icon-tile', className)}
      data-accent={color === 'gradient' ? 'primary' : color}
      data-tone={color === 'gradient' ? 'gradient' : 'soft'}
      data-size={size}
      {...props}
    >
      {children}
    </span>
  );
});
