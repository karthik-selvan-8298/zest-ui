import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

/* Zest-branded manager UI — violet-forward, slate-neutral, matching the
   library's own tokens (see src/tokens/css/tokens.css). */
const zestTheme = create({
  base: 'light',

  brandTitle: 'Zest UI',
  brandTarget: '_self',

  colorPrimary: '#662ced',
  colorSecondary: '#662ced',

  // UI chrome
  appBg: '#f8fafc',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e2e8f0',
  appBorderRadius: 12,

  // Typography
  fontBase: "'Roboto', system-ui, -apple-system, sans-serif",
  fontCode: "ui-monospace, 'SF Mono', 'Cascadia Code', monospace",

  // Text
  textColor: '#0f172a',
  textInverseColor: '#ffffff',
  textMutedColor: '#64748b',

  // Toolbar
  barTextColor: '#64748b',
  barSelectedColor: '#662ced',
  barHoverColor: '#662ced',
  barBg: '#ffffff',

  // Form inputs in the addons panel
  inputBg: '#ffffff',
  inputBorder: '#e2e8f0',
  inputTextColor: '#0f172a',
  inputBorderRadius: 8,
});

addons.setConfig({
  theme: zestTheme,
});
