export type ClassValue = string | number | null | undefined | false | Record<string, boolean>;

/**
 * Tiny className combiner (clsx-compatible subset, zero deps).
 */
export function cx(...values: ClassValue[]): string {
  let out = '';
  for (const value of values) {
    if (!value && value !== 0) continue;
    if (typeof value === 'string' || typeof value === 'number') {
      out += (out ? ' ' : '') + value;
    } else if (typeof value === 'object') {
      for (const key of Object.keys(value)) {
        if (value[key]) out += (out ? ' ' : '') + key;
      }
    }
  }
  return out;
}
