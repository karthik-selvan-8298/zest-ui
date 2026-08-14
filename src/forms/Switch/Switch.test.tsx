import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders with a label and toggles', async () => {
    render(<Switch label="Notifications" />);
    const control = screen.getByRole('switch', { name: 'Notifications' });
    expect(control).not.toBeChecked();
    await userEvent.click(control);
    expect(control).toBeChecked();
  });

  it('supports controlled usage', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Controlled" checked={false} onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalled();
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('does not toggle when disabled', async () => {
    render(<Switch label="Disabled" disabled />);
    const control = screen.getByRole('switch');
    await userEvent.click(control);
    expect(control).not.toBeChecked();
  });
});
