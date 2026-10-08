import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('anchors a count to its child at the top-right by default', () => {
    const { container } = render(
      <Badge count={5}>
        <span>Inbox</span>
      </Badge>
    );
    const indicator = screen.getByText('5');
    expect(indicator).toHaveAttribute('data-position', 'top-right');
    expect(indicator).toHaveAttribute('data-accent', 'error');
    expect(container.querySelector('.zest-badge')).not.toHaveAttribute('data-standalone');
  });

  it('renders "max+" above max', () => {
    render(<Badge count={120} max={99} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('marks standalone usage and leaves the indicator unpositioned', () => {
    const { container } = render(<Badge count={3} />);
    expect(container.querySelector('.zest-badge')).toHaveAttribute('data-standalone', '');
    expect(screen.getByText('3')).not.toHaveAttribute('data-position');
  });

  it('hides a zero count unless showZero', () => {
    const { container, rerender } = render(<Badge count={0} />);
    expect(container.querySelector('.zest-badge__indicator')).not.toBeInTheDocument();
    rerender(<Badge count={0} showZero />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders an empty dot', () => {
    const { container } = render(<Badge dot count={7} />);
    const indicator = container.querySelector('.zest-badge__indicator');
    expect(indicator).toHaveAttribute('data-dot', '');
    expect(indicator).toBeEmptyDOMElement();
  });
});
