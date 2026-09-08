## Summary

<!-- What changed and why. Link the issue/ticket if there is one. -->

## Type of change

- [ ] Fix
- [ ] Feature / new component
- [ ] Refactor (no behaviour change)
- [ ] Tokens / theming
- [ ] Docs / tooling

## Checklist

- [ ] `npm run check` passes locally (typecheck, lint, format, tests)
- [ ] New/changed component has stories covering every variant and size
- [ ] New/changed component has unit tests (render, a11y roles/attrs, controlled + uncontrolled)
- [ ] Only `--zest-*` tokens used in CSS (no hex, no off-scale px); dark mode verified in Storybook
- [ ] Public API documented with JSDoc **and** `llms.txt` updated
- [ ] `README.md` component table updated (new components)
- [ ] `CHANGELOG.md` → `[Unreleased]` entry added
- [ ] Visual baselines updated intentionally (`npm run test:visual:update`) if rendering changed
