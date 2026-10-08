import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DetailHeader } from './DetailHeader';

describe('DetailHeader', () => {
  it('renders the title as the page h1 inside a <header>', () => {
    const { container } = render(<DetailHeader title="Payments service" className="extra" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Payments service' })).toBeInTheDocument();
    const root = container.querySelector('header');
    expect(root).toHaveClass('zest-detail-header', 'extra');
  });

  it('renders only the slots that are provided', () => {
    const { container, rerender } = render(<DetailHeader title="Title" />);
    expect(container.querySelector('.zest-detail-header__breadcrumbs')).not.toBeInTheDocument();
    expect(container.querySelector('.zest-detail-header__subtitle')).not.toBeInTheDocument();
    expect(container.querySelector('.zest-detail-header__media')).not.toBeInTheDocument();
    expect(container.querySelector('.zest-detail-header__actions')).not.toBeInTheDocument();

    rerender(
      <DetailHeader
        title="Title"
        subtitle="Production"
        breadcrumbs={<nav>Crumbs</nav>}
        media={<span>Logo</span>}
        actions={<button type="button">Deploy</button>}
      />
    );
    expect(screen.getByText('Production')).toHaveClass('zest-detail-header__subtitle');
    expect(screen.getByText('Crumbs').parentElement).toHaveClass('zest-detail-header__breadcrumbs');
    expect(screen.getByText('Logo').parentElement).toHaveClass('zest-detail-header__media');
    expect(screen.getByRole('button', { name: 'Deploy' }).parentElement).toHaveClass(
      'zest-detail-header__actions'
    );
  });
});
