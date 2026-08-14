import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

function renderSkeleton(ui: ReactElement) {
  const { container } = render(ui);
  const el = container.querySelector('.zest-skeleton');
  expect(el).not.toBeNull();
  return el as HTMLElement;
}

describe('Skeleton', () => {
  it('defaults to the text variant with a pulse animation', () => {
    const el = renderSkeleton(<Skeleton />);
    expect(el).toHaveAttribute('data-variant', 'text');
    expect(el).toHaveAttribute('data-animation', 'pulse');
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(['text', 'circular', 'rectangular', 'rounded'] as const)(
    'renders the %s variant with the matching data attribute',
    (variant) => {
      const el = renderSkeleton(<Skeleton variant={variant} />);
      expect(el).toHaveAttribute('data-variant', variant);
    }
  );

  it('sets the wave animation attribute', () => {
    const el = renderSkeleton(<Skeleton animation="wave" />);
    expect(el).toHaveAttribute('data-animation', 'wave');
  });

  it('omits the animation attribute when animation is false', () => {
    const el = renderSkeleton(<Skeleton animation={false} />);
    expect(el).not.toHaveAttribute('data-animation');
  });

  it('applies numeric width and height as pixel styles', () => {
    const el = renderSkeleton(<Skeleton variant="circular" width={40} height={40} />);
    expect(el).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('applies string width and height as-is', () => {
    const el = renderSkeleton(<Skeleton width="60%" height="1.5rem" />);
    expect(el).toHaveStyle({ width: '60%' });
    // jsdom ≥30 computes rem to px in toHaveStyle — assert the raw inline style.
    expect((el as HTMLElement).style.height).toBe('1.5rem');
  });

  it('merges a custom className', () => {
    const el = renderSkeleton(<Skeleton className="custom" />);
    expect(el).toHaveClass('zest-skeleton', 'custom');
  });
});
