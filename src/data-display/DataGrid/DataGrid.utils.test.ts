import { describe, expect, it } from 'vitest';
import {
  columnsFromRow,
  defaultComparator,
  getPageWindow,
  groupRows,
  nextSort,
  sortRows,
} from './DataGrid.utils';

describe('DataGrid utils', () => {
  it('defaultComparator orders numbers, strings, and nullish values first', () => {
    expect(defaultComparator({ v: 1 }, { v: 2 }, 'v')).toBe(-1);
    expect(defaultComparator({ v: 'b' }, { v: 'a' }, 'v')).toBe(1);
    expect(defaultComparator({ v: null }, { v: 0 }, 'v')).toBe(-1);
    expect(defaultComparator({}, {}, 'v')).toBe(0);
  });

  it('sortRows returns the input untouched when unsorted and a sorted copy otherwise', () => {
    const rows = [{ v: 2 }, { v: 1 }, { v: 3 }];
    expect(sortRows(rows, null, defaultComparator)).toBe(rows);
    const desc = sortRows(rows, { key: 'v', direction: 'desc' }, defaultComparator);
    expect(desc.map((row) => row.v)).toEqual([3, 2, 1]);
    expect(rows.map((row) => row.v)).toEqual([2, 1, 3]);
  });

  it('nextSort cycles asc → desc → none and restarts on a new column', () => {
    expect(nextSort(null, 'a')).toEqual({ key: 'a', direction: 'asc' });
    expect(nextSort({ key: 'a', direction: 'asc' }, 'a')).toEqual({ key: 'a', direction: 'desc' });
    expect(nextSort({ key: 'a', direction: 'desc' }, 'a')).toBeNull();
    expect(nextSort({ key: 'a', direction: 'desc' }, 'b')).toEqual({ key: 'b', direction: 'asc' });
  });

  it('getPageWindow clamps the page and handles empty data and no pageSize', () => {
    expect(getPageWindow(5, 2, 2)).toEqual({ pageCount: 3, currentPage: 2, start: 2, end: 4 });
    expect(getPageWindow(5, 2, 9)).toEqual({ pageCount: 3, currentPage: 3, start: 4, end: 5 });
    expect(getPageWindow(0, 2, 3)).toEqual({ pageCount: 1, currentPage: 1, start: 0, end: 0 });
    expect(getPageWindow(5, undefined, 4)).toEqual({
      pageCount: 1,
      currentPage: 1,
      start: 0,
      end: 5,
    });
  });

  it('groupRows keeps first-occurrence group order and row order', () => {
    const rows = [
      { id: 1, g: 'b' },
      { id: 2, g: 'a' },
      { id: 3, g: 'b' },
    ];
    expect(groupRows(rows, (row) => row.g)).toEqual([
      { key: 'b', rows: [rows[0], rows[2]] },
      { key: 'a', rows: [rows[1]] },
    ]);
  });

  it('columnsFromRow humanises keys and returns [] without a row', () => {
    expect(columnsFromRow(undefined)).toEqual([]);
    expect(columnsFromRow({ first_name: 'Ada', 'last-name': 'L' })).toEqual([
      { key: 'first_name', header: 'First name', sortable: true },
      { key: 'last-name', header: 'Last name', sortable: true },
    ]);
  });
});
