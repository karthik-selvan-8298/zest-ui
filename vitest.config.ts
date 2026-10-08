import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.stories.tsx',
        'src/**/*.test.{ts,tsx}',
        'src/**/index.ts',
        'src/index.ts',
        'src/test-setup.ts',
        'src/stories/**',
        'src/tokens/**',
        'src/icons/icons.tsx',
      ],
      // Ratchet these up as coverage grows — never down. Last measured
      // 2026-10-08: statements 67 / branches 60 / functions 66 / lines 68.
      thresholds: {
        statements: 65,
        branches: 58,
        functions: 64,
        lines: 65,
      },
    },
  },
});
