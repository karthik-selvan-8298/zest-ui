import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Box, resolveBoxStyle, type BoxStyleProps } from './Box';

describe('resolveBoxStyle', () => {
  it('returns undefined style and untouched rest when no shorthand is set', () => {
    const input: BoxStyleProps & { id: string; 'data-foo': string } = {
      id: 'x',
      'data-foo': 'bar',
    };
    const { style, rest } = resolveBoxStyle(input);
    expect(style).toBeUndefined();
    expect(rest).toEqual({ id: 'x', 'data-foo': 'bar' });
  });

  it('maps spacing steps to tokens and strips them from rest', () => {
    const input: BoxStyleProps & { id: string } = { p: 4, mx: 2, mt: 0, pb: '1rem', id: 'keep' };
    const { style, rest } = resolveBoxStyle(input);
    expect(style).toEqual({
      padding: 'var(--zest-space-4)',
      marginInline: 'var(--zest-space-2)',
      marginTop: '0',
      paddingBottom: '1rem',
    });
    expect(rest).toEqual({ id: 'keep' });
  });

  it('resolves flex shorthands', () => {
    expect(resolveBoxStyle({ flex: true }).style).toEqual({ flex: '1 1 0%' });
    expect(resolveBoxStyle({ flex: 2 }).style).toEqual({ flex: 2 });
    expect(resolveBoxStyle({ flex: '0 0 auto' }).style).toEqual({ flex: '0 0 auto' });
    expect(resolveBoxStyle({ flex: false }).style).toBeUndefined();
    expect(resolveBoxStyle({ grow: true, shrink: false }).style).toEqual({
      flexGrow: 1,
      flexShrink: 0,
    });
  });

  it('converts numeric sizes to px and passes strings through', () => {
    const { style } = resolveBoxStyle({
      width: 240,
      height: '100%',
      minWidth: 0,
      minHeight: 48,
      maxWidth: '40rem',
      maxHeight: 360,
      overflow: 'auto',
    });
    expect(style).toEqual({
      width: '240px',
      height: '100%',
      minWidth: '0px',
      minHeight: '48px',
      maxWidth: '40rem',
      maxHeight: '360px',
      overflow: 'auto',
    });
  });
});

describe('Box', () => {
  it('renders a div with the zest-box class by default', () => {
    const { container } = render(<Box>hi</Box>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveClass('zest-box');
    expect(el).not.toHaveAttribute('style');
  });

  it('applies spacing and sizing props as inline style, with `style` winning', () => {
    const { container } = render(
      <Box as="section" p={4} minWidth={0} flex style={{ padding: '3px' }} data-x="1" />
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe('SECTION');
    expect(el.style.padding).toBe('3px');
    expect(el.style.minWidth).toBe('0px');
    expect(el.style.flex).toBe('1 1 0%');
    expect(el).toHaveAttribute('data-x', '1');
    expect(el).not.toHaveAttribute('p');
    expect(el).not.toHaveAttribute('flex');
  });
});
