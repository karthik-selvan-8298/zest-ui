import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { List } from './List';

describe('List.Row', () => {
  it('renders title and subtitle inside a list item', () => {
    render(
      <List.Root>
        <List.Row title="Ada Lovelace" subtitle="Engineering" leading={<span>A</span>} />
      </List.Root>
    );
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('zest-list__item', 'zest-list__row');
    expect(item).not.toHaveAttribute('data-clickable');
    expect(screen.getByText('Ada Lovelace')).toHaveClass('zest-list__item-primary');
    expect(screen.getByText('Engineering')).toHaveClass('zest-list__item-secondary');
    expect(item.querySelector('.zest-list__item-icon')).toHaveTextContent('A');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('fires onClick from the title button', async () => {
    const onClick = vi.fn();
    render(
      <List.Root>
        <List.Row title="Open me" onClick={onClick} />
      </List.Root>
    );
    expect(screen.getByRole('listitem')).toHaveAttribute('data-clickable');
    await userEvent.click(screen.getByRole('button', { name: 'Open me' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('keeps trailing controls outside the row button so clicking them does not fire onClick', async () => {
    const onRow = vi.fn();
    const onMenu = vi.fn();
    render(
      <List.Root>
        <List.Row
          title="Grace Hopper"
          onClick={onRow}
          trailing={
            <button type="button" onClick={onMenu}>
              Menu
            </button>
          }
        />
      </List.Root>
    );
    const menu = screen.getByRole('button', { name: 'Menu' });
    const rowButton = screen.getByRole('button', { name: 'Grace Hopper' });
    expect(rowButton.contains(menu)).toBe(false);
    expect(menu.closest('button')).toBe(menu);
    await userEvent.click(menu);
    expect(onMenu).toHaveBeenCalledTimes(1);
    expect(onRow).not.toHaveBeenCalled();
  });

  it('renders a link when href is given', () => {
    render(
      <List.Root>
        <List.Row title="Settings" href="/settings" selected />
      </List.Root>
    );
    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).toHaveAttribute('href', '/settings');
    expect(link).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('listitem')).toHaveAttribute('data-selected');
  });

  it('disabled rows do not fire onClick', async () => {
    const onClick = vi.fn();
    render(
      <List.Root>
        <List.Row title="Nope" onClick={onClick} disabled />
      </List.Root>
    );
    const button = screen.getByRole('button', { name: 'Nope' });
    expect(button).toBeDisabled();
    expect(screen.getByRole('listitem')).toHaveAttribute('data-disabled');
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('stamps the divider attribute', () => {
    render(
      <List.Root>
        <List.Row title="One" divider />
        <List.Row title="Two" />
      </List.Root>
    );
    const [first, second] = screen.getAllByRole('listitem');
    expect(first).toHaveAttribute('data-divider');
    expect(second).not.toHaveAttribute('data-divider');
  });
});
