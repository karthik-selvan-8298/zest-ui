import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchToolbar } from './SearchToolbar';

describe('SearchToolbar', () => {
  it('reports typed values through onValueChange', async () => {
    const onValueChange = vi.fn();
    render(<SearchToolbar placeholder="Search members…" onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole('searchbox'), 'ada');
    expect(onValueChange).toHaveBeenLastCalledWith('ada');
  });

  it('renders filters and actions only when provided', () => {
    const { container, rerender } = render(<SearchToolbar />);
    expect(container.querySelector('.zest-search-toolbar__filters')).not.toBeInTheDocument();
    expect(container.querySelector('.zest-search-toolbar__actions')).not.toBeInTheDocument();

    rerender(
      <SearchToolbar
        filters={<span>Status</span>}
        actions={<button type="button">New project</button>}
      />
    );
    expect(screen.getByText('Status').parentElement).toHaveClass('zest-search-toolbar__filters');
    expect(screen.getByRole('button', { name: 'New project' }).parentElement).toHaveClass(
      'zest-search-toolbar__actions'
    );
  });

  it('forwards searchProps and keeps the layout class alongside a custom className', () => {
    const { container } = render(
      <SearchToolbar searchProps={{ 'aria-label': 'Search projects', className: 'custom' }} />
    );
    expect(screen.getByRole('searchbox', { name: 'Search projects' })).toBeInTheDocument();
    const input = container.querySelector('.zest-search-toolbar__input');
    expect(input).toHaveClass('custom');
  });
});
