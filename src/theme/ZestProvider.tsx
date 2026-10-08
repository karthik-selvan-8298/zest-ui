import * as React from 'react';
import '../tokens/fonts';
import '../tokens/css/tokens.css';
import { cssDeclarations } from './cssText';
import type { ZestTheme } from './types';

/** Appearance mode. `system` follows the OS `prefers-color-scheme`. */
export type ZestMode = 'light' | 'dark' | 'system';

/** localStorage key under which ZestProvider persists the chosen mode. */
export const ZEST_MODE_STORAGE_KEY = 'zest-mode';
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
  /** Changes the mode (and persists it when `storageKey` is set). */
  setMode: (mode: ZestMode) => void;
  /** Active layout/type density. */
  density: ZestDensity;
  setDensity: (density: ZestDensity) => void;
  /** The `theme` passed to the provider, if any. */
  theme: ZestTheme | undefined;
}

const ZestContext = React.createContext<ZestContextValue | null>(null);

export interface ZestProviderProps {
  /** App-wide token overrides from `createTheme(...)`. */
  theme?: ZestTheme;
  /** Initial appearance mode. Defaults to 'system'. */
  defaultMode?: ZestMode;
  /** Controlled appearance mode. */
  mode?: ZestMode;
  /** Called whenever `setMode` runs, in both controlled and uncontrolled use. */
  onModeChange?: (mode: ZestMode) => void;
  /** Initial density. Defaults to 'comfortable'. */
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

/** Global stylesheet for a provider-level theme (mirrors the tokens.css selectors). */
function themeStyleText(theme: ZestTheme): string {
  const light = cssDeclarations(theme.cssVars);
  const dark = cssDeclarations(theme.darkCssVars);
  let css = '';
  if (light) css += `:root, [data-zest-theme='light'] { ${light} }\n`;
  if (dark) {
    css += `:root[data-zest-theme='dark'] { ${dark} }\n`;
    css += `@media (prefers-color-scheme: dark) { :root:not([data-zest-theme='light']):not([data-zest-theme='dark']) { ${dark} } }\n`;
  }
  return css;
}

/**
 * Applies the Zest tokens, theme overrides, appearance mode, and density to
 * the document. Wrap your application root with it.
 *
 * ```tsx
 * <ZestProvider defaultMode="system" theme={createTheme({ radius: { md: '8px' } })}>
 *   <App />
 * </ZestProvider>
 * ```
 */
export function ZestProvider({
  theme,
  defaultMode = 'system',
  mode: controlledMode,
  onModeChange,
  defaultDensity = 'comfortable',
  storageKey = ZEST_MODE_STORAGE_KEY,
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

  // Stamp attributes on <html>:
  //   data-zest-theme = the RESOLVED appearance ('light' | 'dark'), also in
  //                     system mode, so app CSS can target the active theme
  //                     without repeating the prefers-color-scheme query;
  //   data-zest-mode  = the requested mode ('light' | 'dark' | 'system').
  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-zest-theme', mode === 'system' ? systemMode : mode);
    root.setAttribute('data-zest-mode', mode);
    if (density === 'comfortable') root.removeAttribute('data-zest-density');
    else root.setAttribute('data-zest-density', density);
    return () => {
      root.removeAttribute('data-zest-theme');
      root.removeAttribute('data-zest-mode');
      root.removeAttribute('data-zest-density');
    };
  }, [mode, systemMode, density]);

  // Document-level base styles (font, scrollbars) for the provider's lifetime.
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.add('zest-root');
    return () => root.classList.remove('zest-root');
  }, []);

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

/**
 * Convenience hook for appearance switching.
 *
 * ```tsx
 * const { resolvedMode, setMode } = useColorScheme();
 * <Button onClick={() => setMode(resolvedMode === 'dark' ? 'light' : 'dark')}>Toggle</Button>
 * ```
 */
export function useColorScheme(): Pick<ZestContextValue, 'mode' | 'resolvedMode' | 'setMode'> {
  const { mode, resolvedMode, setMode } = useZest();
  return { mode, resolvedMode, setMode };
}
