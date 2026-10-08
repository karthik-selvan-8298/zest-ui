/**
 * Spacing prop value: a Zest space step (1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 →
 * `--zest-space-*`), any other number as a multiple of the 4px base step
 * (`1.5` → 6px, `7` → 28px), or any CSS length string.
 */
export type SpaceValue = number | (string & {});

/** Steps that have a dedicated `--zest-space-*` token in tokens.css. */
const STEPS = new Set([1, 2, 3, 4, 5, 6, 8, 10, 12, 16]);

/**
 * Converts a {@link SpaceValue} into a CSS value: `4` → `var(--zest-space-4)`,
 * `7` → `calc(var(--zest-space-1) * 7)`, `'2rem'` → `'2rem'`.
 * Throws on `NaN` so a broken computation surfaces instead of silently
 * dropping the spacing.
 */
export function resolveSpace(value: SpaceValue | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'string') return value;
  if (Number.isNaN(value)) {
    throw new TypeError('Zest spacing: received NaN — pass a step number or a CSS length.');
  }
  if (value === 0) return '0';
  if (STEPS.has(value)) return `var(--zest-space-${value})`;
  return `calc(var(--zest-space-1) * ${value})`;
}
