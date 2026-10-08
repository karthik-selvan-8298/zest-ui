import type { DataGridColumn, DataGridSort } from './DataGrid';

/*
 * Pure, render-free helpers behind DataGrid: sorting, pagination maths,
 * grouping, and column derivation. Kept out of the component so the render
 * function reads as layout, and so each step is testable on its own.
 */

/** Reads `row[key]` from an arbitrary row shape. */
export function readCell<Row>(row: Row, key: string): unknown {
  return (row as Record<string, unknown>)[key];
}

/**
 * Default sort comparator: compares `row[key]` with `<` / `>`, which works
 * for both numbers and strings at runtime. `null`/`undefined` sort first.
 */
export function defaultComparator<Row>(a: Row, b: Row, key: string): number {
  const va = readCell(a, key);
  const vb = readCell(b, key);
  if (va == null && vb == null) return 0;
  if (va == null) return -1;
  if (vb == null) return 1;
  // Relational compare works for both numbers and strings at runtime.
  const left = va as number;
  const right = vb as number;
  return left < right ? -1 : left > right ? 1 : 0;
}

/** Returns a sorted copy of `rows` (or `rows` itself when unsorted). */
export function sortRows<Row>(
  rows: Row[],
  sort: DataGridSort | null,
  comparator: (a: Row, b: Row, key: string) => number
): Row[] {
  if (!sort) return rows;
  const factor = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => factor * comparator(a, b, sort.key));
}

/** Header click cycle for one column: unsorted → asc → desc → unsorted. */
export function nextSort(current: DataGridSort | null, key: string): DataGridSort | null {
  if (!current || current.key !== key) return { key, direction: 'asc' };
  if (current.direction === 'asc') return { key, direction: 'desc' };
  return null;
}

export interface PageWindow {
  /** Total page count (always ≥ 1). */
  pageCount: number;
  /** The requested page clamped into `1..pageCount`. */
  currentPage: number;
  /** Slice bounds into the sorted rows: `[start, end)`. */
  start: number;
  end: number;
}

/**
 * Pagination maths. Without a `pageSize` everything is one page. The page is
 * clamped (not stored) so a page index that falls out of range after `rows`
 * shrinks still renders the last real page.
 */
export function getPageWindow(
  total: number,
  pageSize: number | undefined,
  page: number
): PageWindow {
  if (!pageSize) return { pageCount: 1, currentPage: 1, start: 0, end: total };
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  return { pageCount, currentPage, start, end: Math.min(start + pageSize, total) };
}

/** Buckets rows by `groupBy`, keeping row order and first-occurrence group order. */
export function groupRows<Row>(
  rows: Row[],
  groupBy: (row: Row) => string
): { key: string; rows: Row[] }[] {
  const map = new Map<string, Row[]>();
  for (const row of rows) {
    const key = groupBy(row);
    const bucket = map.get(key);
    if (bucket) bucket.push(row);
    else map.set(key, [row]);
  }
  return Array.from(map, ([key, bucketRows]) => ({ key, rows: bucketRows }));
}

/**
 * Columns derived from a row's own keys (used when `columns` is omitted):
 * header = key with the first letter capitalised and `_`/`-` as spaces;
 * every column sortable.
 */
export function columnsFromRow<Row>(row: Row | undefined): DataGridColumn<Row>[] {
  if (!row) return [];
  return Object.keys(row as object).map((key) => ({
    key,
    header: key.charAt(0).toUpperCase() + key.slice(1).replace(/[_-]/g, ' '),
    sortable: true,
  }));
}
