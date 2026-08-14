import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('toggles on click', async () => {
    render(<Checkbox label="Accept terms" />);
    const box = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(box).not.toBeChecked();
    await userEvent.click(box);
    expect(box).toBeChecked();
  });

  it('fires onCheckedChange', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Subscribe" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
  });

  it('supports indeterminate state', () => {
    render(<Checkbox label="Partial" indeterminate />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
  });

  it('does not toggle when disabled', async () => {
    render(<Checkbox label="Locked" disabled />);
    const box = screen.getByRole('checkbox');
    await userEvent.click(box);
    expect(box).not.toBeChecked();
  });
});
