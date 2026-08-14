import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox } from './Combobox';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

describe('Combobox', () => {
  it('renders an input with placeholder', () => {
    render(<Combobox aria-label="Fruit" options={options} placeholder="Pick a fruit" />);
    const input = screen.getByRole('combobox', { name: 'Fruit' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Pick a fruit');
  });

  it('opens the popup and shows options when typing', async () => {
    render(<Combobox aria-label="Fruit" options={options} />);
    const input = screen.getByRole('combobox', { name: 'Fruit' });
    await userEvent.type(input, 'a');
    const listbox = await screen.findByRole('listbox');
    expect(listbox).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
  });

  it('filters options to matches and shows the empty message otherwise', async () => {
    render(<Combobox aria-label="Fruit" options={options} />);
    const input = screen.getByRole('combobox', { name: 'Fruit' });
    await userEvent.type(input, 'ban');
    expect(await screen.findByRole('option', { name: 'Banana' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument();

    await userEvent.clear(input);
    await userEvent.type(input, 'zzz');
    expect(await screen.findByText('No results')).toBeInTheDocument();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('selects an option on click and reports the value', async () => {
    const onValueChange = vi.fn();
    render(<Combobox aria-label="Fruit" options={options} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Fruit' });
    await userEvent.type(input, 'ban');
    await userEvent.click(await screen.findByRole('option', { name: 'Banana' }));
    expect(onValueChange).toHaveBeenCalledWith('banana');
    expect(input).toHaveValue('Banana');
  });

  it('respects disabled', () => {
    render(<Combobox aria-label="Fruit" options={options} disabled />);
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toBeDisabled();
  });
});
