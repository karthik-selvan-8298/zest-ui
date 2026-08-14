import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('renders an unpressed toggle button', () => {
    render(<Toggle aria-label="Favorite" />);
    const button = screen.getByRole('button', { name: 'Favorite' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('toggles on click', async () => {
    render(<Toggle aria-label="Favorite" />);
    const button = screen.getByRole('button', { name: 'Favorite' });
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('respects defaultPressed', () => {
    render(<Toggle aria-label="Favorite" defaultPressed />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not toggle when disabled', async () => {
    const onPressedChange = vi.fn();
    render(<Toggle aria-label="Favorite" disabled onPressedChange={onPressedChange} />);
    const button = screen.getByRole('button', { name: 'Favorite' });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onPressedChange).not.toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('supports controlled pressed with onPressedChange', async () => {
    const onPressedChange = vi.fn();
    render(<Toggle aria-label="Favorite" pressed={false} onPressedChange={onPressedChange} />);
    const button = screen.getByRole('button', { name: 'Favorite' });
    await userEvent.click(button);
    expect(onPressedChange).toHaveBeenCalledTimes(1);
    expect(onPressedChange).toHaveBeenCalledWith(true, expect.anything());
    // Controlled: stays unpressed until the owner updates the prop.
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('stamps tone and size data attributes', () => {
    render(<Toggle aria-label="Favorite" color="success" size="lg" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-accent', 'success');
    expect(button).toHaveAttribute('data-size', 'lg');
  });
});
