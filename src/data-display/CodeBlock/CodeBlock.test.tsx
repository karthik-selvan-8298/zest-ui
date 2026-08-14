import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CodeBlock } from './CodeBlock';

describe('CodeBlock', () => {
  it('renders the code and language label', () => {
    render(<CodeBlock language="bash" code="echo hi" />);
    expect(screen.getByText('echo hi')).toBeInTheDocument();
    expect(screen.getByText('BASH')).toBeInTheDocument();
  });

  it('copies the code and flips to Copied', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const onCopy = vi.fn();
    render(<CodeBlock language="bash" code="echo hi" onCopy={onCopy} />);
    await userEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    expect(writeText).toHaveBeenCalledWith('echo hi');
    expect(onCopy).toHaveBeenCalledWith('echo hi');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('hides the copy button with hideCopy', () => {
    render(<CodeBlock language="bash" code="echo hi" hideCopy />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies the maxHeight for inner scrolling', () => {
    const { container } = render(<CodeBlock code="line" maxHeight={200} />);
    expect(container.querySelector('.zest-code-block__pre')).toHaveStyle({ maxHeight: '200px' });
  });
});
