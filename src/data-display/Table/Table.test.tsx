import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import type * as React from 'react';
import { Table } from './Table';

function renderTable(props: React.ComponentProps<typeof Table.Root> = {}) {
  return render(
    <Table.Root {...props}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell align="right">Count</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row hover selected>
          <Table.Cell label="Name">Apple</Table.Cell>
          <Table.Cell label="Count" align="right" style={{ color: 'red' }} hideOnMobile>
            5
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

describe('Table', () => {
  it('renders semantic table parts with column-scoped headers', () => {
    renderTable();
    expect(screen.getByRole('table')).toHaveClass('zest-table');
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('scope', 'col');
    expect(screen.getByRole('columnheader', { name: 'Count' })).toHaveStyle({
      textAlign: 'right',
    });
  });

  it('wraps in a scroller by default and not when scrollable={false}', () => {
    const { container, unmount } = renderTable();
    expect(container.querySelector('.zest-table__scroller > table')).toBeInTheDocument();
    unmount();
    const second = renderTable({ scrollable: false });
    expect(second.container.querySelector('.zest-table__scroller')).not.toBeInTheDocument();
  });

  it('stamps root, row and cell data attributes and merges cell style with align', () => {
    renderTable({ dense: true, striped: true, stackOnMobile: true });
    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('data-dense');
    expect(table).toHaveAttribute('data-striped');
    expect(table).toHaveAttribute('data-stack-mobile');

    const row = screen.getByText('Apple').closest('tr');
    expect(row).toHaveAttribute('data-hover');
    expect(row).toHaveAttribute('data-selected');
    expect(row).toHaveAttribute('aria-selected', 'true');

    const count = screen.getByText('5');
    expect(count).toHaveAttribute('data-label', 'Count');
    expect(count).toHaveAttribute('data-hide-mobile');
    expect(count).toHaveStyle({ textAlign: 'right', color: 'rgb(255, 0, 0)' });
  });

  it('has no axe violations', async () => {
    const { container } = renderTable();
    expect((await axe(container)).violations).toEqual([]);
  });
});
