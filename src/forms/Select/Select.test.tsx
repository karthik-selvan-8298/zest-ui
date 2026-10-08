import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
  { value: 'd', label: 'Delta' },
];

describe('Select', () => {
  describe('single', () => {
    it('renders a combobox trigger with the placeholder', () => {
      render(<Select aria-label="Letter" options={options} placeholder="Pick one" />);
      const trigger = screen.getByRole('combobox', { name: 'Letter' });
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Pick one');
    });

    it('shows the selected label for defaultValue', () => {
      render(<Select aria-label="Letter" options={options} defaultValue="b" />);
      expect(screen.getByRole('combobox', { name: 'Letter' })).toHaveTextContent('Beta');
    });

    it('selects an option and reports the value', async () => {
      const onValueChange = vi.fn();
      render(<Select aria-label="Letter" options={options} onValueChange={onValueChange} />);
      await userEvent.click(screen.getByRole('combobox', { name: 'Letter' }));
      await userEvent.click(await screen.findByRole('option', { name: 'Gamma' }));
      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0]?.[0]).toBe('c');
      expect(screen.getByRole('combobox', { name: 'Letter' })).toHaveTextContent('Gamma');
    });

    it('follows a controlled value', () => {
      const { rerender } = render(<Select aria-label="Letter" options={options} value="a" />);
      expect(screen.getByRole('combobox', { name: 'Letter' })).toHaveTextContent('Alpha');
      rerender(<Select aria-label="Letter" options={options} value="d" />);
      expect(screen.getByRole('combobox', { name: 'Letter' })).toHaveTextContent('Delta');
    });

    it('respects disabled', () => {
      render(<Select aria-label="Letter" options={options} disabled />);
      expect(screen.getByRole('combobox', { name: 'Letter' })).toHaveAttribute('data-disabled');
    });

    it('clears back to the placeholder when clearable', async () => {
      const onValueChange = vi.fn();
      render(
        <Select
          aria-label="Letter"
          options={options}
          defaultValue="a"
          placeholder="Pick one"
          clearable
          onValueChange={onValueChange}
        />
      );
      await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
      expect(onValueChange.mock.calls[0]?.[0]).toBeNull();
      expect(screen.getByRole('combobox', { name: 'Letter' })).toHaveTextContent('Pick one');
      expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
    });

    it('returns focus to the trigger after clearing and still forwards the ref', async () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Select ref={ref} aria-label="Letter" options={options} defaultValue="a" clearable />);
      const trigger = screen.getByRole('combobox', { name: 'Letter' });
      expect(ref.current).toBe(trigger);
      await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
      expect(trigger).toHaveFocus();
    });

    it('marks the trigger aria-invalid when error is set', () => {
      render(<Select aria-label="Letter" options={options} error />);
      expect(screen.getByRole('combobox', { name: 'Letter' })).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });
  });

  describe('multiple', () => {
    it('toggles items and reports the array', async () => {
      const onValueChange = vi.fn();
      render(
        <Select aria-label="Letters" options={options} multiple onValueChange={onValueChange} />
      );
      await userEvent.click(screen.getByRole('combobox', { name: 'Letters' }));
      await userEvent.click(await screen.findByRole('option', { name: 'Alpha' }));
      await userEvent.click(screen.getByRole('option', { name: 'Beta' }));
      expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b'], expect.anything());

      // Toggling off removes the value.
      await userEvent.click(screen.getByRole('option', { name: 'Alpha' }));
      expect(onValueChange).toHaveBeenLastCalledWith(['b'], expect.anything());
    });

    it('renders selected labels as chips', () => {
      render(<Select aria-label="Letters" options={options} multiple defaultValue={['a', 'c']} />);
      const trigger = screen.getByRole('combobox', { name: 'Letters' });
      const chips = within(trigger).getAllByText(/Alpha|Gamma/);
      expect(chips.map((chip) => chip.textContent)).toEqual(['Alpha', 'Gamma']);
      expect(trigger.querySelectorAll('.zest-select__chip')).toHaveLength(2);
    });

    it('collapses chips beyond maxVisible into +N', () => {
      render(
        <Select
          aria-label="Letters"
          options={options}
          multiple
          defaultValue={['a', 'b', 'c', 'd']}
        />
      );
      const trigger = screen.getByRole('combobox', { name: 'Letters' });
      expect(trigger).toHaveTextContent('Alpha');
      expect(trigger).toHaveTextContent('Beta');
      expect(trigger).not.toHaveTextContent('Gamma');
      expect(within(trigger).getByText('+2')).toBeInTheDocument();
    });

    it('honours a custom maxVisible', () => {
      render(
        <Select
          aria-label="Letters"
          options={options}
          multiple
          maxVisible={3}
          defaultValue={['a', 'b', 'c', 'd']}
        />
      );
      const trigger = screen.getByRole('combobox', { name: 'Letters' });
      expect(trigger).toHaveTextContent('Gamma');
      expect(within(trigger).getByText('+1')).toBeInTheDocument();
    });

    it('shows the placeholder when nothing is selected', () => {
      render(<Select aria-label="Letters" options={options} multiple placeholder="Pick some" />);
      expect(screen.getByRole('combobox', { name: 'Letters' })).toHaveTextContent('Pick some');
    });

    it('uses renderValue when provided', () => {
      render(
        <Select
          aria-label="Letters"
          options={options}
          multiple
          defaultValue={['a', 'b']}
          renderValue={(selected) => `${selected.length} picked`}
        />
      );
      expect(screen.getByRole('combobox', { name: 'Letters' })).toHaveTextContent('2 picked');
    });

    it('submits one hidden input per selected value', () => {
      const { container } = render(
        <form>
          <Select
            aria-label="Letters"
            name="letters"
            options={options}
            multiple
            defaultValue={['a', 'c']}
          />
        </form>
      );
      const form = container.querySelector('form') as HTMLFormElement;
      expect(new FormData(form).getAll('letters')).toEqual(['a', 'c']);
    });

    it('clears to an empty array when clearable', async () => {
      const onValueChange = vi.fn();
      render(
        <Select
          aria-label="Letters"
          options={options}
          multiple
          clearable
          defaultValue={['a']}
          onValueChange={onValueChange}
        />
      );
      await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
      expect(onValueChange.mock.calls[0]?.[0]).toEqual([]);
      expect(
        screen.getByRole('combobox', { name: 'Letters' }).querySelectorAll('.zest-select__chip')
      ).toHaveLength(0);
    });
  });
});

