import * as React from 'react';
import { cx } from '../../utils';
import './AppBar.css';

export interface AppBarProps extends React.HTMLAttributes<HTMLElement> {
  /** Sticks to the top with a translucent blur while content scrolls under it. */
  sticky?: boolean;
  /** Leading slot (menu button, breadcrumbs, title). */
  start?: React.ReactNode;
  /** Centered slot (search, tabs). */
  center?: React.ReactNode;
  /** Trailing slot (actions, avatar). */
  end?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Top application bar — replacement for a raw `<header>`.
 *
 * ```tsx
 * <AppBar sticky start={<Breadcrumbs items={crumbs} />} end={<Avatar name="KA" />} />
 * ```
 */
export const AppBar = React.forwardRef<HTMLElement, AppBarProps>(function AppBar(
  { sticky = true, start, center, end, className, children, ...props },
  ref
) {
  return (
    <header
      ref={ref}
      className={cx('zest-app-bar', className)}
      data-sticky={sticky ? '' : undefined}
      {...props}
    >
      {start ? <div className="zest-app-bar__start">{start}</div> : null}
      {center ? <div className="zest-app-bar__center">{center}</div> : null}
      {children}
      {end ? <div className="zest-app-bar__end">{end}</div> : null}
    </header>
  );
});
