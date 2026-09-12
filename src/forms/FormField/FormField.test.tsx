import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FieldError, FormField, HelperText, Label } from './FormField';
import { Input } from '../Input/Input';

describe('FormField parts', () => {
  it('Label renders a plain <label> outside a FormField instead of throwing', () => {
    render(<Label required>Filter</Label>);
    const label = screen.getByText('Filter');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveClass('zest-label');
    expect(label.querySelector('.zest-label__asterisk')).not.toBeNull();
  });

  it('HelperText and FieldError render standalone', () => {
    render(
      <>
        <HelperText>Hint</HelperText>
        <FieldError>Broken</FieldError>
      </>
    );
    expect(screen.getByText('Hint').tagName).toBe('P');
    expect(screen.getByText('Broken')).toHaveAttribute('role', 'alert');
  });

  it('inside a FormField the label is wired to the control', () => {
    render(
      <FormField>
        <Label>Email</Label>
        <Input />
      </FormField>
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });
});