describe('Select in-popup search', () => {
  const many = Array.from({ length: 12 }, (_, i) => ({ value: `opt-${i}`, label: `Option ${i}` }));
  const few = many.slice(0, 3);

  it('shows the search field only above the threshold (auto)', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Select aria-label="Many" options={many} />);
    await user.click(screen.getByRole('combobox'));
    expect(await screen.findByRole('searchbox')).toBeInTheDocument();
    unmount();
    render(<Select aria-label="Few" options={few} />);
    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('listbox');
    expect(screen.queryByRole('searchbox')).toBeNull();
  });

  it('can be forced on or off', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Select aria-label="Forced" options={few} searchable />);
    await user.click(screen.getByRole('combobox'));
    expect(await screen.findByRole('searchbox')).toBeInTheDocument();
    unmount();
    render(<Select aria-label="Off" options={many} searchable={false} />);
    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('listbox');
    expect(screen.queryByRole('searchbox')).toBeNull();
  });

  it('filters options and selects the single match on Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Select aria-label="Many" options={many} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox'));
    const box = await screen.findByRole('searchbox');
    await user.type(box, 'option 7');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    await user.keyboard('{Enter}');
    expect(onValueChange.mock.calls[0]?.[0]).toBe('opt-7');
  });

  it('shows an empty row when nothing matches', async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Many" options={many} noResultsText="Nothing here" />);
    await user.click(screen.getByRole('combobox'));
    await user.type(await screen.findByRole('searchbox'), 'zzz');
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });
});
