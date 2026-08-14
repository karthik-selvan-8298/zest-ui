/** Spacing prop value: a Zest space step (maps to --zest-space-*) or any CSS length. */
export type SpaceValue = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | (string & {}) | 0;

export function resolveSpace(value: SpaceValue | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (value === 0) return '0';
  if (typeof value === 'number') return `var(--zest-space-${value})`;
  return value;
}
