import * as React from 'react';
import { Table } from '../Table/Table';
import { EmptyState } from '../EmptyState/EmptyState';
import { Pagination } from '../../navigation/Pagination/Pagination';
import { Checkbox } from '../../forms/Checkbox/Checkbox';
import { Skeleton } from '../../feedback/Skeleton/Skeleton';
import { ArrowDownIcon, ArrowUpIcon } from '../../icons';
import { cx, useControllableState } from '../../utils';
import {
  columnsFromRow,
  defaultComparator,
  getPageWindow,
  groupRows,
  nextSort,
  readCell,
  sortRows,
} from './DataGrid.utils';
import '../../base.css';
import './DataGrid.css';

/** Placeholder rows rendered while `loading`. */
const SKELETON_ROW_COUNT = 3;

export interface DataGridColumn<Row> {
  /** Unique column key; also the row property read by the default renderer/sort. */
  key: string;
  /** Header content. A string header doubles as the cell label in the stacked mobile view. */
  header: React.ReactNode;
  /** Custom cell renderer. Defaults to `row[key]`. */
  render?: (row: Row) => React.ReactNode;
  /** Makes the header a button that cycles asc → desc → unsorted. */
  sortable?: boolean;
  /** Text alignment for the header and every cell in the column. */
  align?: 'left' | 'center' | 'right';
  /** Column width (any CSS length; numbers are px). */
  width?: number | string;
  /** Hides this column under 600px — optional-on-mobile columns. */
  hideOnMobile?: boolean;
}

/** Active sort: the column `key` and its direction. */
export interface DataGridSort {
  key: string;
  direction: 'asc' | 'desc';
}

