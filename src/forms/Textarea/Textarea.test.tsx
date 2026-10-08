import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';
import { FormField, HelperText, Label } from '../FormField/FormField';

describe('Textarea', () => {
  it('renders a textarea with 3 rows by default', () => {
    render(<Textarea aria-label="Notes" />);
    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '3');
  });

  it('accepts typed input', async () => {
    render(<Textarea aria-label="Notes" />);
    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    await userEvent.type(textarea, 'Hello');
    expect(textarea).toHaveValue('Hello');
  });

  it('is labelled and described by a surrounding FormField', () => {
    render(
      <FormField invalid>
        <Label>Notes</Label>
        <Textarea />
        <HelperText>Markdown supported</HelperText>
      </FormField>
    );
    const textarea = screen.getByLabelText('Notes');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAccessibleDescription('Markdown supported');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-invalid from the error prop', () => {
    render(<Textarea aria-label="Notes" error />);
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveAttribute('aria-invalid', 'true');
  });
});
