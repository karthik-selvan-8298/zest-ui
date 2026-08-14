import * as React from 'react';
import { Table } from '../Table/Table';
import { EmptyState } from '../EmptyState/EmptyState';
import { Pagination } from '../../navigation/Pagination/Pagination';
import { Checkbox } from '../../forms/Checkbox/Checkbox';
import { Skeleton } from '../../feedback/Skeleton/Skeleton';
import { ArrowDownIcon, ArrowUpIcon } from '../../icons';
import { cx, useControllableState } from '../../utils';
import '../../base.css';
import './DataGrid.css';

/*
 * DataGrid — client-side data grid on top of the Table parts.
 * Sorting, row selection, and pagination all run in the browser.
 *
 * <DataGrid
 *   columns={[{ key: 'name', header: 'Name', sortable: true }]}
 *   rows={people}
 *   getRowId={(row) => row.id}
 *   selectable
 *   pageSize={10}
 * />
 */


const SKELETON_ROW_COUNT = 3;

export interface DataGridColumn<Row> {
  /** Unique column key; also the row property read by the default renderer/sort. */
  key: string;
  header: React.ReactNode;
  /** Custom cell renderer. Defaults to `row[key]`. */
  render?: (row: Row) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  /** Hides this column under 600px — optional-on-mobile columns. */
  hideOnMobile?: boolean;
}

export interface DataGridSort {
  key: string;
  direction: 'asc' | 'desc';
}

export interface DataGridProps<Row>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /**
   * Column definitions. Omit to derive them dynamically from the first row's
   * keys (header = capitalized key, all sortable) — handy for API-driven data.
   */
  columns?: DataGridColumn<Row>[];
  rows: Row[];
  /** Stable row identity — used for React keys and selection. */
  getRowId: (row: Row) => string;

  /** Controlled sort state (`null` = unsorted). */
  sort?: DataGridSort | null;
  /** Initial sort for uncontrolled usage. */
  defaultSort?: DataGridSort | null;
  onSortChange?: (sort: DataGridSort | null) => void;
  /** Custom row comparator; defaults to comparing `row[key]` values with `<`. */
  sortComparator?: (a: Row, b: Row, key: string) => number;

  /** Under 600px, rows stack into labeled blocks (labels come from headers). */
  stackOnMobile?: boolean;

  /** Renders the selection checkbox column. */
  selectable?: boolean;
  /** Controlled selected row ids. */
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (selected: string[]) => void;

  /** When set, paginates client-side with an embedded Pagination footer. */
  pageSize?: number;

  dense?: boolean;
  striped?: boolean;
  /** Replaces the rows area with skeleton rows. */
  loading?: boolean;
  /** Custom empty content; defaults to an EmptyState titled "No data". */
  emptyState?: React.ReactNode;
  onRowClick?: (row: Row) => void;
}

function defaultComparator<Row>(a: Row, b: Row, key: string): number {
  const va = (a as Record<string, unknown>)[key];
  const vb = (b as Record<string, unknown>)[key];
  if (va == null && vb == null) return 0;
  if (va == null) return -1;
  if (vb == null) return 1;
  // Relational compare works for both numbers and strings at runtime.
  const left = va as number;
  const right = vb as number;
  return left < right ? -1 : left > right ? 1 : 0;
}

