import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextMenu } from './ContextMenu';

function renderContextMenu() {
  return render(
    <ContextMenu.Root>
      <ContextMenu.Trigger>Target area</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Rename</ContextMenu.Item>
        <ContextMenu.Item>Duplicate</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item destructive>Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

describe('ContextMenu', () => {
  it('renders the trigger area as a block element', () => {
    renderContextMenu();
    const trigger = screen.getByText('Target area');
    expect(trigger).toHaveClass('zest-context-menu__trigger');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens on right click and shows items', async () => {
    renderContextMenu();
    fireEvent.contextMenu(screen.getByText('Target area'), { clientX: 40, clientY: 40 });
    const menu = await screen.findByRole('menu');
    expect(menu).toHaveClass('zest-menu__popup');
    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Rename');
    expect(items[0]).toHaveClass('zest-menu__item');
  });

  it('marks destructive items with data-destructive', async () => {
    renderContextMenu();
    fireEvent.contextMenu(screen.getByText('Target area'), { clientX: 40, clientY: 40 });
    await screen.findByRole('menu');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('data-destructive');
    expect(screen.getByRole('menuitem', { name: 'Rename' })).not.toHaveAttribute(
      'data-destructive'
    );
  });

  it('closes on Escape', async () => {
    renderContextMenu();
    fireEvent.contextMenu(screen.getByText('Target area'), { clientX: 40, clientY: 40 });
    await screen.findByRole('menu');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('renders checkbox and radio items with their roles', async () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>Target area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.CheckboxItem defaultChecked>Hidden files</ContextMenu.CheckboxItem>
          <ContextMenu.RadioGroup defaultValue="name">
            <ContextMenu.RadioItem value="name">Name</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="size">Size</ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
        </ContextMenu.Content>
      </ContextMenu.Root>
    );
    fireEvent.contextMenu(screen.getByText('Target area'), { clientX: 40, clientY: 40 });
    await screen.findByRole('menu');
    const checkbox = screen.getByRole('menuitemcheckbox', { name: 'Hidden files' });
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(checkbox).toHaveClass('zest-menu__item');
    const radios = screen.getAllByRole('menuitemradio');
    expect(radios).toHaveLength(2);
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    expect(radios[1]).toHaveAttribute('aria-checked', 'false');
  });
});
