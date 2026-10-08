import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('sets aria-invalid only when error is set', () => {
    render(
      <>
        <Input aria-label="Valid" />
        <Input aria-label="Invalid" error />
      </>
    );
    expect(screen.getByRole('textbox', { name: 'Valid' })).not.toHaveAttribute('aria-invalid');
    expect(screen.getByRole('textbox', { name: 'Invalid' })).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });
});
