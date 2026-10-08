import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as React from 'react';
import { AspectRatio } from './AspectRatio';

describe('AspectRatio', () => {
  it('renders a div with the zest-aspect-ratio class and a 16:9 default ratio', () => {
    const { container } = render(<AspectRatio>media</AspectRatio>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveClass('zest-aspect-ratio');
    // jsdom normalizes `aspect-ratio` (`1.77 / 1`), so assert on the emitted markup.
    expect(renderToStaticMarkup(<AspectRatio />)).toContain(`aspect-ratio:${16 / 9}`);
  });

  it('applies the ratio prop, merges className/style and forwards refs', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <AspectRatio ref={ref} ratio={1} className="custom" style={{ width: '200px' }} data-x="1" />
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.aspectRatio).toBe('1 / 1');
    expect(el.style.width).toBe('200px');
    expect(el).toHaveClass('zest-aspect-ratio', 'custom');
    expect(el).toHaveAttribute('data-x', '1');
    expect(ref.current).toBe(el);
  });

  it('lets `style` override the ratio', () => {
    const { container } = render(<AspectRatio ratio={2} style={{ aspectRatio: '3 / 1' }} />);
    expect((container.firstElementChild as HTMLElement).style.aspectRatio).toBe('3 / 1');
  });
});
