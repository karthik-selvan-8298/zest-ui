import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Image } from './Image';

describe('Image', () => {
  it('renders a lazy-loading img with its alt text', () => {
    render(<Image src="/a.png" alt="Team photo" fit="contain" />);
    const img = screen.getByRole('img', { name: 'Team photo' });
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('data-fit', 'contain');
  });

  it('swaps in the fallback on error and keeps the accessible name', () => {
    render(<Image src="/broken.png" alt="Team photo" fallback="Unavailable" />);
    fireEvent.error(screen.getByRole('img'));
    const fallback = screen.getByRole('img', { name: 'Team photo' });
    expect(fallback.tagName).toBe('SPAN');
    expect(fallback).toHaveTextContent('Unavailable');
  });

  it('hides the fallback of a decorative image from assistive tech', () => {
    const { container } = render(<Image src="/broken.png" alt="" />);
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('.zest-image__fallback')).toHaveAttribute('aria-hidden', 'true');
  });

  it('retries when src changes after a failure', () => {
    const { rerender } = render(<Image src="/broken.png" alt="Logo" />);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByRole('img').tagName).toBe('SPAN');
    rerender(<Image src="/fixed.png" alt="Logo" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/fixed.png');
  });

  it('wraps the image in a ratio frame', () => {
    const { container } = render(<Image src="/a.png" alt="" ratio={2} />);
    const frame = container.firstElementChild as HTMLElement;
    expect(frame).toHaveClass('zest-image__frame');
    expect(frame.style.aspectRatio).toMatch(/^2\b/);
  });
});
