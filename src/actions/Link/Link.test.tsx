import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { Link } from './Link';

/* Stand-in for a router link (react-router / Next both fit this shape). */
const FakeRouterLink = React.forwardRef<HTMLAnchorElement, { to: string } & React.ComponentProps<'a'>>(
  function FakeRouterLink({ to, children, ...props }, ref) {
    return (
      <a ref={ref} href={to} data-router-link="" {...props}>
        {children}
      </a>
    );
  }
);

describe('Link', () => {
  it('renders a plain anchor for external URLs', () => {
    render(
      <Link href="https://example.com" external>
        Docs
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders a router link for internal routing via `as`', () => {
    render(
      <Link as={FakeRouterLink} to="/settings">
        Settings
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).toHaveAttribute('href', '/settings');
    expect(link).toHaveAttribute('data-router-link');
    expect(link).toHaveClass('zest-link');
  });

  it('does not add target/rel without external', () => {
    render(<Link href="/pricing">Pricing</Link>);
    const link = screen.getByRole('link', { name: 'Pricing' });
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });
});
