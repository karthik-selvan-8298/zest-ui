import * as React from 'react';
import { cx } from '../../utils';
import './DetailHeader.css';

export interface DetailHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Page title. */
  title: React.ReactNode;
  /** Small line under the title (status, meta). */
  subtitle?: React.ReactNode;
  /** Breadcrumbs (or any leading nav) rendered above the title. */
  breadcrumbs?: React.ReactNode;
  /** End-aligned actions (buttons, menus). */
  actions?: React.ReactNode;
  /** Leading visual (avatar, icon). */
  media?: React.ReactNode;
}

/** Standard page/detail header with breadcrumbs, title, and actions. */
export const DetailHeader = React.forwardRef<HTMLElement, DetailHeaderProps>(
  function DetailHeader(
    { title, subtitle, breadcrumbs, actions, media, className, ...props },
    ref
  ) {
    return (
      <header ref={ref} className={cx('zest-detail-header', className)} {...props}>
        {breadcrumbs ? <div className="zest-detail-header__breadcrumbs">{breadcrumbs}</div> : null}
        <div className="zest-detail-header__row">
          {media ? <div className="zest-detail-header__media">{media}</div> : null}
          <div className="zest-detail-header__heading">
            <h1 className="zest-detail-header__title">{title}</h1>
            {subtitle ? <div className="zest-detail-header__subtitle">{subtitle}</div> : null}
          </div>
          {actions ? <div className="zest-detail-header__actions">{actions}</div> : null}
        </div>
      </header>
    );
  }
);
