import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../actions/Button/Button';
import { Dialog } from './Dialog';

function renderDialog() {
  return render(
    <Dialog.Root>
      <Dialog.Trigger render={<Button>Open</Button>} />
      <Dialog.Content title="Settings" description="Manage preferences">
        Body content
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="ghost">Cancel</Button>} />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

describe('Dialog', () => {
  it('opens on trigger click with accessible title', async () => {
    renderDialog();
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('closes via the close button', async () => {
    renderDialog();
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('dialog');
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    renderDialog();
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
