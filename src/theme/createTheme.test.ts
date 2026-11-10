import { describe, expect, it } from 'vitest';
import { createTheme } from './createTheme';

describe('createTheme', () => {
  it('returns empty variable maps for an empty theme', () => {
    const theme = createTheme();
    expect(theme.cssVars).toEqual({});
    expect(theme.darkCssVars).toEqual({});
    expect(theme.options).toEqual({});
  });

  it('maps tone and surface colors onto the semantic color variables', () => {
    const { cssVars } = createTheme({
      colors: {
        primary: {
          main: '#0e9f6e',
          hover: '#057a55',
          active: '#046c4e',
          contrast: '#fff',
          subtleText: '#03543f',
        },
        background: '#fafafa',
        textPrimary: '#111',
        focusRing: '#0e9f6e',
      },
    });
    expect(cssVars).toEqual({
      '--zest-color-primary': '#0e9f6e',
      '--zest-color-primary-hover': '#057a55',
      '--zest-color-primary-active': '#046c4e',
      '--zest-color-primary-contrast': '#fff',
      '--zest-color-primary-subtle-text': '#03543f',
      '--zest-color-background': '#fafafa',
      '--zest-color-text-primary': '#111',
      '--zest-color-focus-ring': '#0e9f6e',
    });
  });

  it('keeps dark overrides in their own map', () => {
    const theme = createTheme({
      colors: { surface: '#fff' },
      darkColors: { surface: '#111', error: { main: '#ff8a80' } },
      darkCssVars: { '--zest-shadow-card': 'none' },
    });
    expect(theme.cssVars).toEqual({ '--zest-color-surface': '#fff' });
    expect(theme.darkCssVars).toEqual({
      '--zest-color-surface': '#111',
      '--zest-color-error': '#ff8a80',
      '--zest-shadow-card': 'none',
    });
  });

  it('maps typography and radius', () => {
    const { cssVars } = createTheme({
      typography: { fontFamily: 'Inter, sans-serif', fontFamilyMono: 'Fira Code, monospace' },
      radius: { sm: '4px', md: '8px' },
    });
    expect(cssVars).toEqual({
      '--zest-font-family-sans': 'Inter, sans-serif',
      '--zest-font-family-mono': 'Fira Code, monospace',
      '--zest-radius-sm': '4px',
      '--zest-radius-md': '8px',
    });
  });

  it('skips radius entries that are undefined instead of emitting "undefined"', () => {
    const { cssVars } = createTheme({ radius: { sm: undefined, md: '8px' } });
    // Strict: `toEqual` would treat a key holding `undefined` as absent.
    expect(cssVars).toStrictEqual({ '--zest-radius-md': '8px' });
  });

  it('lets raw cssVars win over the derived values', () => {
    const { cssVars } = createTheme({
      colors: { primary: { main: '#0e9f6e' } },
      cssVars: { '--zest-color-primary': 'rebeccapurple', '--zest-button-height-md': '40px' },
    });
    expect(cssVars).toEqual({
      '--zest-color-primary': 'rebeccapurple',
      '--zest-button-height-md': '40px',
    });
  });

  it('keeps the options the theme was created from', () => {
    const options = { radius: { lg: '16px' } };
    expect(createTheme(options).options).toBe(options);
  });
});
