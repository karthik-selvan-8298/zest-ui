import * as React from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/tokens/fonts';
import '../src/tokens/css/tokens.css';
import { ZestProvider } from '../src/theme';

const withZest: Decorator = (Story, context) => {
  const mode = (context.globals.mode as 'light' | 'dark') ?? 'light';
  return (
    <ZestProvider mode={mode} storageKey={null}>
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
  },
  initialGlobals: {
    mode: 'light',
  },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
  },
};

export default preview;
