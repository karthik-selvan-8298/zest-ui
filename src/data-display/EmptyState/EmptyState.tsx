import * as React from 'react';
import { ErrorCircleIcon, InboxIcon } from '../../icons';
import { Spinner } from '../../feedback/Spinner/Spinner';
import { cx } from '../../utils';
import '../../base.css';
import './EmptyState.css';

export type EmptyStateState = 'empty' | 'loading' | 'error';

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Icon shown in a soft circle. Defaults per `state`: InboxIcon, a Spinner,
   * or ErrorCircleIcon. `null` hides the slot.
   */
  icon?: React.ReactNode | null;
  /** Headline. Optional only for `state="loading"`, which falls back to "Loading…". */
  title?: React.ReactNode;
  /** Supporting copy under the title. */
  description?: React.ReactNode;
  /** Call to action (e.g. a Button, or a Retry button in the error state). Hidden while loading. */
  action?: React.ReactNode;
  /** `'md'` for page sections, `'sm'` for compact panels. @default 'md' */
  size?: 'sm' | 'md';
  /**
   * `'loading'` renders a Spinner with `role="status"` + `aria-busy`;
   * `'error'` renders ErrorCircleIcon in the error tone with `role="alert"`.
   * @default 'empty'
   */
  state?: EmptyStateState;
}

/** Per-state icon used when `icon` is omitted. */
const defaultIcon = (state: EmptyStateState, size: 'sm' | 'md') => {
  if (state === 'loading') return <Spinner size={size === 'sm' ? 'md' : 'lg'} />;
  if (state === 'error') return <ErrorCircleIcon />;
  return <InboxIcon />;
};

/**
 * The standard "nothing here yet" block for tables and lists. `state`
 * switches it into a loading or error placeholder with matching semantics,
 * so one slot covers the whole async lifecycle.
 *
 * ```tsx
 * <EmptyState
 *   title="No projects yet"
 *   description="Create your first project to get started."
 *   action={<Button startIcon={<PlusIcon />}>New project</Button>}
 * />
 * <EmptyState state="loading" />
 * <EmptyState state="error" title="Couldn't load" action={<Button>Retry</Button>} />
 * ```
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, action, size = 'md', state = 'empty', className, ...props },
  ref
) {
  const isLoading = state === 'loading';
  const isError = state === 'error';
  const resolvedTitle = title ?? (isLoading ? 'Loading…' : undefined);
  return (
    <div
      ref={ref}
      className={cx('zest-empty-state', className)}
      data-size={size}
      data-state={state}
      role={isLoading ? 'status' : isError ? 'alert' : undefined}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {icon === null ? null : (
        <span
          className="zest-empty-state__icon"
          data-accent={isError ? 'error' : undefined}
          aria-hidden
        >
          {icon ?? defaultIcon(state, size)}
        </span>
      )}
      {resolvedTitle !== undefined ? (
        <div className="zest-empty-state__title">{resolvedTitle}</div>
      ) : null}
      {description ? <div className="zest-empty-state__description">{description}</div> : null}
      {action && !isLoading ? <div className="zest-empty-state__action">{action}</div> : null}
    </div>
  );
});
