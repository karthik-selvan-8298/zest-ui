import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Menu } from './Menu';

function renderMenu() {
  return render(
    <Menu.Root>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content>
        <Menu.Item>Rename</Menu.Item>
        <Menu.Item disabled>Move to…</Menu.Item>
        <Menu.Separator />
        <Menu.Item destructive>Delete</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
}

async function openMenu() {
  await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
  return screen.findByRole('menu');
}

describe('Menu', () => {
  it('is closed until the trigger is clicked, then lists items', async () => {
    renderMenu();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    const menu = await openMenu();
    expect(menu).toHaveClass('zest-menu__popup');
    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Rename');
    expect(items[0]).toHaveClass('zest-menu__item');
    expect(items[1]).toHaveAttribute('aria-disabled', 'true');
  });

  it('marks destructive items with data-destructive', async () => {
    renderMenu();
    await openMenu();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('data-destructive');
    expect(screen.getByRole('menuitem', { name: 'Rename' })).not.toHaveAttribute(
      'data-destructive'
    );
  });

  it('closes on Escape', async () => {
    renderMenu();
    await openMenu();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('renders a submenu trigger with a chevron', async () => {
    render(
      <Menu.Root>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Content>
          <Menu.SubmenuRoot>
            <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
            <Menu.Content>
              <Menu.Item>Email</Menu.Item>
            </Menu.Content>
          </Menu.SubmenuRoot>
        </Menu.Content>
      </Menu.Root>
    );
    await openMenu();
    const trigger = screen.getByRole('menuitem', { name: 'Share' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger.querySelector('.zest-menu__submenu-chevron')).toBeInTheDocument();
  });

  it('toggles a checkbox item and reports the change', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Menu.Root>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Content>
          <Menu.CheckboxItem closeOnClick={false} onCheckedChange={onCheckedChange}>
            Compact rows
          </Menu.CheckboxItem>
        </Menu.Content>
      </Menu.Root>
    );
    await openMenu();
    const checkbox = screen.getByRole('menuitemcheckbox', { name: 'Compact rows' });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox).toHaveClass('zest-menu__item');
    expect(checkbox.querySelector('.zest-menu__item-indicator')).toBeInTheDocument();

    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());

    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(onCheckedChange).toHaveBeenLastCalledWith(false, expect.anything());
  });

  it('selects one radio item at a time and reports the value', async () => {
    const onValueChange = vi.fn();
    render(
      <Menu.Root>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Content>
          <Menu.RadioGroup defaultValue="light" onValueChange={onValueChange}>
            <Menu.RadioItem value="light" closeOnClick={false}>
              Light
            </Menu.RadioItem>
            <Menu.RadioItem value="dark" closeOnClick={false}>
              Dark
            </Menu.RadioItem>
            <Menu.RadioItem value="system" closeOnClick={false}>
              System
            </Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu.Root>
    );
    await openMenu();
    const radios = screen.getAllByRole('menuitemradio');
    expect(radios).toHaveLength(3);
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    expect(radios[1]).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(radios[1] as HTMLElement);
    expect(onValueChange).toHaveBeenLastCalledWith('dark', expect.anything());
    expect(radios[0]).toHaveAttribute('aria-checked', 'false');
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');
    expect(radios[2]).toHaveAttribute('aria-checked', 'false');
  });

  it('respects a controlled radio value', async () => {
    render(
      <Menu.Root>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Content>
          <Menu.RadioGroup value="dark">
            <Menu.RadioItem value="light">Light</Menu.RadioItem>
            <Menu.RadioItem value="dark">Dark</Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu.Root>
    );
    await openMenu();
    expect(screen.getByRole('menuitemradio', { name: 'Dark' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    expect(screen.getByRole('menuitemradio', { name: 'Light' })).toHaveAttribute(
      'aria-checked',
      'false'
    );
  });
});
