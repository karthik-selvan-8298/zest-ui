import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title, description and action in the default empty state', () => {
    const { container } = render(
      <EmptyState title="Nothing here" description="Add something." action={<button>Add</button>} />
    );
    const root = container.querySelector('.zest-empty-state') as HTMLElement;
    expect(root).toHaveAttribute('data-state', 'empty');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('aria-busy');
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByText('Add something.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(root.querySelector('.zest-empty-state__icon')).not.toHaveAttribute('data-accent');
  });

  it('loading: renders a spinner, role="status", aria-busy, default title and no action', () => {
    const { container } = render(<EmptyState state="loading" action={<button>Add</button>} />);
    const root = screen.getByRole('status');
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(root).toHaveAttribute('data-state', 'loading');
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(container.querySelector('.zest-spinner')).not.toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('loading: a custom title replaces the default', () => {
    render(<EmptyState state="loading" title="Syncing" />);
    expect(screen.getByText('Syncing')).toBeInTheDocument();
    expect(screen.queryByText('Loading…')).toBeNull();
  });

  it('error: renders the error icon tone, role="alert" and keeps the action', async () => {
    const onRetry = vi.fn();
    const { container } = render(
      <EmptyState state="error" title="Failed" action={<button onClick={onRetry}>Retry</button>} />
    );
    const root = screen.getByRole('alert');
    expect(root).toHaveAttribute('data-state', 'error');
    expect(root).not.toHaveAttribute('aria-busy');
    expect(container.querySelector('.zest-empty-state__icon')).toHaveAttribute(
      'data-accent',
      'error'
    );
    expect(container.querySelector('.zest-spinner')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('a custom icon overrides the state default', () => {
    const { container } = render(
      <EmptyState state="loading" icon={<span data-testid="custom" />} />
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
    expect(container.querySelector('.zest-spinner')).toBeNull();
  });

  it('icon={null} hides the icon slot', () => {
    const { container } = render(<EmptyState title="Bare" icon={null} />);
    expect(container.querySelector('.zest-empty-state__icon')).toBeNull();
  });

  it('applies the size attribute', () => {
    const { container } = render(<EmptyState title="Small" size="sm" />);
    expect(container.querySelector('.zest-empty-state')).toHaveAttribute('data-size', 'sm');
  });
});
