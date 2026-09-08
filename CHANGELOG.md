# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow
[Semantic Versioning](https://semver.org/) (pre-1.0: minor = may contain
breaking changes, patch = fixes only).

## [Unreleased]

### ⚠️ Breaking (type-level)

- **Toggle** now requires `aria-label` (icon-only control) — parity with `IconButton`.
- **Image** now requires `alt` (pass `alt=""` for decorative images).
- **Progress**, **CircularProgress**, **Slider** require an accessible name: one of `label`, `aria-label` or `aria-labelledby` (new exported `AccessibleName` type).
- **Chip** requires `label` **or** `children` (empty pills are no longer representable).
- **Link** `underline='hover'` (the default) no longer underlines — the text darkens one rung and gains a subtle weight on hover. Use `underline='underline-hover'` for the previous behaviour.
- **Select** and **TimePicker** are now `forwardRef` components whose props extend `ButtonHTMLAttributes` (the trigger). `id`/`aria-label` keep working; `onChange` is omitted in favour of `onValueChange`.
- **Combobox**, **Autocomplete**, **DatePicker**, **DateRangePicker**, **Calendar**, **Command**, **Tooltip** props now extend the corresponding HTML attribute types and spread `...rest` onto their trigger/input/popup.
- **Breadcrumbs.Item** props are a discriminated union: anchor attributes (`target`, `rel`, `download`) are only accepted together with `href`.
- **Divider** renders `<hr>` when it has no label (ref/props type is now `HTMLElement`).
- **Kbd** always renders a `<kbd>` root (key combos nest `<kbd>` inside `<kbd>`).
- `engines.node` is now `>=22` (Node 20 reached end-of-life).

### Added

- **New components** (all on Base UI 1.7 primitives, forwardRef, token-driven, with stories and tests):
  - `Segmented` — single-select segmented control (`solid` / `soft`, sizes, `fullWidth`), replaces the ButtonGroup-with-ghost-buttons pattern.
  - `Toolbar` — accessible toolbar with roving focus (`Root`, `Group`, `Button`, `Separator`, `Link`, `Input`).
  - `ContextMenu` — right-click / long-press menu with submenus, checkbox and radio items.
  - `Menubar` — desktop-style menu bar composing `Menu` dropdowns.
  - `NavigationMenu` — top-nav with flyout panels and description links.
  - `Code` — inline monospace chip for paths, IDs and identifiers (`copyable`).
  - `VisuallyHidden` — screen-reader-only content, `focusable` for skip links.
  - `Meter` — static measurement bar (quota, storage) with `thresholds` colour escalation and `segments`.
  - `Fieldset` — grouped fields with legend + description, chrome reset, disables children.
  - `OtpInput` — one-time-code / PIN entry (`length`, `type`, `mask`, `separator`, `onComplete`).
  - `PreviewCard` — hover card for link/user previews with configurable delays.
- `ZestProvider defaultDensity="dashboard"` — dense product scale (14px body / 13px secondary, headings one rung down, compact control heights).
- Tokens: `--zest-color-surface-raised` (tiered surfaces), `--zest-color-tooltip-bg`, `--zest-color-tooltip-text`, `--zest-color-thumb`.
- **Dialog** body sits on the raised surface so header/footer read as chrome; `Dialog.Header/Body/Footer` and `AlertDialog.Footer` forward refs.
- **Link** `underline='underline-hover'`.
- **Textarea** `size` prop (`'sm' | 'md'`).
- **Image** `frameClassName` / `frameStyle` for the aspect-ratio frame; `className` now always lands on the `<img>`.
- **EmptyState** `icon={null}` hides the icon slot (parity with `Alert`).
- **Card.Header** renders `title` as a real heading (`<h3>` by default, `titleAs` to change).
- **Sidebar** mobile off-canvas is announced as a modal dialog (`role="dialog"`, `aria-modal`), moves focus inside on open, traps Tab, and restores focus on close.
- Exported helper types `AccessibleName` and `WithClassName`.
- Tooling: Storybook a11y addon, axe checks in the visual test-runner, `vitest-axe`, coverage (`npm run test:coverage`), `publint` + `@arethetypeswrong/cli` (`npm run check:package`), ESLint React/jsx-a11y/Prettier configs, husky + lint-staged pre-commit, GitHub Actions CI, `.editorconfig`, `.nvmrc`, `CONTRIBUTING.md`.

