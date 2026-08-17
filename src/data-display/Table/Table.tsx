import * as React from 'react';
import { cx } from '../../utils';
import './Table.css';

/*
 * Composable semantic table with Sigma styling.
 *
 * <Table.Root>
 *   <Table.Head>
 *     <Table.Row><Table.HeaderCell>Name</Table.HeaderCell>…</Table.Row>
 *   </Table.Head>
 *   <Table.Body>
 *     <Table.Row hover><Table.Cell>…</Table.Cell></Table.Row>
 *   </Table.Body>
 * </Table.Root>
 */

export interface TableRootProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Compact row height. */
  dense?: boolean;
  /** Zebra striping. */
  striped?: boolean;
  /** Wraps the table in a horizontally scrollable container. */
  scrollable?: boolean;
  /**
   * Under 600px, rows stack into labeled blocks instead of scrolling
   * horizontally. Give each Cell a `label` (its column name) for the
   * stacked view.
   */
  stackOnMobile?: boolean;
}

const TableRoot = React.forwardRef<HTMLTableElement, TableRootProps>(function TableRoot(
  { dense, striped, scrollable = true, stackOnMobile, className, ...props },
  ref
) {
  const table = (
    <table
      ref={ref}
      className={cx('zest-table', className)}
      data-dense={dense ? '' : undefined}
      data-striped={striped ? '' : undefined}
      data-stack-mobile={stackOnMobile ? '' : undefined}
      {...props}
    />
  );
  if (!scrollable) return table;
  return <div className="zest-table__scroller">{table}</div>;
});

const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableHead({ className, ...props }, ref) {
  return <thead ref={ref} className={cx('zest-table__head', className)} {...props} />;
});

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableBody({ className, ...props }, ref) {
  return <tbody ref={ref} className={cx('zest-table__body', className)} {...props} />;
});

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Hover highlight (rows that lead somewhere). */
  hover?: boolean;
  /** Selected state. */
  selected?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { hover, selected, className, ...props },
  ref
) {
  return (
    <tr
      ref={ref}
      className={cx('zest-table__row', className)}
      data-hover={hover ? '' : undefined}
      data-selected={selected ? '' : undefined}
      aria-selected={selected || undefined}
      {...props}
    />
  );
});

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
  /** Column name shown before the value in the mobile stacked view. */
  label?: string;
  /** Hides this cell under 600px — for columns that are optional on mobile. */
  hideOnMobile?: boolean;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { align, label, hideOnMobile, className, style, ...props },
  ref
) {
  // Merge, don't overwrite: without this the caller's `style` was dropped
  // whenever `align` was set.
  const mergedStyle = align ? { textAlign: align, ...style } : style;
  return (
    <td
      ref={ref}
      className={cx('zest-table__cell', className)}
      data-label={label}
      data-hide-mobile={hideOnMobile ? '' : undefined}
      style={mergedStyle}
      {...props}
    />
  );
});

export interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
  /** Hides this header (and its column) under 600px. */
  hideOnMobile?: boolean;
}

const TableHeaderCell = React.forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  function TableHeaderCell({ align, hideOnMobile, className, scope, style, ...props }, ref) {
    const mergedStyle = align ? { textAlign: align, ...style } : style;
    return (
      <th
        ref={ref}
        scope={scope ?? 'col'}
        className={cx('zest-table__header-cell', className)}
        data-hide-mobile={hideOnMobile ? '' : undefined}
        style={mergedStyle}
        {...props}
      />
    );
  }
);

export const Table = {
  Root: TableRoot,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  HeaderCell: TableHeaderCell,
};