export interface DataGridProps<Row> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /**
   * Column definitions. Omit to derive them dynamically from the first row's
   * keys (header = capitalized key, all sortable) — handy for API-driven data.
   */
  columns?: DataGridColumn<Row>[];
  /** The full data set; sorting, grouping and pagination are applied client-side. */
  rows: Row[];
  /** Stable row identity — used for React keys and selection. */
  getRowId: (row: Row) => string;

  /** Controlled sort state (`null` = unsorted). */
  sort?: DataGridSort | null;
  /** Initial sort for uncontrolled usage. */
  defaultSort?: DataGridSort | null;
  /** Called on every sort change (controlled and uncontrolled). */
  onSortChange?: (sort: DataGridSort | null) => void;
  /** Custom row comparator; defaults to comparing `row[key]` values with `<`. */
  sortComparator?: (a: Row, b: Row, key: string) => number;

  /** Under 600px, rows stack into labeled blocks (labels come from headers). */
  stackOnMobile?: boolean;

  /**
   * Caps the table height; rows scroll inside the grid while the column
   * header stays pinned to the top. The pagination footer sits outside the
   * scroll region.
   */
  maxHeight?: number | string;

  /**
   * Groups rows under a header row spanning every column. Groups follow the
   * current sort order and appear in order of first occurrence; header rows
   * are not counted as rows for pagination or selection.
   */
  groupBy?: (row: Row) => string;
  /** Custom group header content. Defaults to `"{key} ({count})"`. */
  renderGroupHeader?: (key: string, rows: Row[]) => React.ReactNode;

  /** Renders the selection checkbox column. */
  selectable?: boolean;
  /** Controlled selected row ids. */
  selected?: string[];
  /** Initial selected row ids for uncontrolled usage. */
  defaultSelected?: string[];
  /** Called with the next selected ids on every selection change. */
  onSelectedChange?: (selected: string[]) => void;

  /** When set, paginates client-side with an embedded Pagination footer. */
  pageSize?: number;

  /** Compact row height (forwarded to `Table.Root`). */
  dense?: boolean;
  /** Zebra striping (forwarded to `Table.Root`). */
  striped?: boolean;
  /** Replaces the rows area with skeleton rows. */
  loading?: boolean;
  /** Custom empty content; defaults to an EmptyState titled "No data". */
  emptyState?: React.ReactNode;
  /** Makes rows clickable (pointer cursor + hover wash). Checkbox clicks don't trigger it. */
  onRowClick?: (row: Row) => void;
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
    maxHeight,
    groupBy,
    renderGroupHeader,
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

  const sortedRows = React.useMemo(
    () => sortRows(rows, sort, sortComparator),
    [rows, sort, sortComparator]
  );

  const total = sortedRows.length;
  const { pageCount, currentPage, start, end } = getPageWindow(total, pageSize, page);
  const pageRows = React.useMemo(
    () => (pageSize ? sortedRows.slice(start, end) : sortedRows),
    [pageSize, sortedRows, start, end]
  );

  // Selection is tracked across every row, not just the visible page.
  const rowIds = React.useMemo(() => rows.map(getRowId), [rows, getRowId]);
  const selectedSet = React.useMemo(() => new Set(selected), [selected]);
  const selectedCount = rowIds.reduce((count, id) => (selectedSet.has(id) ? count + 1 : count), 0);
  const allSelected = rowIds.length > 0 && selectedCount === rowIds.length;

  const columns = React.useMemo(() => columnsProp ?? columnsFromRow(rows[0]), [columnsProp, rows]);
  const columnCount = columns.length + (selectable ? 1 : 0);

  // Group the visible page only: header rows never count toward pageSize.
  const groups = React.useMemo(
    () => (groupBy ? groupRows(pageRows, groupBy) : null),
    [groupBy, pageRows]
  );

  const cycleSort = (key: string) => setSort(nextSort(sort, key));

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

    const renderRow = (row: Row) => {
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
              {column.render ? column.render(row) : (readCell(row, column.key) as React.ReactNode)}
            </Table.Cell>
          ))}
        </Table.Row>
      );
    };

    if (groups) {
      return groups.map(({ key, rows: members }) => (
        <React.Fragment key={`group-${key}`}>
          <Table.Row className="zest-datagrid__group-row" data-group-key={key}>
            <th scope="rowgroup" colSpan={columnCount} className="zest-datagrid__group-cell">
              {renderGroupHeader ? renderGroupHeader(key, members) : `${key} (${members.length})`}
            </th>
          </Table.Row>
          {members.map(renderRow)}
        </React.Fragment>
      ));
    }

    return pageRows.map(renderRow);
  };

  const table = (
    // Inside a maxHeight wrapper the outer scroller owns both axes; Table's
    // own x-scroller would otherwise capture the sticky header.
    <Table.Root
      dense={dense}
      striped={striped}
      stackOnMobile={stackOnMobile}
      scrollable={maxHeight == null}
      data-sticky-header={maxHeight != null ? '' : undefined}
    >
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
  );

  return (
    <div
      ref={ref}
      className={cx('zest-datagrid', className)}
      data-loading={loading ? '' : undefined}
      {...props}
    >
      {maxHeight != null ? (
        <div className="zest-datagrid__scroll" style={{ maxHeight }}>
          {table}
        </div>
      ) : (
        table
      )}
      {pageSize && !loading && total > 0 ? (
        <div className="zest-datagrid__footer">
          <span className="zest-datagrid__range">{`${start + 1}–${end} of ${total}`}</span>
          <Pagination count={pageCount} page={currentPage} onPageChange={setPage} size="sm" />
        </div>
      ) : null}
    </div>
  );
}

// forwardRef erases generics, so the export below is cast back to a generic
// signature to keep `<Row>` inference for callers.

/**
 * Client-side data grid composing Table, Checkbox, Pagination, Skeleton, and
 * EmptyState. Sorting, selection, grouping and pagination all run in the
 * browser; sorting and selection support both controlled and uncontrolled
 * usage. `groupBy` adds header rows and `maxHeight` scrolls rows under a
 * sticky column header.
 *
 * ```tsx
 * <DataGrid
 *   columns={[{ key: 'name', header: 'Name', sortable: true }]}
 *   rows={people}
 *   getRowId={(row) => row.id}
 *   selectable
 *   pageSize={10}
 *   maxHeight={320}
 *   groupBy={(row) => row.status}
 * />
 * ```
 */
export const DataGrid = React.forwardRef(DataGridInner) as <Row>(
  props: DataGridProps<Row> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;
