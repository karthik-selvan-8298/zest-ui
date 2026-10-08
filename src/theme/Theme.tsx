import * as React from 'react';
import { cx } from '../utils';
import { cssDeclarations } from './cssText';
import type { ZestTheme } from './types';

export interface ThemeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Token overrides for THIS subtree only (from `createTheme(...)`). */
  theme: ZestTheme;
  children?: React.ReactNode;
}

/**
 * Scoped theme — overrides tokens for one subtree without touching the rest
 * of the app. Nestable (inner Themes win). SSR-safe, no runtime injection.
 *
 * ```tsx
 * <Theme theme={createTheme({ colors: { primary: { main: '#0E9F6E' } } })}>
 *   <MarketingSection />   // green primary here…
 * </Theme>
 * // …violet everywhere else
 * ```
 *
 * For app-wide theming prefer plain CSS (`:root { --zest-color-primary: … }`)
 * or the `theme` prop on ZestProvider.
 */
export const Theme = React.forwardRef<HTMLDivElement, ThemeProps>(function Theme(
  { theme, className, children, ...props },
  ref
) {
  // useId output (`:r0:` / `«r0»`) isn't a safe attribute-selector value;
  // strip it down to a stable, SSR-consistent identifier.
  const scopeId = React.useId();
  const scope = `zest-${scopeId.replace(/[^a-zA-Z0-9-]/g, '')}`;

  const light = cssDeclarations(theme.cssVars);
  const dark = cssDeclarations(theme.darkCssVars);

  let css = '';
  if (light) css += `[data-zest-scope='${scope}'] { ${light} }\n`;
  if (dark) {
    css += `[data-zest-theme='dark'] [data-zest-scope='${scope}'], [data-zest-scope='${scope}'][data-zest-theme='dark'] { ${dark} }\n`;
    css += `@media (prefers-color-scheme: dark) { :root:not([data-zest-theme='light']) [data-zest-scope='${scope}'] { ${dark} } }\n`;
  }

  return (
    <div ref={ref} data-zest-scope={scope} className={cx('zest-theme', className)} {...props}>
      {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
      {children}
    </div>
  );
});