function DataGridInner<Row>(
  {
    columns: columnsProp,
    rows,
    getRowId,
    sort: sortProp,
    defaultSort = null,
    onSortChange,
    sortComparator = defaultComparator,
    stackOnMobile = false,
    selectable = false,
    selected: selectedProp,
    defaultSelected,
    onSelectedChange,
    pageSize,
    dense,
    striped,
    loading = false,
    emptyState,
    onRowClick,
    className,
    ...props
  }: DataGridProps<Row>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const [sort, setSort] = useControllableState<DataGridSort | null>({
    value: sortProp,
    defaultValue: defaultSort,
    onChange: onSortChange,
  });
  const [selected, setSelected] = useControllableState<string[]>({
    value: selectedProp,
    defaultValue: defaultSelected ?? [],
    onChange: onSelectedChange,
  });
  const [page, setPage] = React.useState(1);

  const sortedRows = React.useMemo(() => {
    if (!sort) return rows;
    const factor = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => factor * sortComparator(a, b, sort.key));
  }, [rows, sort, sortComparator]);

  const total = sortedRows.length;
  const pageCount = pageSize ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const currentPage = Math.min(page, pageCount);
  const pageRows = pageSize
    ? sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedRows;

  const rowIds = React.useMemo(() => rows.map(getRowId), [rows, getRowId]);
  const selectedSet = React.useMemo(() => new Set(selected), [selected]);
  const selectedCount = rowIds.reduce((count, id) => (selectedSet.has(id) ? count + 1 : count), 0);
  const allSelected = rowIds.length > 0 && selectedCount === rowIds.length;
  const columns = React.useMemo<DataGridColumn<Row>[]>(() => {
    if (columnsProp) return columnsProp;
    const first = rows[0];
    if (!first) return [];
    return Object.keys(first as object).map((key) => ({
      key,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/[_-]/g, ' '),
      sortable: true,
    }));
  }, [columnsProp, rows]);

  const columnCount = columns.length + (selectable ? 1 : 0);

  const cycleSort = (key: string) => {
    if (!sort || sort.key !== key) setSort({ key, direction: 'asc' });
    else if (sort.direction === 'asc') setSort({ key, direction: 'desc' });
    else setSort(null);
  };

  const toggleRow = (id: string, checked: boolean) => {
    setSelected(checked ? [...selected, id] : selected.filter((other) => other !== id));
  };

  const renderBody = () => {
    if (loading) {
      return Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <Table.Row key={`skeleton-${index}`} className="zest-datagrid__skeleton-row">
          {selectable ? (
            <Table.Cell className="zest-datagrid__checkbox-cell">
              <Skeleton variant="rounded" width={18} height={18} />
            </Table.Cell>
          ) : null}
          {columns.map((column) => (
            <Table.Cell key={column.key} align={column.align}>
              <Skeleton />
            </Table.Cell>
          ))}
        </Table.Row>
      ));
    }

    if (total === 0) {
      return (
        <Table.Row>
          <Table.Cell colSpan={columnCount} className="zest-datagrid__empty-cell">
            {emptyState ?? <EmptyState title="No data" size="sm" />}
          </Table.Cell>
        </Table.Row>
      );
    }

    return pageRows.map((row) => {
      const id = getRowId(row);
      const isSelected = selectedSet.has(id);
      return (
        <Table.Row
          key={id}
          hover={Boolean(onRowClick)}
          selected={selectable ? isSelected : undefined}
          data-clickable={onRowClick ? '' : undefined}
          onClick={onRowClick ? () => onRowClick(row) : undefined}
        >
          {selectable ? (
            <Table.Cell
              className="zest-datagrid__checkbox-cell"
              onClick={(event) => event.stopPropagation()}
            >
              <Checkbox
                size="sm"
                aria-label={`Select row ${id}`}
                checked={isSelected}
                onCheckedChange={(checked) => toggleRow(id, checked)}
              />
            </Table.Cell>
          ) : null}
          {columns.map((column) => (
            <Table.Cell
              key={column.key}
              align={column.align}
              hideOnMobile={column.hideOnMobile}
              label={typeof column.header === 'string' ? column.header : undefined}
            >
              {column.render
                ? column.render(row)
                : ((row as Record<string, unknown>)[column.key] as React.ReactNode)}
            </Table.Cell>
          ))}
        </Table.Row>
      );
    });
  };

  const rangeStart = pageSize ? (currentPage - 1) * pageSize + 1 : 1;
  const rangeEnd = pageSize ? Math.min(currentPage * pageSize, total) : total;

  return (
    <div
      ref={ref}
      className={cx('zest-datagrid', className)}
      data-loading={loading ? '' : undefined}
      {...props}
    >
      <Table.Root dense={dense} striped={striped} stackOnMobile={stackOnMobile}>
        <Table.Head>
          <Table.Row>
            {selectable ? (
              <Table.HeaderCell className="zest-datagrid__checkbox-cell">
                <Checkbox
                  size="sm"
                  aria-label="Select all rows"
                  checked={allSelected}
                  indeterminate={selectedCount > 0 && !allSelected}
                  disabled={loading || rowIds.length === 0}
                  onCheckedChange={() => setSelected(allSelected ? [] : rowIds)}
                />
              </Table.HeaderCell>
            ) : null}
            {columns.map((column) => {
              const direction = sort && sort.key === column.key ? sort.direction : undefined;
              return (
                <Table.HeaderCell
                  key={column.key}
                  hideOnMobile={column.hideOnMobile}
                  aria-sort={
                    direction ? (direction === 'asc' ? 'ascending' : 'descending') : undefined
                  }
                  className={column.sortable ? 'zest-datagrid__sortable-header' : undefined}
                  style={{ width: column.width, textAlign: column.align }}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="zest-datagrid__sort-button zest-focusable"
                      data-align={column.align}
                      data-sorted={direction}
                      onClick={() => cycleSort(column.key)}
                    >
                      <span className="zest-datagrid__sort-label">{column.header}</span>
                      {direction ? (
                        <span className="zest-datagrid__sort-icon" aria-hidden>
                          {direction === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        </span>
                      ) : null}
                    </button>
                  ) : (
                    column.header
                  )}
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
        </Table.Head>
        <Table.Body>{renderBody()}</Table.Body>
      </Table.Root>
      {pageSize && !loading && total > 0 ? (
        <div className="zest-datagrid__footer">
          <span className="zest-datagrid__range">{`${rangeStart}–${rangeEnd} of ${total}`}</span>
          <Pagination count={pageCount} page={currentPage} onPageChange={setPage} size="sm" />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Client-side data grid composing Table, Checkbox, Pagination, Skeleton, and
 * EmptyState. Sorting and selection support both controlled and uncontrolled
 * usage.
 */
export const DataGrid = React.forwardRef(DataGridInner) as <Row>(
  props: DataGridProps<Row> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;
