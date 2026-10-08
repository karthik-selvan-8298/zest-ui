import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';
import { cx, useControllableState } from '../../utils';
import '../../base.css';
import './Pagination.css';

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Total number of pages. */
  count: number;
  /** Controlled current page (1-based). */
  page?: number;
  /** Initial page for uncontrolled usage. */
  defaultPage?: number;
  /** Called with the next page on every change. */
  onPageChange?: (page: number) => void;
  /** Pages shown on each side of the current page. Defaults to `1`. */
  siblingCount?: number;
  /** Pages always shown at the start and end. Defaults to `1`. */
  boundaryCount?: number;
  /** `md` (default) = 32px items; `sm` = 26px. */
  size?: 'sm' | 'md';
  /** Disables every button, including prev/next. */
  disabled?: boolean;
}

/** A page number, or an ellipsis standing in for a hidden run of pages. */
type PaginationEntry = number | 'start-ellipsis' | 'end-ellipsis';

function range(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i += 1) result.push(i);
  return result;
}

/**
 * Builds the visible sequence, e.g. `[1, 'start-ellipsis', 9, 10, 11, 'end-ellipsis', 20]`.
 * The item count stays constant as `page` moves (MUI's `usePagination`
 * algorithm): an ellipsis that would hide a single page shows that page instead.
 */
function buildEntries(
  count: number,
  page: number,
  siblingCount: number,
  boundaryCount: number
): PaginationEntry[] {
  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    count - boundaryCount - 1
  );

  return [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? (['start-ellipsis'] as const)
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < count - boundaryCount - 1
      ? (['end-ellipsis'] as const)
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),
    ...endPages,
  ];
}

/**
 * Numbered page buttons with prev/next arrows and sibling/boundary ellipses.
 *
 * ```tsx
 * <Pagination count={20} defaultPage={1} onPageChange={(page) => load(page)} />
 * <Pagination count={20} page={page} onPageChange={setPage} siblingCount={2} size="sm" />
 * ```
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    count,
    page: pageProp,
    defaultPage = 1,
    onPageChange,
    siblingCount = 1,
    boundaryCount = 1,
    size = 'md',
    disabled = false,
    className,
    ...props
  },
  ref
) {
  const [page, setPage] = useControllableState<number>({
    value: pageProp,
    defaultValue: defaultPage,
    onChange: onPageChange,
  });

  const entries = buildEntries(count, page, siblingCount, boundaryCount);

  return (
    <nav
      ref={ref}
      aria-label="pagination navigation"
      className={cx('zest-pagination', className)}
      data-size={size}
      {...props}
    >
      <ul className="zest-pagination__list">
        <li>
          <button
            type="button"
            className="zest-pagination__item zest-focusable"
            aria-label="Go to previous page"
            disabled={disabled || page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeftIcon />
          </button>
        </li>
        {entries.map((entry, index) => (
          <li key={typeof entry === 'number' ? entry : `${entry}-${index}`}>
            {typeof entry === 'number' ? (
              <button
                type="button"
                className="zest-pagination__item zest-focusable"
                aria-label={entry === page ? `Page ${entry}` : `Go to page ${entry}`}
                aria-current={entry === page ? 'page' : undefined}
                data-current={entry === page ? '' : undefined}
                disabled={disabled}
                onClick={() => setPage(entry)}
              >
                {entry}
              </button>
            ) : (
              <span className="zest-pagination__ellipsis" aria-hidden>
                …
              </span>
            )}
          </li>
        ))}
        <li>
          <button
            type="button"
            className="zest-pagination__item zest-focusable"
            aria-label="Go to next page"
            disabled={disabled || page >= count}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRightIcon />
          </button>
        </li>
      </ul>
    </nav>
  );
});
