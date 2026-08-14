import * as React from 'react';
import { InboxIcon } from '../../icons';
import { cx } from '../../utils';
import '../../base.css';
import './EmptyState.css';

/*
 * EmptyState — the standard "nothing here yet" block for tables and lists.
 *
 * <EmptyState
 *   title="No projects yet"
 *   description="Create your first project to get started."
 *   action={<Button startIcon={<PlusIcon />}>New project</Button>}
 * />
 */

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Icon shown in a soft neutral circle; defaults to InboxIcon. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Call to action (e.g. a Button). */
  action?: React.ReactNode;
  size?: 'sm' | 'md';
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, action, size = 'md', className, ...props },
  ref
) {
  return (
    <div ref={ref} className={cx('zest-empty-state', className)} data-size={size} {...props}>
      <span className="zest-empty-state__icon" aria-hidden>
        {icon ?? <InboxIcon />}
      </span>
      <div className="zest-empty-state__title">{title}</div>
      {description ? <div className="zest-empty-state__description">{description}</div> : null}
      {action ? <div className="zest-empty-state__action">{action}</div> : null}
    </div>
  );
});
