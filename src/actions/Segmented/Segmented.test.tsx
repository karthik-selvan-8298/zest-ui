import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Segmented } from './Segmented';

const options = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'map', label: 'Map' },
];

describe('Segmented', () => {
  it('renders a labelled group of pressable segments with the first selected by default', () => {
    render(<Segmented aria-label="View" options={options} />);
    const group = screen.getByRole('group', { name: 'View' });
    expect(group).toHaveClass('zest-segmented');
    expect(group).toHaveAttribute('data-accent', 'primary');
    expect(group).toHaveAttribute('data-variant', 'solid');
    expect(group).toHaveAttribute('data-size', 'md');

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('selects on click (uncontrolled) and reports the string value', async () => {
    const onValueChange = vi.fn();
    render(
      <Segmented
        aria-label="View"
        options={options}
        defaultValue="list"
        onValueChange={onValueChange}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Grid' }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('grid');
    expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('never deselects: clicking the selected segment keeps it selected', async () => {
    const onValueChange = vi.fn();
    render(
      <Segmented
        aria-label="View"
        options={options}
        defaultValue="grid"
        onValueChange={onValueChange}
      />
    );
    const grid = screen.getByRole('button', { name: 'Grid' });
    await userEvent.click(grid);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(grid).toHaveAttribute('aria-pressed', 'true');
  });

  it('supports controlled value with onValueChange', async () => {
    const onValueChange = vi.fn();
    render(
      <Segmented aria-label="View" value="list" onValueChange={onValueChange}>
        <Segmented.Item value="list">List</Segmented.Item>
        <Segmented.Item value="grid">Grid</Segmented.Item>
      </Segmented>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Grid' }));
    expect(onValueChange).toHaveBeenCalledWith('grid');
    // Controlled: stays on the owner's value until the prop changes.
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('ignores clicks when disabled (group and per-item)', async () => {
    const onValueChange = vi.fn();
    render(
      <>
        <Segmented aria-label="All" options={options} disabled onValueChange={onValueChange} />
        <Segmented
          aria-label="One"
          options={[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B', disabled: true },
          ]}
          onValueChange={onValueChange}
        />
      </>
    );
    const map = screen.getByRole('button', { name: 'Map' });
    expect(map).toBeDisabled();
    await userEvent.click(map);

    const b = screen.getByRole('button', { name: 'B' });
    expect(b).toBeDisabled();
    await userEvent.click(b);

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('stamps variant, color, size and fullWidth data attributes', () => {
    render(
      <Segmented
        aria-label="View"
        options={options}
        variant="soft"
        color="success"
        size="sm"
        fullWidth
      />
    );
    const group = screen.getByRole('group', { name: 'View' });
    expect(group).toHaveAttribute('data-variant', 'soft');
    expect(group).toHaveAttribute('data-accent', 'success');
    expect(group).toHaveAttribute('data-size', 'sm');
    expect(group).toHaveAttribute('data-full-width');
  });
});
