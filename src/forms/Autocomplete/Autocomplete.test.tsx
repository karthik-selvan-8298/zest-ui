import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Autocomplete } from './Autocomplete';

const suggestions = ['Alert', 'Avatar', 'Badge'];

describe('Autocomplete', () => {
  it('renders a combobox input with its placeholder', () => {
    render(
      <Autocomplete aria-label="Search docs" suggestions={suggestions} placeholder="Search" />
    );
    const input = screen.getByRole('combobox', { name: 'Search docs' });
    expect(input).toHaveAttribute('placeholder', 'Search');
    expect(input).toHaveClass('zest-autocomplete__input');
  });

  it('filters suggestions as the user types and shows the empty message otherwise', async () => {
    render(<Autocomplete aria-label="Search docs" suggestions={suggestions} />);
    const input = screen.getByRole('combobox', { name: 'Search docs' });
    await userEvent.type(input, 'a');
    expect(await screen.findByRole('option', { name: 'Alert' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Avatar' })).toBeInTheDocument();

    await userEvent.type(input, 'v');
    expect(screen.queryByRole('option', { name: 'Alert' })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Avatar' })).toBeInTheDocument();

    await userEvent.clear(input);
    await userEvent.type(input, 'zzz');
    expect(await screen.findByText('No results')).toBeInTheDocument();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('fills the input with the picked suggestion label and reports it', async () => {
    const onValueChange = vi.fn();
    render(
      <Autocomplete
        aria-label="Search docs"
        suggestions={[{ value: 'btn', label: 'Button' }, 'Badge']}
        onValueChange={onValueChange}
      />
    );
    const input = screen.getByRole('combobox', { name: 'Search docs' });
    await userEvent.type(input, 'b');
    await userEvent.click(await screen.findByRole('option', { name: 'Button' }));
    expect(input).toHaveValue('Button');
    expect(onValueChange).toHaveBeenLastCalledWith('Button');
  });

  it('keeps free text that matches no suggestion', async () => {
    const onValueChange = vi.fn();
    render(
      <Autocomplete
        aria-label="Search docs"
        suggestions={suggestions}
        onValueChange={onValueChange}
      />
    );
    const input = screen.getByRole('combobox', { name: 'Search docs' });
    await userEvent.type(input, 'xyz');
    expect(input).toHaveValue('xyz');
    expect(onValueChange).toHaveBeenLastCalledWith('xyz');
  });

  it('supports a custom empty message', async () => {
    render(
      <Autocomplete
        aria-label="Search docs"
        suggestions={suggestions}
        emptyMessage="Nothing here"
      />
    );
    await userEvent.type(screen.getByRole('combobox', { name: 'Search docs' }), 'zzz');
    expect(await screen.findByText('Nothing here')).toBeInTheDocument();
  });

  it('marks the input invalid when error is set, and only then', () => {
    const { rerender } = render(
      <Autocomplete aria-label="Search docs" suggestions={suggestions} />
    );
    const input = screen.getByRole('combobox', { name: 'Search docs' });
    expect(input).not.toHaveAttribute('aria-invalid');
    rerender(<Autocomplete aria-label="Search docs" suggestions={suggestions} error />);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.closest('.zest-autocomplete')).toHaveAttribute('data-error');
  });

  it('lets a consumer aria-invalid win over the error prop', () => {
    render(
      <Autocomplete aria-label="Search docs" suggestions={suggestions} error aria-invalid={false} />
    );
    expect(screen.getByRole('combobox', { name: 'Search docs' })).toHaveAttribute(
      'aria-invalid',
      'false'
    );
  });

  it('applies size, fullWidth and className to the field and forwards the ref to the input', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(
      <Autocomplete
        ref={ref}
        aria-label="Search docs"
        suggestions={suggestions}
        size="sm"
        fullWidth
        className="mine"
      />
    );
    const field = ref.current?.closest('.zest-autocomplete');
    expect(ref.current).toBe(screen.getByRole('combobox', { name: 'Search docs' }));
    expect(field).toHaveClass('mine');
    expect(field).toHaveAttribute('data-size', 'sm');
    expect(field).toHaveAttribute('data-full-width');
  });

  it('respects disabled', () => {
    render(<Autocomplete aria-label="Search docs" suggestions={suggestions} disabled />);
    expect(screen.getByRole('combobox', { name: 'Search docs' })).toBeDisabled();
  });
});
