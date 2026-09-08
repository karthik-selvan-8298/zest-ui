import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { FormField, Label } from '../FormField/FormField';
import { OtpInput } from './OtpInput';

function cells() {
  return Array.from(document.querySelectorAll<HTMLInputElement>('.zest-otp-input__cell'));
}

function cell(index: number): HTMLInputElement {
  const el = cells()[index];
  if (!el) throw new Error(`No OTP cell at index ${index}`);
  return el;
}

describe('OtpInput', () => {
  it('renders a labelled group of six cells by default', () => {
    render(<OtpInput aria-label="Verification code" />);
    const group = screen.getByRole('group', { name: 'Verification code' });
    expect(group).toHaveClass('zest-otp-input');
    expect(group).toHaveAttribute('data-size', 'md');
    expect(cells()).toHaveLength(6);
    expect(screen.getByRole('textbox', { name: 'Character 2 of 6' })).toBeInTheDocument();
  });

  it('honours length, size, error and fullWidth', () => {
    render(<OtpInput aria-label="PIN" length={4} size="sm" error fullWidth />);
    const group = screen.getByRole('group', { name: 'PIN' });
    expect(cells()).toHaveLength(4);
    expect(group).toHaveAttribute('data-size', 'sm');
    expect(group).toHaveAttribute('data-error');
    expect(group).toHaveAttribute('data-full-width');
  });

  it('places the separator after the first half of the cells', () => {
    render(<OtpInput aria-label="Code" length={6} separator="–" />);
    const separator = document.querySelector('.zest-otp-input__separator');
    expect(separator).toHaveTextContent('–');
    expect(separator?.previousElementSibling).toBe(cell(2));
    expect(separator?.nextElementSibling).toBe(cell(3));
  });

  it('renders no separator when none is given', () => {
    render(<OtpInput aria-label="Code" />);
    expect(document.querySelector('.zest-otp-input__separator')).toBeNull();
  });

  it('types across cells and reports value changes and completion', async () => {
    const onValueChange = vi.fn();
    const onComplete = vi.fn();
    render(
      <OtpInput
        aria-label="Code"
        length={4}
        onValueChange={onValueChange}
        onComplete={onComplete}
      />
    );
    await userEvent.click(cell(0));
    await userEvent.keyboard('1234');
    expect(onValueChange).toHaveBeenLastCalledWith('1234', expect.anything());
    expect(onComplete).toHaveBeenCalledWith('1234', expect.anything());
    expect(cells().map((c) => c.value)).toEqual(['1', '2', '3', '4']);
  });

  it('rejects non-numeric input by default and accepts it when alphanumeric', async () => {
    const onValueChange = vi.fn();
    const { unmount } = render(
      <OtpInput aria-label="Code" length={4} onValueChange={onValueChange} />
    );
    await userEvent.click(cell(0));
    await userEvent.keyboard('a');
    expect(cell(0).value).toBe('');
    unmount();

    render(<OtpInput aria-label="Code" length={4} type="alphanumeric" />);
    await userEvent.click(cell(0));
    await userEvent.keyboard('a');
    expect(cell(0).value).toBe('a');
  });

  it('supports a controlled value', async () => {
    function Controlled() {
      const [value, setValue] = React.useState('12');
      return <OtpInput aria-label="Code" length={4} value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    expect(cells().map((c) => c.value)).toEqual(['1', '2', '', '']);
    await userEvent.click(cell(2));
    await userEvent.keyboard('3');
    expect(cells().map((c) => c.value)).toEqual(['1', '2', '3', '']);
  });

  it('seeds cells from defaultValue', () => {
    render(<OtpInput aria-label="Code" length={4} defaultValue="98" />);
    expect(cells().map((c) => c.value)).toEqual(['9', '8', '', '']);
  });

  it('masks characters when mask is set', () => {
    render(<OtpInput aria-label="PIN" length={4} mask defaultValue="1" />);
    expect(cell(0)).toHaveAttribute('type', 'password');
  });

  it('disables every cell', () => {
    render(<OtpInput aria-label="Code" disabled />);
    expect(screen.getByRole('group')).toHaveAttribute('data-disabled');
    cells().forEach((cell) => expect(cell).toBeDisabled());
  });

  it('focuses the first cell with autoFocus', () => {
    render(<OtpInput aria-label="Code" autoFocus />);
    expect(cell(0)).toHaveFocus();
  });

  it('submits through a hidden input named by `name`', () => {
    render(
      <form data-testid="form">
        <OtpInput aria-label="Code" name="otp" length={4} defaultValue="4321" />
      </form>
    );
    const form = screen.getByTestId<HTMLFormElement>('form');
    expect(new FormData(form).get('otp')).toBe('4321');
  });

  it('takes its label from a surrounding FormField', () => {
    render(
      <FormField name="code">
        <Label>Verification code</Label>
        <OtpInput length={4} />
      </FormField>
    );
    expect(screen.getByRole('textbox', { name: 'Verification code' })).toBe(cell(0));
  });
});
