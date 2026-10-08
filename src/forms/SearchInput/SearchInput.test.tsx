import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('clears the text and returns focus to the input', async () => {
    const onValueChange = vi.fn();
    const ref = React.createRef<HTMLInputElement>();
    render(<SearchInput ref={ref} aria-label="Search" onValueChange={onValueChange} />);
    const input = screen.getByRole('searchbox', { name: 'Search' });
    expect(ref.current).toBe(input);
    await userEvent.type(input, 'zest');
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('');
  });
});
