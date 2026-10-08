import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NativeSelect } from './NativeSelect';
import { FormField, Label } from '../FormField/FormField';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'pear', label: 'Pear' },
];

describe('NativeSelect', () => {
  it('selects the placeholder until a value is chosen', async () => {
    const onChange = vi.fn();
    render(
      <NativeSelect
        aria-label="Fruit"
        placeholder="Choose…"
        options={options}
        onChange={onChange}
      />
    );
    const select = screen.getByRole('combobox', { name: 'Fruit' });
    expect(select).toHaveValue('');
    await userEvent.selectOptions(select, 'pear');
    expect(select).toHaveValue('pear');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('is labelled by a surrounding FormField', () => {
    render(
      <FormField>
        <Label>Fruit</Label>
        <NativeSelect options={options} />
      </FormField>
    );
    expect(screen.getByLabelText('Fruit').tagName).toBe('SELECT');
  });

  it('sets aria-invalid from the error prop', () => {
    render(<NativeSelect aria-label="Fruit" options={options} error />);
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveAttribute('aria-invalid', 'true');
  });
});
