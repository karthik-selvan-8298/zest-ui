# Contributing to Zest UI

Thanks for helping build the design system. This guide covers local setup, the
conventions every component follows, and how changes get released.

## Prerequisites

- Node **≥ 22** (`.nvmrc` pins the recommended LTS — `nvm use`)
- npm ≥ 10

```bash
npm install          # installs deps, sets up git hooks, builds dist/
npm run storybook    # http://localhost:6006
```

## Everyday scripts

| Script                                       | What it does                                                                                                                                                             |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run check`                              | Typecheck + lint + format check + unit tests — run before every push                                                                                                     |
| `npm run typecheck`                          | `tsc --noEmit` over `src/` and `.storybook/`                                                                                                                             |
| `npm run lint` / `lint:fix`                  | ESLint (TypeScript, `@eslint-react`, hooks, Storybook rules; a11y is enforced at runtime by axe, not lint)                                                               |
| `npm run format` / `format:check`            | Prettier over the whole repo (respects `.gitignore` + `.prettierignore`)                                                                                                 |
| `npm test` / `test:watch` / `test:coverage`  | Vitest (jsdom) — coverage report in `coverage/`                                                                                                                          |
| `npm run storybook` / `storybook:build`      | Component workbench with autodocs + a11y panel                                                                                                                           |
| `npm run test:visual` / `test:visual:update` | Per-story Chromium screenshots vs. `.storybook/__image_snapshots__` + axe a11y report (needs a running Storybook on :6006; `ZEST_A11Y_STRICT=1` makes axe findings fail) |
| `npm run build`                              | Cleans and emits `dist/` (ESM + `.d.ts` + CSS, `'use client'` banners)                                                                                                   |
| `npm run check:package`                      | `publint` + `@arethetypeswrong/cli` on the built package                                                                                                                 |

A pre-commit hook (husky + lint-staged) runs ESLint and Prettier on staged files.

**Dark mode in Storybook:** use the **Mode** toolbar (Light / Dark / System) — it drives `ZestProvider`, so every token swaps. Storybook's own paint-bucket background tool is disabled because it only repaints the canvas. Restart `npm run storybook` after pulling changes to `.storybook/`.

## Adding or changing a component

Every component lives in `src/<group>/<Name>/` with exactly these files:

```
Name.tsx          component (+ prop types, JSDoc with a usage snippet)
Name.css          styles — --zest-* tokens only
Name.stories.tsx  Storybook: Default + every variant/size/state
Name.test.tsx     Vitest + Testing Library
index.ts          re-exports the component and its prop types
```

Then wire it up:

1. `src/index.ts` — add `export * from './<group>/<Name>';` (icons and patterns have their own barrels).
2. `llms.txt` — add a terse entry under the right section (this file is what AI assistants read; keep the existing voice).
3. `README.md` — add the component to the table.
4. `CHANGELOG.md` — add a line under `[Unreleased]`.

### Conventions (enforced in review)

- **Base UI first.** Wrap the `@base-ui/react` primitive when one exists (keyboard, aria and positioning come for free). Use `WithClassName<React.ComponentProps<typeof Base.Part>>` for props.
- **`forwardRef` on every leaf**, `className` merged with `cx()`, `...props` spread **last** onto the root element so consumers can override anything.
- **Accessible names are required at the type level** for icon-only and label-less controls (`IconButton`, `Toggle` → `aria-label: string`; `Progress`/`Meter`/`Slider` → `AccessibleName`; `Image` → `alt`).
- **Tokens only.** Colors, spacing, radius, shadows, fonts come from `src/tokens/css/tokens.css`. Component-specific sizes go in `--_name` locals. Use radius _intents_ (`--zest-radius-control` / `-panel` / `-surface` / `-row`) and inset intents (`--zest-inset-panel`, `--zest-inset-control-x`, `--zest-inset-surface`).
- **Tonal components** stamp `data-accent={color}` and read the `--zest-accent*` locals from `base.css` — never per-tone CSS.
- **Dark mode is automatic** as long as you use semantic `--zest-color-*` tokens. Check both modes in Storybook (toolbar → Mode).
- **Single-highlight rule:** one visual highlight per interactive row/segment.
- **Focus:** interactive elements get the `zest-focusable` class; fields use `--zest-focus-glow`.
- **Stories** use `title: '<Group>/<Name>'` and `satisfies Meta<typeof X>`; autodocs is on globally.
- **Tests** cover: renders with the right role/attrs, controlled + uncontrolled behaviour with callbacks, disabled/edge cases, and (where relevant) `expect(await axe(container)).toHaveNoViolations()`.

## Commit messages

Conventional Commits, scoped to the component when it applies:

```
feat(Segmented): add single-select segmented control
fix(Dialog): let the body shrink so the footer stays pinned
chore: bump storybook to 10.6
```

## Visual regression baselines

Baselines live in `.storybook/__image_snapshots__` and are captured on macOS.
When a change is _meant_ to alter rendering, regenerate them intentionally:

```bash
npm run storybook            # in one terminal
npm run test:visual:update   # in another
```

Commit the updated PNGs with the change. Never update baselines to make an
unexpected diff go away — investigate it.

If the runner reports `0 of N total` with `Executable doesn't exist … ms-playwright`, a
`npm update` moved Playwright to a version whose Chromium build isn't downloaded yet — run
`npx playwright install chromium` once (CI already does this).

## Dependency policy

Stable over newest: a major is adopted only when it has at least one patch release
and every peer in the tree accepts it without `--legacy-peer-deps`. Runtime deps
(`@base-ui/react`, `lucide-react`) are bumped with a full `npm run check` +
`test:visual` run. Deferred upgrades and the reason are tracked in
`CHANGELOG.md → Dependencies`. Native-tool install scripts are allow-listed via
`npm install-scripts approve` (npm ≥ 11).

## Releasing

1. Move the `[Unreleased]` notes in `CHANGELOG.md` under a new version heading.
2. Bump `version` in `package.json` (pre-1.0: minor for breaking, patch otherwise).
3. `npm run check && npm run build && npm run check:package`
4. Commit, tag (`v0.x.y`), push.
5. `npm publish` (targets the internal registry in `publishConfig`).
