import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataGrid, type DataGridColumn } from './DataGrid';

interface Fruit {
  id: string;
  name: string;
  count: number;
  color: string;
}

const fruits: Fruit[] = [
  { id: '1', name: 'Banana', count: 12, color: 'Yellow' },
  { id: '2', name: 'Apple', count: 5, color: 'Red' },
  { id: '3', name: 'Cherry', count: 30, color: 'Red' },
  { id: '4', name: 'Date', count: 2, color: 'Brown' },
  { id: '5', name: 'Elderberry', count: 8, color: 'Purple' },
];

const columns: DataGridColumn<Fruit>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'count', header: 'Count', sortable: true, align: 'right' },
];

const getRowId = (row: Fruit) => row.id;

function bodyRowTexts(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('tbody tr')).map(
    (row) => within(row as HTMLElement).queryAllByRole('cell')[0]?.textContent ?? ''
  );
}

function groupHeaderTexts(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('.zest-datagrid__group-row th')).map(
    (cell) => cell.textContent ?? ''
  );
}

const groupByColor = (row: Fruit) => row.color;

describe('DataGrid', () => {
  it('renders a row per entry with column headers', () => {
    render(<DataGrid columns={columns} rows={fruits} getRowId={getRowId} />);
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Count' })).toBeInTheDocument();
    for (const fruit of fruits) {
      expect(screen.getByText(fruit.name)).toBeInTheDocument();
    }
    expect(document.querySelectorAll('tbody tr')).toHaveLength(5);
  });

  it('cycles sort asc → desc → none and reflects aria-sort', async () => {
    const onSortChange = vi.fn();
    const { container } = render(
      <DataGrid columns={columns} rows={fruits} getRowId={getRowId} onSortChange={onSortChange} />
    );
    const nameHeader = () => screen.getByRole('columnheader', { name: 'Name' });
    const sortButton = within(nameHeader()).getByRole('button');

    expect(nameHeader()).not.toHaveAttribute('aria-sort');

    await userEvent.click(sortButton);
    expect(nameHeader()).toHaveAttribute('aria-sort', 'ascending');
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', direction: 'asc' });
    expect(bodyRowTexts(container)[0]).toBe('Apple');

    await userEvent.click(sortButton);
    expect(nameHeader()).toHaveAttribute('aria-sort', 'descending');
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', direction: 'desc' });
    expect(bodyRowTexts(container)[0]).toBe('Elderberry');

    await userEvent.click(sortButton);
    expect(nameHeader()).not.toHaveAttribute('aria-sort');
    expect(onSortChange).toHaveBeenLastCalledWith(null);
    expect(bodyRowTexts(container)[0]).toBe('Banana');
  });

  it('sorts numeric columns with the default comparator', async () => {
    const { container } = render(<DataGrid columns={columns} rows={fruits} getRowId={getRowId} />);
    const countHeader = screen.getByRole('columnheader', { name: 'Count' });
    await userEvent.click(within(countHeader).getByRole('button'));
    expect(bodyRowTexts(container)[0]).toBe('Date'); // count 2 first
  });

  it('toggles all rows via the header checkbox', async () => {
    const onSelectedChange = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={fruits}
        getRowId={getRowId}
        selectable
        onSelectedChange={onSelectedChange}
      />
    );
    const selectAll = screen.getByRole('checkbox', { name: 'Select all rows' });

    await userEvent.click(selectAll);
    expect(onSelectedChange).toHaveBeenLastCalledWith(['1', '2', '3', '4', '5']);
    for (const box of screen.getAllByRole('checkbox')) {
      expect(box).toBeChecked();
    }

    await userEvent.click(selectAll);
    expect(onSelectedChange).toHaveBeenLastCalledWith([]);
    for (const box of screen.getAllByRole('checkbox')) {
      expect(box).not.toBeChecked();
    }
  });

  it('is indeterminate when only some rows are selected', async () => {
    render(<DataGrid columns={columns} rows={fruits} getRowId={getRowId} selectable />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select row 1' }));
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toHaveAttribute(
      'aria-checked',
      'mixed'
    );
  });

  it('applies the selected tint to selected rows', () => {
    const { container } = render(
      <DataGrid columns={columns} rows={fruits} getRowId={getRowId} selectable selected={['2']} />
    );
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[1]).toHaveAttribute('data-selected');
    expect(rows[0]).not.toHaveAttribute('data-selected');
  });

  it('paginates rows client-side when pageSize is set', async () => {
    const { container } = render(
      <DataGrid columns={columns} rows={fruits} getRowId={getRowId} pageSize={2} />
    );
    expect(bodyRowTexts(container)).toEqual(['Banana', 'Apple']);
    expect(screen.getByText('1–2 of 5')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));
    expect(bodyRowTexts(container)).toEqual(['Cherry', 'Date']);
    expect(screen.getByText('3–4 of 5')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Go to page 3' }));
    expect(bodyRowTexts(container)).toEqual(['Elderberry']);
    expect(screen.getByText('5–5 of 5')).toBeInTheDocument();
  });

  it('clamps to the last page when rows shrink below the current page', async () => {
    const { container, rerender } = render(
      <DataGrid columns={columns} rows={fruits} getRowId={getRowId} pageSize={2} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Go to page 3' }));
    expect(bodyRowTexts(container)).toEqual(['Elderberry']);

    rerender(
      <DataGrid columns={columns} rows={fruits.slice(0, 3)} getRowId={getRowId} pageSize={2} />
    );
    expect(bodyRowTexts(container)).toEqual(['Cherry']);
    expect(screen.getByText('3–3 of 3')).toBeInTheDocument();
  });

  it('derives sortable columns from the first row when columns are omitted', () => {
    render(<DataGrid rows={[{ id: 'a', first_name: 'Ada' }]} getRowId={(row) => row.id} />);
    const header = screen.getByRole('columnheader', { name: 'First name' });
    expect(within(header).getByRole('button')).toBeInTheDocument();
  });

  it('shows the default empty state when there are no rows', () => {
    render(<DataGrid columns={columns} rows={[]} getRowId={getRowId} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders a custom emptyState node', () => {
    render(
      <DataGrid columns={columns} rows={[]} getRowId={getRowId} emptyState={<p>Nothing here</p>} />
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders skeleton rows while loading', () => {
    const { container } = render(
      <DataGrid columns={columns} rows={fruits} getRowId={getRowId} loading />
    );
    expect(container.querySelectorAll('.zest-datagrid__skeleton-row').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.zest-skeleton').length).toBeGreaterThan(0);
    expect(screen.queryByText('Banana')).not.toBeInTheDocument();
  });

  it('fires onRowClick with the row, but not from the checkbox cell', async () => {
    const onRowClick = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={fruits}
        getRowId={getRowId}
        selectable
        onRowClick={onRowClick}
      />
    );
    await userEvent.click(screen.getByText('Apple'));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith(fruits[1]);

    await userEvent.click(screen.getByRole('checkbox', { name: 'Select row 1' }));
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  describe('maxHeight', () => {
    it('wraps the table in a scroll region with the given max height', () => {
      const { container } = render(
        <DataGrid columns={columns} rows={fruits} getRowId={getRowId} maxHeight={320} />
      );
      const scroll = container.querySelector('.zest-datagrid__scroll');
      expect(scroll).toBeInTheDocument();
      expect(scroll).toHaveStyle({ maxHeight: '320px' });
      expect(scroll?.querySelector('table')).toBeInTheDocument();
      // Table's own x-scroller would trap the sticky header; the wrapper owns both axes.
      expect(container.querySelector('.zest-table__scroller')).not.toBeInTheDocument();
    });

    it('accepts string heights and marks the header sticky', () => {
      const { container } = render(
        <DataGrid columns={columns} rows={fruits} getRowId={getRowId} maxHeight="50vh" />
      );
      const scroll = container.querySelector<HTMLElement>('.zest-datagrid__scroll');
      expect(scroll?.style.maxHeight).toBe('50vh');
      const table = container.querySelector('table');
      expect(table).toHaveAttribute('data-sticky-header');
      expect(
        container.querySelector('.zest-datagrid__scroll .zest-table__head .zest-table__header-cell')
      ).toBeInTheDocument();
    });

    it('keeps the pagination footer outside the scroll region', () => {
      const { container } = render(
        <DataGrid
          columns={columns}
          rows={fruits}
          getRowId={getRowId}
          maxHeight={200}
          pageSize={2}
        />
      );
      const scroll = container.querySelector('.zest-datagrid__scroll');
      const footer = container.querySelector('.zest-datagrid__footer');
      expect(footer).toBeInTheDocument();
      expect(scroll?.contains(footer)).toBe(false);
    });

    it('renders no scroll wrapper without maxHeight', () => {
      const { container } = render(
        <DataGrid columns={columns} rows={fruits} getRowId={getRowId} />
      );
      expect(container.querySelector('.zest-datagrid__scroll')).not.toBeInTheDocument();
      expect(container.querySelector('table')).not.toHaveAttribute('data-sticky-header');
    });
  });

  describe('groupBy', () => {
    it('renders one full-width header row per group in order of first occurrence', () => {
      const { container } = render(
        <DataGrid columns={columns} rows={fruits} getRowId={getRowId} groupBy={groupByColor} />
      );
      const groupRows = container.querySelectorAll('.zest-datagrid__group-row');
      expect(groupRows).toHaveLength(4);
      expect(groupHeaderTexts(container)).toEqual([
        'Yellow (1)',
        'Red (2)',
        'Brown (1)',
        'Purple (1)',
      ]);
      const cell = groupRows[0]?.querySelector('th');
      expect(cell).toHaveAttribute('scope', 'rowgroup');
      expect(cell).toHaveAttribute('colspan', '2');
      expect(groupRows[0]).toHaveAttribute('data-group-key', 'Yellow');
      // Data rows still all render, underneath their headers.
      expect(bodyRowTexts(container).filter(Boolean)).toEqual([
        'Banana',
        'Apple',
        'Cherry',
        'Date',
        'Elderberry',
      ]);
    });

    it('spans the selection column too', () => {
      const { container } = render(
        <DataGrid
          columns={columns}
          rows={fruits}
          getRowId={getRowId}
          groupBy={groupByColor}
          selectable
        />
      );
      expect(container.querySelector('.zest-datagrid__group-row th')).toHaveAttribute(
        'colspan',
        '3'
      );
    });

    it('uses renderGroupHeader when provided', () => {
      const { container } = render(
        <DataGrid
          columns={columns}
          rows={fruits}
          getRowId={getRowId}
          groupBy={groupByColor}
          renderGroupHeader={(key, rows) => <em>{`${key.toUpperCase()}:${rows.length}`}</em>}
        />
      );
      expect(groupHeaderTexts(container)).toEqual(['YELLOW:1', 'RED:2', 'BROWN:1', 'PURPLE:1']);
      expect(container.querySelector('.zest-datagrid__group-row em')).toBeInTheDocument();
    });

    it('groups in the current sort order', async () => {
      const { container } = render(
        <DataGrid
          columns={columns}
          rows={fruits}
          getRowId={getRowId}
          groupBy={groupByColor}
          defaultSort={{ key: 'name', direction: 'desc' }}
        />
      );
      // Elderberry, Date, Cherry, Banana, Apple → Purple, Brown, Red, Yellow, Red
      // Groups collapse to first occurrence but keep rows in sorted order.
      expect(groupHeaderTexts(container)).toEqual([
        'Purple (1)',
        'Brown (1)',
        'Red (2)',
        'Yellow (1)',
      ]);
      const redRow = container.querySelector('[data-group-key="Red"]');
      const next = redRow?.nextElementSibling;
      expect(next?.textContent).toContain('Cherry');
      expect(next?.nextElementSibling?.textContent).toContain('Apple');

      await userEvent.click(
        within(screen.getByRole('columnheader', { name: 'Name' })).getByRole('button')
      );
      // Cycle desc → none: back to source order.
      expect(groupHeaderTexts(container)).toEqual([
        'Yellow (1)',
        'Red (2)',
        'Brown (1)',
        'Purple (1)',
      ]);
    });

    it('does not count group headers toward pageSize and selects every row via select all', async () => {
      const onSelectedChange = vi.fn();
      const { container } = render(
        <DataGrid
          columns={columns}
          rows={fruits}
          getRowId={getRowId}
          groupBy={groupByColor}
          pageSize={2}
          selectable
          onSelectedChange={onSelectedChange}
        />
      );
      // Page 1 = Banana, Apple → two groups, two data rows.
      expect(container.querySelectorAll('.zest-datagrid__group-row')).toHaveLength(2);
      expect(screen.getByText('Banana')).toBeInTheDocument();
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.queryByText('Cherry')).not.toBeInTheDocument();
      expect(screen.getByText('1–2 of 5')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
      expect(onSelectedChange).toHaveBeenLastCalledWith(['1', '2', '3', '4', '5']);
    });

    it('composes with maxHeight — group rows scroll inside the region', () => {
      const { container } = render(
        <DataGrid
          columns={columns}
          rows={fruits}
          getRowId={getRowId}
          groupBy={groupByColor}
          maxHeight={240}
        />
      );
      const scroll = container.querySelector('.zest-datagrid__scroll');
      expect(scroll?.querySelectorAll('.zest-datagrid__group-row')).toHaveLength(4);
      expect(scroll?.querySelector('thead')).toBeInTheDocument();
    });

    it('shows the empty state instead of group rows when there is no data', () => {
      const { container } = render(
        <DataGrid columns={columns} rows={[]} getRowId={getRowId} groupBy={groupByColor} />
      );
      expect(container.querySelectorAll('.zest-datagrid__group-row')).toHaveLength(0);
      expect(screen.getByText('No data')).toBeInTheDocument();
    });
  });
});
