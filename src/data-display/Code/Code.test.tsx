import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as React from 'react';
import { Code } from './Code';

describe('Code', () => {
  it('renders a <code> element with default tone/variant/size', () => {
    render(<Code>npm run build</Code>);
    const code = screen.getByText('npm run build');
    expect(code.tagName).toBe('CODE');
    expect(code).toHaveClass('zest-code');
    expect(code).toHaveAttribute('data-accent', 'neutral');
    expect(code).toHaveAttribute('data-variant', 'soft');
    expect(code).toHaveAttribute('data-size', 'md');
    expect(code).not.toHaveAttribute('data-truncate');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('stamps color, variant, size and truncate', () => {
    render(
      <Code color="primary" variant="outlined" size="sm" truncate>
        GET /v1
      </Code>
    );
    const code = screen.getByText('GET /v1');
    expect(code).toHaveAttribute('data-accent', 'primary');
    expect(code).toHaveAttribute('data-variant', 'outlined');
    expect(code).toHaveAttribute('data-size', 'sm');
    expect(code).toHaveAttribute('data-truncate');
  });

  it('copyable renders a button that copies the text and flips to Copied for 1.5s', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<Code copyable>sk_live_123</Code>);

    const button = screen.getByRole('button', { name: 'sk_live_123' });
    expect(button).toHaveAttribute('title', 'Copy to clipboard');
    expect(button).toHaveClass('zest-focusable');

    await userEvent.click(button);
    expect(writeText).toHaveBeenCalledWith('sk_live_123');
    expect(button).toHaveAttribute('title', 'Copied');
    expect(button).toHaveAttribute('data-copied');

    await waitFor(() => expect(button).toHaveAttribute('title', 'Copy to clipboard'), {
      timeout: 3000,
    });
    expect(button).not.toHaveAttribute('data-copied');
  });

  it('flattens nested children to text for the clipboard and respects preventDefault', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <>
        <Code copyable>
          <span>GET</span> /users/<em>{42}</em>
        </Code>
        <Code copyable onClick={onClick}>
          blocked
        </Code>
      </>
    );
    const [nested] = screen.getAllByRole('button');
    await userEvent.click(nested!);
    expect(writeText).toHaveBeenCalledWith('GET /users/42');

    await userEvent.click(screen.getByRole('button', { name: 'blocked' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledTimes(1);
  });
});
