# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow
[Semantic Versioning](https://semver.org/) (pre-1.0: minor = may contain
breaking changes, patch = fixes only).

## [Unreleased]

### Fixed

- **Density**: the body type size is set on `<body>` (not `<html>`), so rem tokens under `density="dashboard"` scale once instead of twice.
- **Dark-mode overrides no longer leak**: dark semantic tokens now live at `:root[data-zest-theme='dark']`, out-ranking an app's `:root { --zest-… }` override (give overrides a dark twin — see README).
- **Label/HelperText/FieldError render standalone** (plain `<label>/<p>/<div>`) instead of throwing `FieldRootContext is missing` outside a FormField.
- **Card/Paper borders** are declared with `:where()` (zero specificity) and expose `--zest-card-border` / `--zest-paper-border`, so a single app class can recolour them.
- **Toolbars align by default**: `--zest-field-height-sm` now equals `--zest-button-height-md` in every density (36 / 32 / 32px), so sm fields, md buttons and Segmented share a height.
- **Dialog**: an explicit `<Dialog.Body>` child is used as-is instead of being nested inside the implicit body.
- **Spacing props** accept any number (×4px, e.g. `gap={1.5}`) instead of silently breaking on non-step values; `NaN` throws.
- **Sidebar**: the collapse edge-toggle no longer floats above an open Dialog/AlertDialog — its z-index dropped from above the popover layer (1401) to just above the AppBar (1101), below the modal layer (1300).
- **Dark mode**: the primary ramp was failing AA both ways — `primary-300` as text on the dark surface (3.9:1) and white text on `primary-300` solid controls (3.9:1). Dark `--zest-color-primary`/`-hover` are lifted toward white, `-active` is `primary-300`, and `--zest-color-primary-contrast` flips to `gray-900` (Material-3 style light-on-dark primary). `--zest-color-primary-subtle-text` lifted the same way (≈6:1). Other tones were already ≥7:1.

### Added

- **Select search**: an in-popup search field appears automatically once there are more than `searchThreshold` (8) options — single and multiple mode — filtering by label/value/`keywords`; `searchable` forces it on/off; `searchPlaceholder`, `noResultsText`. Short lists stay uncluttered.
- **EmptyState:** new `state` prop (`'empty' | 'loading' | 'error'`). Loading renders a Spinner with `role="status"`/`aria-busy` and a default "Loading…" title; error renders the error icon in the error tone with `role="alert"` and keeps `action` for a Retry. `title` is now optional.
- **List:** new `List.Row` one-line recipe (`leading`, `title`, `subtitle`, `trailing`, `divider`, `onClick`/`href`, `disabled`, `selected`). Clickable rows make the title area the control and keep `trailing` as a sibling, so a trailing menu button never nests inside a `<button>`.
- **Box:** new sizing shorthands — `flex` (`true` → `1 1 0%`), `grow`, `shrink`, `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight` (numbers → px), `overflow`. `resolveBoxStyle(props)` is exported for building custom primitives.
- **Flex / Stack:** accept every Box spacing and sizing prop (`<Flex p={4} minWidth={0} flex={1}>`) — no Box wrapper needed.
- **Card:** new `fullHeight` prop and `Card.Content scroll` prop for fill-height cards whose body scrolls while Header/Footer stay pinned.
- **Menu**: `Menu.SubmenuRoot` / `Menu.SubmenuTrigger`, `Menu.CheckboxItem`, `Menu.RadioGroup` / `Menu.RadioItem` — parity with ContextMenu, same indicator recipe. `Menu.Content` inside a `SubmenuRoot` opens beside its trigger. Submenu/indicator CSS moved from ContextMenu.css into Menu.css so all three menus share one source.
- **DataGrid**: `maxHeight` scrolls rows inside the grid under a sticky column header (pagination footer stays fixed below); `groupBy` + `renderGroupHeader` render a full-width `rowgroup` header row per group in current sort order — headers don't count toward `pageSize` or select-all, and stack correctly under `stackOnMobile`.
- **Select `multiple`** (discriminated union — `value`/`onValueChange` become `T[]`): selected values render as compact chips with `maxVisible` (default 2) + `+N` overflow and a `renderValue` override; new `clearable` prop for both modes. With `name`, multiple values submit as one hidden input per value (`FormData.getAll`). ⚠️ `SelectProps` is now a union type — extend it with `&` instead of `extends`.
- `ZestProvider` stamps the **resolved** theme as `data-zest-theme` even in system mode, plus `data-zest-mode` (requested mode). `ZEST_MODE_STORAGE_KEY` is exported.
- Patterns (`SearchToolbar`, `FormSection`, `DetailHeader`) are re-exported from the main entry.
- `Overview/Members Page › AppShell` story — Sidebar + AppBar + page + Dialog composed together (guards the layer order); the members page "Invite member" button now opens a real Dialog.

### Tooling

- Unit tests: `toHaveNoViolations` (vitest-axe) is now actually registered — `vitest-axe/extend-expect` is a no-op under Vitest 4, so the matchers are extended explicitly in `src/test-setup.ts`.
- Storybook Mode toolbar now offers Light / Dark / **System** (follows the OS) with sun/moon icons, and Storybook's built-in canvas-background tool is disabled — it repaints the canvas without switching Zest tokens and was easily mistaken for dark mode.
- Visual runner now forces the bundled Roboto faces to load before capturing (`document.fonts.ready` resolves even when a face was never requested), so dev-server runs no longer drift from the static-build baselines.

### Dependencies

- **Vite 8** (8.3.0) — adopted now that it has 27 patch releases and every peer accepts it; `@vitejs/plugin-react` stays on 5.x (its peer range already includes Vite 8). plugin-react 6 remains deferred: it pulls Babel 8 while Storybook 10.6 ships Babel 7.
- In-range refresh: React 19.3, `lucide-react` 1.47, ESLint 10.11, typescript-eslint 8.70, jsdom 30.1, Prettier 3.9.8, `@storybook/test-runner` 0.24.5 (Jest stays pinned `~30.4` via `overrides` — 30.5 still rejects Storybook's config loader).
- Still deferred: **Vitest 5** (5.0.1 is its only patch; `@storybook/addon-vitest` pins `^3 || ^4`), **TypeScript 7** (`typescript-eslint` supports `<6.1`).

## [0.2.0] — 2026-09-09

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