### Changed

- **Input** floating label now sits inside the field's top inset instead of straddling the border — no more background mismatch on tinted/dark containers.
- **FormField** label snapped to the type scale (`12px / 500`, was `13px`).
- **Accessibility contrast (WCAG AA)**: new `--zest-color-text-placeholder` token (gray-600 light / gray-500 dark) used by Input, Textarea, Select, NativeSelect and DatePicker placeholders and the resting floating label — `text-disabled` (gray-500, ~2.8:1) is now reserved for genuinely disabled controls; required-asterisk and `FieldError` text use the error-700 tone (6.5:1, was 3.5:1); `--zest-color-warning-subtle-text` is warning-900 in light mode (soft warning chips/badges/alerts were ~3.9:1); Sidebar section labels and captions use the full secondary tone; Calendar outside-month days drop the 60% opacity.
- **CodeBlock** height-capped `<pre>` is keyboard-focusable (`tabIndex=0`) so the scroll region is reachable.
- **Sidebar** section label snapped to `12px` (was `11px`).
- **Select** trigger shows the field focus glow on keyboard focus, not only when open.
- **Alert** uses `role="status"` for `info`/`success` and `role="alert"` only for `warning`/`error`.
- **Avatar** `soft` tint ramps with size (20% xs → 8% xl) instead of a fixed 16%.
- **Card** header→content rhythm is a symmetric 24px inset.
- **ButtonGroup** draws an outer track (1px border, control radius, `overflow: clip`); segments are flat so the corners never double up.
- **IconButton** icons render at 20/16/24px (md/sm/lg) with a consistent 8px inset across variants.
- **Tooltip**, **Slider** thumb and **Switch** thumb use semantic tokens instead of raw greys/white.
- Dev dependencies bumped (Storybook 10.6, ESLint 10.9, typescript-eslint 8.69, Testing Library, `@types/*`); `lucide-react` ^1.40.

### Fixed

- **Build output**: declaration files now resolve under `moduleResolution: node16` — the post-build fixer rewrites TypeScript's inline `import("../Menu")` type references to `../Menu/index.js` and strips side-effect CSS imports from `.d.ts` (runtime JS keeps them). Verified with `@arethetypeswrong/cli` (all entrypoints green) and `publint`.
- **Dialog** footer stays pinned and the body scrolls internally when content overflows (`min-height: 0` on the flex body).
- **Table.Cell** / **Table.HeaderCell** no longer overwrite a consumer `style` when `align` is set.
- **Accordion.Trigger** ref type is `HTMLButtonElement`.
- **Toaster** `data-position` can no longer be clobbered by spread props.
- **PasswordInput** / **SearchInput** no longer accept `endIcon`/`startIcon`, which collided with their built-in adornments.
- **Calendar** `defaultMonth` falls back to `rangeEnd` when only the range end is set.
- **ButtonGroup** removed a dead `#fff` fallback.

### Dependencies

- `@base-ui/react` 1.7 → **1.8.0**, `lucide-react` → 1.41 (validated: typecheck + 203 unit tests + 286 visual stories).
- Deferred on purpose (re-evaluate next release): **Vite 8 / `@vitejs/plugin-react` 6** — plugin-react 6 pulls
- Jest pinned to **~30.4** via `overrides` (transitive dep of `@storybook/test-runner`): Jest 30.5 rejects the `module.register()` hook Storybook uses to load the runner config, so every visual suite failed to start. Unpin once Storybook stops registering its TS loader inside Jest (or the runner adapts).
  `@rolldown/plugin-babel` → Babel 8 while Storybook 10.6 still ships Babel 7; only installable with
  `--legacy-peer-deps`. **Vitest 5** — released 2026-09-03 with no patch release yet and
  `@storybook/addon-vitest` pins `^3 || ^4`. **TypeScript 7** — `typescript-eslint` supports `<6.1`.

## [0.1.0] — 2026-08-16

Initial internal release: ~65 components on Base UI 1.7, violet-forward tokens, light/dark modes, `llms.txt` for AI-assisted development.
