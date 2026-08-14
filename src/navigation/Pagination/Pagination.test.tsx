import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders a nav with all pages when count is small', () => {
    render(<Pagination count={5} />);
    expect(screen.getByRole('navigation', { name: 'pagination navigation' })).toBeInTheDocument();
    for (const page of [1, 2, 3, 4, 5]) {
      expect(
        screen.getByRole('button', { name: page === 1 ? 'Page 1' : `Go to page ${page}` })
      ).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeInTheDocument();
  });

  it('fires onPageChange when a page is clicked', async () => {
    const onPageChange = vi.fn();
    render(<Pagination count={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Go to page 3' }));
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('fires onPageChange from prev/next buttons', async () => {
    const onPageChange = vi.fn();
    render(<Pagination count={5} defaultPage={3} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Go to previous page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
    await userEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
  });

  it('disables prev on the first page and next on the last', () => {
    const { rerender } = render(<Pagination count={5} page={1} />);
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeEnabled();
    rerender(<Pagination count={5} page={5} />);
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled();
  });

  it('collapses to ellipsis for large counts', () => {
    const { container } = render(<Pagination count={50} defaultPage={25} />);
    const ellipses = container.querySelectorAll('.zest-pagination__ellipsis');
    expect(ellipses).toHaveLength(2);
    // boundaries + current page ± siblings are visible
    expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 24' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 25' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 26' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 50' })).toBeInTheDocument();
    // pages inside the collapsed ranges are not rendered
    expect(screen.queryByRole('button', { name: 'Go to page 10' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Go to page 40' })).not.toBeInTheDocument();
  });

  it('disables every button when disabled', async () => {
    const onPageChange = vi.fn();
    render(<Pagination count={5} disabled onPageChange={onPageChange} />);
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
    }
    await userEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('marks the active page with aria-current', () => {
    render(<Pagination count={5} page={4} />);
    const active = screen.getByRole('button', { name: 'Page 4' });
    expect(active).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Go to page 2' })).not.toHaveAttribute(
      'aria-current'
    );
  });
});
