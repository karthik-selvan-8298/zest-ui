import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Button } from '../../actions/Button/Button';
import { Drawer } from './Drawer';

function renderDrawer() {
  return render(
    <Drawer.Root>
      <Drawer.Trigger render={<Button>Open filters</Button>} />
      <Drawer.Content title="Filters" description="Narrow the results">
        Body content
        <Drawer.Close render={<Button variant="ghost">Done</Button>} />
      </Drawer.Content>
    </Drawer.Root>
  );
}

describe('Drawer', () => {
  it('opens from its trigger as a dialog named by its title', async () => {
    renderDrawer();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Open filters' }));
    const dialog = await screen.findByRole('dialog', { name: 'Filters' });
    expect(dialog).toHaveClass('zest-drawer__popup');
    expect(dialog).toHaveAccessibleDescription('Narrow the results');
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('defaults to the right side at medium size and honours overrides', async () => {
    const { unmount } = render(
      <Drawer.Root defaultOpen>
        <Drawer.Content title="Default" />
      </Drawer.Root>
    );
    const first = await screen.findByRole('dialog');
    expect(first).toHaveAttribute('data-side', 'right');
    expect(first).toHaveAttribute('data-size', 'md');
    unmount();

    render(
      <Drawer.Root defaultOpen>
        <Drawer.Content title="Custom" side="left" size="lg" className="mine" />
      </Drawer.Root>
    );
    const second = await screen.findByRole('dialog');
    expect(second).toHaveAttribute('data-side', 'left');
    expect(second).toHaveAttribute('data-size', 'lg');
    expect(second).toHaveClass('zest-drawer__popup', 'mine');
  });

  it('closes from the corner button, a Drawer.Close and Escape', async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer.Root onOpenChange={onOpenChange}>
        <Drawer.Trigger render={<Button>Open</Button>} />
        <Drawer.Content title="Filters">
          <Drawer.Close render={<Button variant="ghost">Done</Button>} />
        </Drawer.Content>
      </Drawer.Root>
    );
    const open = async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await screen.findByRole('dialog');
    };
    const expectClosed = () =>
      waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    await open();
    await userEvent.click(screen.getByRole('button', { name: 'Close drawer' }));
    await expectClosed();

    await open();
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    await expectClosed();

    await open();
    await userEvent.keyboard('{Escape}');
    await expectClosed();
    expect(onOpenChange.mock.calls.map(([isOpen]) => isOpen)).toEqual([
      true,
      false,
      true,
      false,
      true,
      false,
    ]);
  });

  it('omits the corner button with hideClose but keeps the title', async () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Content title="Filters" hideClose />
      </Drawer.Root>
    );
    await screen.findByRole('dialog', { name: 'Filters' });
    expect(screen.queryByRole('button', { name: 'Close drawer' })).not.toBeInTheDocument();
  });

  it('renders a description-only header when the close button is hidden', async () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Content description="Only a description" hideClose>
          Body
        </Drawer.Content>
      </Drawer.Root>
    );
    expect(await screen.findByText('Only a description')).toHaveClass('zest-drawer__description');
  });

  it('renders no header at all without a title, description or close button', async () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Content hideClose aria-label="Bare">
          Body
        </Drawer.Content>
      </Drawer.Root>
    );
    const dialog = await screen.findByRole('dialog', { name: 'Bare' });
    expect(dialog.querySelector('.zest-drawer__header')).toBeNull();
    expect(dialog.querySelector('.zest-drawer__body')).toHaveTextContent('Body');
  });

  it('has no axe violations when open', async () => {
    renderDrawer();
    await userEvent.click(screen.getByRole('button', { name: 'Open filters' }));
    await screen.findByRole('dialog');
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
