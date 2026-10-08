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
- **Textarea / NativeSelect** now render through Base UI's `Field.Control`, so inside a `FormField` the label's `for`, `aria-describedby` and invalid state reach the control (they previously pointed at an id that didn't exist).
- **`error` sets `aria-invalid`** on the real control in Input, Textarea, NativeSelect, NumberInput, Select, Combobox, Autocomplete and OtpInput (it was visual-only). A consumer's own `aria-invalid` still wins.
- **Select / SearchInput**: clearing the value returns focus to the trigger/input instead of dropping it to `<body>`.
- **FileUpload** enforces `accept` for dropped files (and "All files" picks); rejects go to `onReject` as documented. The drag highlight no longer flickers when the pointer crosses the zone's icon or label.
- **`useToast()`** returns a stable object; it changed identity on every toast update, re-running consumer effects (and looping if the effect raised a toast). Promise toasts keep their success/error tone when `severity: undefined` is passed explicitly.
- **Dialog / Drawer**: `description` is no longer dropped when `hideClose` is set without a `title`.
- **Chip**: Enter/Space on the remove button of a clickable chip fires `onDelete` (it bubbled to the chip and fired `onClick`). **Code**: `onClick` on a non-copyable `<Code>` is forwarded instead of being dropped. **SearchToolbar**: `searchProps.className` is merged with the input's layout class instead of replacing it.
- **Sidebar**: the mobile focus trap no longer resets (focus jumping to the close button) on every parent re-render when `onMobileClose` is an inline function. Mini-rail flyouts open on touch tap and don't snap shut on the click that follows a hover-open; Escape inside a flyout returns focus to its trigger; the trigger is a disclosure (`aria-expanded` + `aria-controls`) instead of claiming `aria-haspopup="menu"`; conditional children (`{cond && …}`) no longer create an empty expandable group.
- **Image**: a new `src` after a load failure is retried instead of staying on the fallback; the fallback keeps the accessible name (`role="img"` + `aria-label`, hidden when `alt=""`); `fit="none"` now applies `object-fit: none`. **ScrollArea** accepts Base UI's function form of `style` instead of silently dropping it.
- **ZestProvider** removes the `zest-root` class from `<html>` on unmount. **createTheme** skips `undefined` radius entries instead of emitting `--zest-radius-*: undefined`.

### Changed

- **AspectRatio** moved into the per-component folder layout (`src/primitives/AspectRatio/`, with its own CSS and tests); same export and rendering.
- **Exported prop types**: `CardTitleProps`, `BoxStyleProps`, `BoxSpacingProps`, `BoxSizeProps`, `CSSLength`, `FlexAlign`, `FlexJustify` are now importable from the package entry.
- **ContextMenu / Menubar** reuse the Menu row parts (Item, Separator, Group, Submenu, Checkbox/Radio items) instead of hand-copied wrappers — Base UI exports the same components for both; `ContextMenu*Props` are now aliases of the matching `Menu*Props` (same names and shapes). Exported `BreadcrumbsItemLinkProps` / `BreadcrumbsItemTextProps`.
- **Internals**: DataGrid's sort/group/pagination math lives in pure, unit-tested helpers (`DataGrid.utils.ts`); Theme and ZestProvider share one CSS-variable serializer; patterns follow the `Name/index.ts` folder convention.
- **Docs**: component-level JSDoc with `tsx` usage examples on exported components (moved from file-header comments, which editors don't surface on hover), plus prop docs with `@default`s. Two incorrect docs fixed (Link `underline` darkens one rung; Flex `fullWidth` only sets width).
- **Tests**: new suites for Accordion, Avatar, Badge, Collapsible, Table, Input, Textarea, NativeSelect, SearchInput, Sidebar, Image, ScrollArea, AspectRatio, the three patterns and the DataGrid helpers, plus a regression test for each fix above. `toHaveNoViolations()` is now typed (vitest-axe only augments the legacy `Vi` namespace).

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

- **Coverage thresholds** ratcheted 40/35/40/40 → 65/58/64/65 (statements/branches/functions/lines; measured 67/60/66/68).
- **Prettier** `format` / `format:check` (and lint-staged) now cover the whole repo — scripts, configs, docs and MDX — instead of only `src/**/*.{ts,tsx,css}`.
- **ESLint config** uses ESLint core's `defineConfig()` / `globalIgnores()` instead of the deprecated `tseslint.config()` helper; the resolved rule set is unchanged.
- **CI**: `actions/checkout`, `actions/setup-node`, `actions/upload-artifact` bumped v4 → v7; Node **26** added to the test matrix (22 / 24 / 26); checkout runs with `persist-credentials: false`.

### Dependencies

- **TypeScript 6.0** (6.0.3) — the newest release `typescript-eslint` supports (`<6.1`). TS 6 enables `noUncheckedSideEffectImports` by default, so `src/css.d.ts` declares `*.css` modules; the redundant `esModuleInterop` flag (always on in TS 6) was dropped from `tsconfig.json`. **TypeScript 7** remains deferred until `typescript-eslint` supports it.
- **Vitest 5** (5.0.3) + `@vitest/coverage-v8` 5 — adopted now that it has three patch releases (`@storybook/addon-vitest`, the previous blocker, isn't used here).
- **`@vitejs/plugin-react` 6** (6.1.2) — no longer depends on Babel (uses Vite 8's oxc transform), which was the earlier conflict with Storybook's Babel 7.
- **`@storybook/test-runner` 0.26**, Storybook 10.6.1, Vite 8.3.4, ESLint 10.12, typescript-eslint 8.71, `@eslint-react/eslint-plugin` 5.24, `lucide-react` 1.53, jsdom 30.1.2, Prettier 3.9.9, lint-staged 17.6, publint 0.3.25, `@types/node` 26.6.4, npm 11.20.
- Jest stays pinned `~30.4` via `overrides` — re-verified: 30.5 still fails every story with "module.register() is not supported in Jest" (Storybook's test-runner config loader). `uuid` is overridden to `^11.1.1` to patch GHSA-w5hq-g745-h8pq in `jest-junit`/`nyc` (dev-only; CJS API unchanged). The remaining `npm audit` advisory (`sprintf-js`, GHSA-hp3w-g68c-fv3c) has no patched release and is reachable only through `test-runner → nyc → js-yaml` parsing this repo's own config.

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
