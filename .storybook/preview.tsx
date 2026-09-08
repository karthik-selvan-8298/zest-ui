import * as React from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/tokens/fonts';
import '../src/tokens/css/tokens.css';
import { ZestProvider } from '../src/theme';

type Density = 'comfortable' | 'compact' | 'dashboard';

const withZest: Decorator = (Story, context) => {
  const mode = (context.globals.mode as 'light' | 'dark') ?? 'light';
  const density = (context.globals.density as Density) ?? 'comfortable';
  return (
    // `defaultDensity` is initial state — keying on it remounts the provider
    // when the toolbar changes so the whole story re-scales.
    <ZestProvider key={density} mode={mode} defaultDensity={density} storageKey={null}>
      <div
        style={{
          background: 'var(--zest-color-background)',
          color: 'var(--zest-color-text-primary)',
          padding: 24,
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        <Story />
      </div>
    </ZestProvider>
  );
};

const preview: Preview = {
  /* Generate a Docs page (props table + stories) for every component. */
  tags: ['autodocs'],
  decorators: [withZest],
  globalTypes: {
    mode: {
      description: 'Zest appearance mode',
      toolbar: {
        title: 'Mode',
        icon: 'mirror',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
    density: {
      description: 'Zest density (type scale + control heights)',
      toolbar: {
        title: 'Density',
        icon: 'ruler',
        items: ['comfortable', 'compact', 'dashboard'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    mode: 'light',
    density: 'comfortable',
  },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    /* Accessibility addon: 'todo' reports axe violations in the panel and the
       test-runner output without failing stories. Flip to 'error' once the
       remaining axe findings are cleared (mirrors ZEST_A11Y_STRICT in test-runner.ts). */
    a11y: { test: 'todo' },
    options: {
      /* Showcase first, foundations next, then component groups. */
      storySort: {
        order: [
          'Overview',
          ['Introduction', 'Members Page'],
          'Foundation',
          'Layout',
          'Actions',
          'Forms',
          'Date & Time',
          'Navigation',
          'Overlays',
          'Feedback',
          'Data Display',
          'Media',
          'Utilities',
          'Patterns',
        ],
      },
    },
  },
};

export default preview;
