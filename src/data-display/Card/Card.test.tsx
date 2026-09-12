import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders the elevated variant by default without fullHeight', () => {
    const { container } = render(<Card>Body</Card>);
    const root = container.querySelector('.zest-card') as HTMLElement;
    expect(root).toHaveAttribute('data-variant', 'elevated');
    expect(root).not.toHaveAttribute('data-full-height');
  });

  it('stamps data-full-height and data-scroll', () => {
    const { container } = render(
      <Card fullHeight variant="outlined" data-testid="card">
        <Card.Header title="Title" />
        <Card.Content scroll>Long</Card.Content>
        <Card.Footer>Foot</Card.Footer>
      </Card>
    );
    const root = screen.getByTestId('card');
    expect(root).toHaveAttribute('data-full-height', '');
    expect(root).toHaveAttribute('data-variant', 'outlined');
    const content = container.querySelector('.zest-card__content') as HTMLElement;
    expect(content).toHaveAttribute('data-scroll', '');
    expect(content).toHaveTextContent('Long');
  });

  it('Card.Content omits data-scroll by default and merges className', () => {
    const { container } = render(<Card.Content className="extra">Body</Card.Content>);
    const content = container.querySelector('.zest-card__content') as HTMLElement;
    expect(content).not.toHaveAttribute('data-scroll');
    expect(content).toHaveClass('extra');
  });
});
