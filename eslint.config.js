// Flat config — https://eslint.org/docs/latest/use/configure/configuration-files
//
// Accessibility linting: eslint-plugin-jsx-a11y does not yet support ESLint 10,
// so a11y is enforced at runtime instead — axe via the Storybook a11y addon,
// axe-playwright in the visual test-runner, and vitest-axe in unit tests.
import tseslint from 'typescript-eslint';
import eslintReact from '@eslint-react/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'storybook-static/**', 'coverage/**', '.husky/_/**'],
  },

  ...tseslint.configs.recommended,

  // React correctness rules (TypeScript-aware) + hooks rules.
  {
    files: ['**/*.{ts,tsx}'],
    ...eslintReact.configs['recommended-typescript'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },

  {
    files: ['**/*.{ts,tsx}'],
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',

      // The library supports React 18 (peerDependency), so the React-19-only
      // idioms these rules push for are not available to us yet.
      '@eslint-react/no-forward-ref': 'off',
      '@eslint-react/no-context-provider': 'off',
      '@eslint-react/no-use-context': 'off',
      // Composition primitives (Stack dividers, Dialog footer lifting,
      // Breadcrumbs current-item) legitimately inspect and clone children.
      '@eslint-react/no-children-to-array': 'off',
      '@eslint-react/no-children-count': 'off',
      '@eslint-react/no-clone-element': 'off',
      // Static, never-reordered lists (key-combo chips, tone swatches).
      '@eslint-react/no-array-index-key': 'off',
      // Refs are named for what they hold (`pendingFocus`, `copiedTimer`),
      // not suffixed — a style choice, not a correctness signal.
      '@eslint-react/naming-convention-ref-name': 'off',
      // Theme/Provider inject a generated CSS-variable stylesheet built only
      // from our own token map — never from user content.
      '@eslint-react/dom-no-dangerously-set-innerhtml': 'off',
    },
  },

  storybook.configs['flat/recommended'],

  // Must be last: turns off stylistic rules that Prettier owns.
  prettier
);
