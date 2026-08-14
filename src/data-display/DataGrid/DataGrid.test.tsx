import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataGrid, type DataGridColumn } from './DataGrid';

interface Fruit {
  id: string;
  name: string;
  count: number;
}

const fruits: Fruit[] = [
  { id: '1', name: 'Banana', count: 12 },
  { id: '2', name: 'Apple', count: 5 },
  { id: '3', name: 'Cherry', count: 30 },
  { id: '4', name: 'Date', count: 2 },
  { id: '5', name: 'Elderberry', count: 8 },
];

const columns: DataGridColumn<Fruit>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'count', header: 'Count', sortable: true, align: 'right' },
];

const getRowId = (row: Fruit) => row.id;

function bodyRowTexts(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('tbody tr')).map(
    (row) => within(row as HTMLElement).getAllByRole('cell')[0]?.textContent ?? ''
  );
}

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
    const { container } = render(
      <DataGrid columns={columns} rows={fruits} getRowId={getRowId} />
    );
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
});
