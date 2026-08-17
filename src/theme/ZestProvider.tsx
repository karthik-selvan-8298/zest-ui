import * as React from 'react';
import '../tokens/fonts';
import '../tokens/css/tokens.css';
import type { ZestTheme } from './types';

export type ZestMode = 'light' | 'dark' | 'system';
/**
 * Layout + type density.
 * - `comfortable` — default; roomy spacing and 16px body text.
 * - `compact`     — shorter controls; body text unchanged.
 * - `dashboard`   — dense-product scale (14px body, 13px secondary, headings
 *   step down one rung each) with compact control heights.
 */
export type ZestDensity = 'comfortable' | 'compact' | 'dashboard';

export interface ZestContextValue {
  /** Requested mode ('system' allowed). */
  mode: ZestMode;
  /** The mode actually in effect after resolving 'system'. */
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ZestMode) => void;
  density: ZestDensity;
  setDensity: (density: ZestDensity) => void;
  theme: ZestTheme | undefined;
}

const ZestContext = React.createContext<ZestContextValue | null>(null);

export interface ZestProviderProps {
  theme?: ZestTheme;
  /** Initial appearance mode. Defaults to 'system'. */
  defaultMode?: ZestMode;
  /** Controlled appearance mode. */
  mode?: ZestMode;
  onModeChange?: (mode: ZestMode) => void;
  defaultDensity?: ZestDensity;
  /**
   * localStorage key used to persist the user's mode choice.
   * Pass `null` to disable persistence.
   */
  storageKey?: string | null;
  children?: React.ReactNode;
}

function getSystemMode(): 'light' | 'dark' {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredMode(key: string | null): ZestMode | undefined {
  if (!key || typeof window === 'undefined') return undefined;
  try {
    const value = window.localStorage.getItem(key);
    return value === 'light' || value === 'dark' || value === 'system' ? value : undefined;
  } catch {
    return undefined;
  }
}

function themeStyleText(theme: ZestTheme): string {
  const light = Object.entries(theme.cssVars)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ');
  const dark = Object.entries(theme.darkCssVars)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ');
  let css = '';
  if (light) css += `:root, [data-zest-theme='light'] { ${light} }\n`;
  if (dark) {
    css += `[data-zest-theme='dark'] { ${dark} }\n`;
    css += `@media (prefers-color-scheme: dark) { :root:not([data-zest-theme='light']):not([data-zest-theme='dark']) { ${dark} } }\n`;
  }
  return css;
}

/**
 * Applies the Zest tokens, theme overrides, appearance mode, and density to
 * the document. Wrap your application root with it.
 */
export function ZestProvider({
  theme,
  defaultMode = 'system',
  mode: controlledMode,
  onModeChange,
  defaultDensity = 'comfortable',
  storageKey = 'zest-mode',
  children,
}: ZestProviderProps) {
  const [uncontrolledMode, setUncontrolledMode] = React.useState<ZestMode>(
    () => readStoredMode(storageKey) ?? defaultMode
  );
  const mode = controlledMode ?? uncontrolledMode;
  const [density, setDensity] = React.useState<ZestDensity>(defaultDensity);
  const [systemMode, setSystemMode] = React.useState<'light' | 'dark'>(getSystemMode);

  // Track OS appearance for `resolvedMode`.
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => setSystemMode(query.matches ? 'dark' : 'light');
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);

  const setMode = React.useCallback(
    (next: ZestMode) => {
      if (controlledMode === undefined) setUncontrolledMode(next);
      if (storageKey && typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(storageKey, next);
        } catch {
          /* storage unavailable */
        }
      }
      onModeChange?.(next);
    },
    [controlledMode, onModeChange, storageKey]
  );

  // Stamp mode + density attributes on <html>.
  React.useEffect(() => {
    const root = document.documentElement;
    if (mode === 'system') root.removeAttribute('data-zest-theme');
    else root.setAttribute('data-zest-theme', mode);
    if (density === 'comfortable') root.removeAttribute('data-zest-density');
    else root.setAttribute('data-zest-density', density);
    root.classList.add('zest-root');
    return () => {
      root.removeAttribute('data-zest-theme');
      root.removeAttribute('data-zest-density');
    };
  }, [mode, density]);

  const value = React.useMemo<ZestContextValue>(
    () => ({
      mode,
      resolvedMode: mode === 'system' ? systemMode : mode,
      setMode,
      density,
      setDensity,
      theme,
    }),
    [mode, systemMode, setMode, density, theme]
  );

  return (
    <ZestContext.Provider value={value}>
      {theme ? (
        // Rendered inline (SSR-safe, no flash) — applies globally like any stylesheet.
        <style
          data-zest-theme-overrides=""
          dangerouslySetInnerHTML={{ __html: themeStyleText(theme) }}
        />
      ) : null}
      {children}
    </ZestContext.Provider>
  );
}

/** Access the active theme, mode, and density. Must be under <ZestProvider>. */
export function useZest(): ZestContextValue {
  const context = React.useContext(ZestContext);
  if (!context) {
    throw new Error('useZest must be used within a <ZestProvider>.');
  }
  return context;
}

/** Convenience hook for appearance switching. */
export function useColorScheme() {
  const { mode, resolvedMode, setMode } = useZest();
  return { mode, resolvedMode, setMode };
}
