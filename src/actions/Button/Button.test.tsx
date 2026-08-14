import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders its label', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('defaults to type="button"', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('fires onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('is disabled and busy while loading', () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('maps alias variants to solid + tone', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'solid');
    expect(button).toHaveAttribute('data-accent', 'error');
  });

  it('renders an anchor when href is provided', () => {
    render(<Button href="/docs">Docs</Button>);
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
  });

  it('supports keyboard activation', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole('button');
    button.focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
