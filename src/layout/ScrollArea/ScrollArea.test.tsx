import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  it('applies size constraints and merges an object style', () => {
    const { container } = render(
      <ScrollArea maxHeight={120} style={{ color: 'red' }}>
        content
      </ScrollArea>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('zest-scroll-area');
    expect(root.style.maxHeight).toBe('120px');
    expect(root.style.color).toBe('red');
  });

  it('keeps supporting Base UI function styles', () => {
    const { container } = render(
      <ScrollArea maxWidth="50%" style={() => ({ color: 'blue' })}>
        content
      </ScrollArea>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.maxWidth).toBe('50%');
    expect(root.style.color).toBe('blue');
  });
});
