import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  it('names the inner input and shows the initial value', () => {
    render(<NumberInput aria-label="Quantity" defaultValue={3} placeholder="0" />);
    const input = screen.getByRole('textbox', { name: 'Quantity' });
    expect(input).toHaveValue('3');
    expect(input).toHaveAttribute('placeholder', '0');
    expect(input).toHaveClass('zest-number-input__control');
  });

  it('steps with the buttons and reports the new value', async () => {
    const onValueChange = vi.fn();
    render(<NumberInput aria-label="Quantity" defaultValue={1} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(screen.getByRole('textbox', { name: 'Quantity' })).toHaveValue('2');
    expect(onValueChange.mock.lastCall?.[0]).toBe(2);
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(screen.getByRole('textbox', { name: 'Quantity' })).toHaveValue('0');
    expect(onValueChange.mock.lastCall?.[0]).toBe(0);
  });

  it('stops at min and max', async () => {
    render(<NumberInput aria-label="Quantity" defaultValue={1} min={0} max={2} />);
    const input = screen.getByRole('textbox', { name: 'Quantity' });
    const increase = screen.getByRole('button', { name: 'Increase' });
    const decrease = screen.getByRole('button', { name: 'Decrease' });
    await userEvent.click(increase);
    expect(input).toHaveValue('2');
    expect(increase).toBeDisabled();
    await userEvent.click(decrease);
    await userEvent.click(decrease);
    expect(input).toHaveValue('0');
    expect(decrease).toBeDisabled();
  });

  it('marks the input invalid when error is set, and only then', () => {
    const { rerender } = render(<NumberInput aria-label="Quantity" />);
    const input = screen.getByRole('textbox', { name: 'Quantity' });
    expect(input).not.toHaveAttribute('aria-invalid');
    rerender(<NumberInput aria-label="Quantity" error />);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.closest('.zest-number-input')).toHaveAttribute('data-error');
  });

  it('applies size, fullWidth and className to the root and forwards the ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<NumberInput ref={ref} aria-label="Quantity" size="sm" fullWidth className="mine" />);
    expect(ref.current).toHaveClass('zest-number-input', 'mine');
    expect(ref.current).toHaveAttribute('data-size', 'sm');
    expect(ref.current).toHaveAttribute('data-full-width');
  });

  it('disables the input and both steppers', () => {
    render(<NumberInput aria-label="Quantity" disabled />);
    expect(screen.getByRole('textbox', { name: 'Quantity' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled();
  });

  it('has no axe violations', async () => {
    const { container } = render(<NumberInput aria-label="Quantity" defaultValue={1} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
