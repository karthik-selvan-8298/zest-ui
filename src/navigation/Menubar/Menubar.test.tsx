import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Menubar } from './Menubar';

function renderMenubar(variant?: 'contained' | 'plain') {
  return render(
    <Menubar.Root variant={variant}>
      <Menubar.Menu>
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>New</Menubar.Item>
          <Menubar.Item>Open</Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item destructive>Delete</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>Edit</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>Undo</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar.Root>
  );
}

describe('Menubar', () => {
  it('renders a menubar with its triggers', () => {
    renderMenubar();
    const bar = screen.getByRole('menubar');
    expect(bar).toHaveClass('zest-menubar');
    expect(bar).toHaveAttribute('data-variant', 'contained');
    const file = screen.getByRole('menuitem', { name: 'File' });
    expect(file).toHaveClass('zest-menubar__trigger');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('supports the plain variant', () => {
    renderMenubar('plain');
    expect(screen.getByRole('menubar')).toHaveAttribute('data-variant', 'plain');
  });

  it('opens a menu on trigger click and shows its items', async () => {
    renderMenubar();
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    const menu = await screen.findByRole('menu');
    expect(menu).toHaveClass('zest-menu__popup');
    expect(screen.getByRole('menuitem', { name: 'New' })).toHaveClass('zest-menu__item');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('data-destructive');
    expect(screen.getByRole('menuitem', { name: 'File' })).toHaveAttribute('data-popup-open');
  });

  it('closes on Escape', async () => {
    renderMenubar();
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    await screen.findByRole('menu');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
