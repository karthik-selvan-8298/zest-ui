import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './TextField';

describe('TextField', () => {
  it('associates the label with the input', () => {
    render(<TextField label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(<TextField label="Email" helperText="Work email only" />);
    expect(screen.getByText('Work email only')).toBeInTheDocument();
  });

  it('renders error text instead of helper text', () => {
    render(<TextField label="Email" helperText="Helper" errorText="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
  });

  it('accepts typed input', async () => {
    render(<TextField label="Name" />);
    const input = screen.getByLabelText('Name');
    await userEvent.type(input, 'Zest');
    expect(input).toHaveValue('Zest');
  });

  it('disables the input', () => {
    render(<TextField label="Name" disabled />);
    expect(screen.getByLabelText('Name')).toBeDisabled();
  });
});
