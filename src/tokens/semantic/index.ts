import { common, error, gray, grayChannel, info, primary, secondary, success, warning } from '../primitives/colors';

/**
 * Semantic color roles for one appearance (light or dark).
 * Components consume ONLY these (never primitives); themes override these.
 * Keys are the CSS variable names without the `--zest-color-` prefix.
 */
export interface SemanticColors {
  [token: string]: string;
}

const tones = { primary, secondary, success, warning, error, info } as const;
export type ToneName = keyof typeof tones | 'neutral';

function toneTokens(mode: 'light' | 'dark'): SemanticColors {
  const out: SemanticColors = {};
  for (const [name, scale] of Object.entries(tones)) {
    out[name] = scale[500];
    out[`${name}-hover`] = scale[700];
    out[`${name}-active`] = scale[900];
    out[`${name}-contrast`] = name === 'warning' ? gray[800] : common.white;
    // Text/icon color used on subtle (alpha-tinted) backgrounds.
    out[`${name}-subtle-text`] = mode === 'light' ? scale[700] : scale[300];
  }
  // Neutral tone (gray-based) for default chips/badges/buttons.
  out['neutral'] = gray[600];
  out['neutral-hover'] = gray[700];
  out['neutral-active'] = gray[800];
  out['neutral-contrast'] = common.white;
  out['neutral-subtle-text'] = mode === 'light' ? gray[700] : gray[300];
  return out;
}

export const lightColors: SemanticColors = {
  ...toneTokens('light'),
  background: gray[50],
  'background-neutral': gray[200],
  surface: common.white,
  'surface-hover': `rgb(${grayChannel} / 0.08)`,
  'surface-active': `rgb(${grayChannel} / 0.16)`,
  'surface-disabled': `rgb(${grayChannel} / 0.24)`,
  'text-primary': gray[900],
  'text-secondary': gray[600],
  'text-disabled': gray[500],
  border: `rgb(${grayChannel} / 0.2)`,
  'border-subtle': `rgb(${grayChannel} / 0.12)`,
  'border-strong': `rgb(${grayChannel} / 0.32)`,
  backdrop: 'rgb(28 37 46 / 0.48)',
  'focus-ring': primary[500],
};

export const darkColors: SemanticColors = {
  ...toneTokens('dark'),
  background: gray[900],
  'background-neutral': `rgb(${grayChannel} / 0.12)`,
  surface: gray[800],
  'surface-hover': `rgb(${grayChannel} / 0.08)`,
  'surface-active': `rgb(${grayChannel} / 0.16)`,
  'surface-disabled': `rgb(${grayChannel} / 0.24)`,
  'text-primary': common.white,
  'text-secondary': gray[500],
  'text-disabled': gray[600],
  border: `rgb(${grayChannel} / 0.2)`,
  'border-subtle': `rgb(${grayChannel} / 0.12)`,
  'border-strong': `rgb(${grayChannel} / 0.32)`,
  backdrop: 'rgb(28 37 46 / 0.48)',
  'focus-ring': primary[300],
};

/** Shadow channel per mode — the Sigma elevation language. */
export const shadowChannel = {
  light: grayChannel,
  dark: '0 0 0',
} as const;
