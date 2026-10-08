/** Serializes a CSS-variable map into a declaration list: `--a: 1; --b: 2;`. */
export function cssDeclarations(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
}
