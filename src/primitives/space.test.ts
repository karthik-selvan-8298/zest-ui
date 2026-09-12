import { describe, expect, it } from 'vitest';
import { resolveSpace } from './space';

describe('resolveSpace', () => {
  it('maps steps to tokens and other numbers to multiples of the base step', () => {
    expect(resolveSpace(4)).toBe('var(--zest-space-4)');
    expect(resolveSpace(1.5)).toBe('calc(var(--zest-space-1) * 1.5)');
    expect(resolveSpace(7)).toBe('calc(var(--zest-space-1) * 7)');
    expect(resolveSpace(0)).toBe('0');
    expect(resolveSpace('2rem')).toBe('2rem');
    expect(resolveSpace(undefined)).toBeUndefined();
  });
  it('fails loudly on NaN', () => {
    expect(() => resolveSpace(Number.NaN)).toThrow(TypeError);
  });
});
