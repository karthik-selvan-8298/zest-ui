import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Flex } from './Flex';
import { Stack } from '../Stack/Stack';

function renderRoot(ui: React.ReactElement) {
  const { container } = render(ui);
  return container.firstElementChild as HTMLElement;
}

describe('Flex', () => {
  it('keeps its own layout props', () => {
    const el = renderRoot(<Flex gap={2} align="center" justify="between" wrap inline grow />);
    expect(el).toHaveClass('zest-flex');
    expect(el.style.gap).toBe('var(--zest-space-2)');
    expect(el.style.alignItems).toBe('center');
    expect(el.style.justifyContent).toBe('space-between');
    expect(el.style.flexWrap).toBe('wrap');
    expect(el.style.display).toBe('inline-flex');
    expect(el.style.flex).toBe('1 1 0%');
  });

  it('accepts Box spacing props and emits padding tokens', () => {
    // jsdom drops the `padding` shorthand when its value is a var(), so read
    // the markup React emits for `p` and the live style for the longhands.
    expect(renderToStaticMarkup(<Flex p={4} />)).toContain('padding:var(--zest-space-4)');
    const el = renderRoot(<Flex p={4} mx={2} pt={0} />);
    expect(el.style.marginInline).toBe('var(--zest-space-2)');
    expect(el.style.paddingTop).toBe('0px');
    expect(el).not.toHaveAttribute('p');
    expect(el).not.toHaveAttribute('mx');
  });

  it('accepts Box sizing props; explicit flex overrides grow', () => {
    const el = renderRoot(
      <Flex grow flex="0 0 auto" minWidth={0} maxWidth={320} overflow="auto" />
    );
    expect(el.style.flex).toBe('0 0 auto');
    expect(el.style.minWidth).toBe('0px');
    expect(el.style.maxWidth).toBe('320px');
    expect(el.style.overflow).toBe('auto');
  });

  it('`style` still wins over shorthands', () => {
    const el = renderRoot(<Flex p={4} style={{ padding: '1px' }} />);
    expect(el.style.padding).toBe('1px');
  });

  it('Stack inherits the shorthands through Flex', () => {
    expect(renderToStaticMarkup(<Stack p={3} />)).toContain('padding:var(--zest-space-3)');
    const el = renderRoot(<Stack pt={3} minWidth={0} spacing={1} />);
    expect(el.style.paddingTop).toBe('var(--zest-space-3)');
    expect(el.style.minWidth).toBe('0px');
    expect(el.style.gap).toBe('var(--zest-space-1)');
    expect(el.style.flexDirection).toBe('column');
  });
});
