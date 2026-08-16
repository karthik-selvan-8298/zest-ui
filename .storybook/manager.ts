import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

/* Zest-branded manager UI — violet-forward, grey-neutral, matching the
   library's own tokens (see src/tokens/css/tokens.css). */
const zestTheme = create({
  base: 'light',

  brandTitle: 'Zest UI',
  brandTarget: '_self',

  colorPrimary: '#662ced',
  colorSecondary: '#662ced',

  // UI chrome
  appBg: '#f9fafb',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#dfe3e8',
  appBorderRadius: 12,

  // Typography
  fontBase: "'Roboto', system-ui, -apple-system, sans-serif",
  fontCode: "ui-monospace, 'SF Mono', 'Cascadia Code', monospace",

  // Text
  textColor: '#1c252e',
  textInverseColor: '#ffffff',
  textMutedColor: '#637381',

  // Toolbar
  barTextColor: '#637381',
  barSelectedColor: '#662ced',
  barHoverColor: '#662ced',
  barBg: '#ffffff',

  // Form inputs in the addons panel
  inputBg: '#ffffff',
  inputBorder: '#dfe3e8',
  inputTextColor: '#1c252e',
  inputBorderRadius: 8,
});

addons.setConfig({
  theme: zestTheme,
});
