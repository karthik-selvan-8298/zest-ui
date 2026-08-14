# 🎨 Zest UI

**A modern, accessible UI component framework for building consistent interfaces.**

One package · ~65 components · zero raw HTML.

Zest UI is a **violet-forward, slate-neutral** design system built on [Base UI](https://base-ui.com) primitives and [Lucide](https://lucide.dev) icons.

Components are designed to be:

- ♿ Accessible
- 📱 Responsive
- 🌙 Dark-mode ready
- 🎨 Themeable
- 🧩 Composable
- ⚡ Production ready

---

## Install

```bash
npm install git+ssh://<your-git-url>/zest-ui.git#main
```

For local development:

```bash
npm install file:../zest-ui
```

---

## Quick Start

```tsx
import { ZestProvider, Button } from 'zest-ui';
import { PlusIcon } from 'zest-ui/icons';

export default function App() {
  return (
    <ZestProvider>
      <Button startIcon={<PlusIcon />}>
        Create
      </Button>
    </ZestProvider>
  );
}
```

`ZestProvider` sets up Zest's design tokens, theme, color mode, and self-hosted Roboto font.

### Vite

```tsx
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ZestProvider } from 'zest-ui';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ZestProvider>
      <App />
    </ZestProvider>
  </StrictMode>
);
```

### Next.js — App Router

`ZestProvider` manages client-side appearance state, so place it in a client component:

```tsx
// app/providers.tsx
'use client';

import { ZestProvider } from 'zest-ui';

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ZestProvider>{children}</ZestProvider>;
}
```

```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Standalone imports

If you don't use `ZestProvider`, import the design tokens directly:

```css
@import 'zest-ui/tokens.css';
```

Font assets are also available from:

```text
zest-ui/fonts
```

---

## Components

Zest provides ~65 reusable components for common UI patterns.

| | Components |
|---|---|
| ⚡ **Actions** | Button · IconButton · ButtonGroup · Toggle · ToggleGroup · Link |
| 📝 **Forms** | Form · TextField · Input · Textarea · Select · NativeSelect · Combobox · Autocomplete · Checkbox · Radio · Switch · Slider · FileUpload |
| 🧭 **Navigation** | Sidebar · AppBar · Tabs · Breadcrumbs · Pagination · Menu · Stepper · Command |
| 🪟 **Overlays** | Dialog · AlertDialog · ConfirmDialog · Drawer · Popover · Tooltip |
| 📣 **Feedback** | Alert · Toast · Progress · CircularProgress · Spinner · Skeleton |
| 📊 **Data** | Card · Table · DataGrid · Avatar · Badge · Chip · Accordion · Collapsible · List · CodeBlock · EmptyState |
| 📅 **Date & Time** | Calendar · DatePicker · DateRangePicker · TimePicker |
| 🖼 **Media** | Image · Kbd · ScrollArea |
| 📐 **Layout** | Box · Stack · Flex · Grid · Container · Paper · Divider · Center · Spacer · AspectRatio · Typography |
| 🧩 **Patterns** | SearchToolbar · FormSection · DetailHeader |
| ✒️ **Icons** | Pre-wrapped Lucide icons via `zest-ui/icons` |

---

## Theming

Zest is **CSS-first**. Themes are expressed through `--zest-*` design tokens while components remain unchanged.

Choose the simplest approach that fits your application.

### App-wide — CSS

Recommended for most applications.

```css
/* src/theme.css */

:root {
  --zest-color-primary: #0b57d0;
  --zest-color-primary-hover: #0842a0;
  --zest-color-primary-active: #062e6f;
  --zest-color-primary-contrast: #ffffff;
  --zest-color-focus-ring: #0b57d0;

  --zest-radius-control: 8px;
  --zest-radius-surface: 14px;
}

[data-zest-theme='dark'] {
  --zest-color-primary: #7cacf8;
  --zest-color-focus-ring: #7cacf8;
}
```

Import the theme after Zest so your values take precedence:

```tsx
// src/main.tsx
import { ZestProvider } from 'zest-ui';
import './theme.css';

createRoot(document.getElementById('root')!).render(
  <ZestProvider>
    <App />
  </ZestProvider>
);
```

Only override the tokens you need. Zest provides defaults for the rest.

### Scoped — `<Theme>`

Apply a theme to a specific subtree:

```tsx
import { Theme, createTheme } from 'zest-ui';

const greenTheme = createTheme({
  colors: {
    primary: {
      main: '#0E9F6E',
      hover: '#057a55',
    },
  },
});

<Theme theme={greenTheme}>
  <MarketingSection />
</Theme>
```

Themes can be nested, with inner themes taking precedence.

### Runtime — `ZestProvider`

Use a runtime theme for dynamic branding or multi-tenant applications:

```tsx
const theme = createTheme({
  colors: {
    primary: {
      main: tenant.brandColor,
      hover: tenant.brandColorDark,
      contrast: '#fff',
    },
    background: tenant.pageBackground,
  },
  darkColors: {
    primary: {
      main: tenant.brandColorLight,
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  radius: {
    md: '8px',
  },
  cssVars: {
    '--zest-shadow-card': 'none',
  },
});

<ZestProvider
  theme={theme}
  defaultMode="system"
>
  <App />
</ZestProvider>
```

`createTheme` supports:

- `colors`
- `darkColors`
- `typography`
- `radius`
- `cssVars`
- `darkCssVars`

### Color Mode

Color mode is independent of theming:

```tsx
const { mode, resolvedMode, setMode } = useColorScheme();

setMode('light');
setMode('dark');
setMode('system');
```

`system` follows the user's OS preference.

The selected mode persists in `localStorage`. Use the `ZestProvider` `storageKey` prop to customize the key or set it to `null` to disable persistence.

---

## Design Tokens

Zest uses semantic design tokens for colors, spacing, typography, shape, elevation, containers, and layering.

```text
--zest-color-*
--zest-space-*
--zest-font-*
--zest-radius-*
--zest-shadow-*
--zest-container-*
--zest-z-*
```

Common tokens:

```css
--zest-color-primary
--zest-color-focus-ring
--zest-radius-control
--zest-radius-panel
--zest-radius-surface
--zest-shadow-card
```

---

## 🤖 AI-Assisted Development

Zest ships with `llms.txt` — a machine-readable reference containing component APIs, usage conventions, design tokens, and component mappings.

For AI-assisted development, add this to your project's `CLAUDE.md` or equivalent rules file:

```md
When writing UI, read node_modules/zest-ui/llms.txt
and follow it for all Zest UI usage.
```

This gives AI assistants the information they need to use Zest components, props, patterns, and tokens correctly.

---

## Philosophy

> **A small, cohesive component system with sensible defaults and flexible theming.**

**One package. One design system. Better interfaces.**
