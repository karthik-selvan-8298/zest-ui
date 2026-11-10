import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTheme } from './createTheme';
import { useColorScheme, useZest, ZEST_MODE_STORAGE_KEY, ZestProvider } from './ZestProvider';

const html = document.documentElement;

/** Makes `prefers-color-scheme: dark` report `dark` and returns a way to flip it. */
function mockSystemDark(initial: boolean) {
  let matches = initial;
  const listeners = new Set<() => void>();
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        get matches() {
          return matches;
        },
        media: query,
        addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
        removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
      }) as unknown as MediaQueryList
  );
  return {
    set(next: boolean) {
      matches = next;
      act(() => listeners.forEach((listener) => listener()));
    },
    listeners,
  };
}

/** Renders the current context so tests can read and drive it. */
function Probe() {
  const zest = useZest();
  return (
    <>
      <output>{`${zest.mode}/${zest.resolvedMode}/${zest.density}`}</output>
      <button type="button" onClick={() => zest.setMode('dark')}>
        dark
      </button>
      <button type="button" onClick={() => zest.setDensity('compact')}>
        compact
      </button>
      <button type="button" onClick={() => zest.setDensity('comfortable')}>
        comfortable
      </button>
    </>
  );
}

describe('ZestProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    window.localStorage.clear();
  });

  it('stamps the resolved theme, requested mode and root class on <html>', () => {
    render(
      <ZestProvider defaultMode="dark">
        <Probe />
      </ZestProvider>
    );
    expect(html).toHaveAttribute('data-zest-theme', 'dark');
    expect(html).toHaveAttribute('data-zest-mode', 'dark');
    expect(html).toHaveClass('zest-root');
    expect(html).not.toHaveAttribute('data-zest-density');
    expect(screen.getByRole('status')).toHaveTextContent('dark/dark/comfortable');
  });

  it('removes everything it added to <html> on unmount', () => {
    const { unmount } = render(
      <ZestProvider defaultMode="dark" defaultDensity="dashboard">
        <Probe />
      </ZestProvider>
    );
    expect(html).toHaveAttribute('data-zest-density', 'dashboard');
    unmount();
    expect(html).not.toHaveClass('zest-root');
    expect(html).not.toHaveAttribute('data-zest-theme');
    expect(html).not.toHaveAttribute('data-zest-mode');
    expect(html).not.toHaveAttribute('data-zest-density');
  });

  it('resolves system mode from the OS preference and follows changes', () => {
    const system = mockSystemDark(true);
    const { unmount } = render(
      <ZestProvider>
        <Probe />
      </ZestProvider>
    );
    expect(html).toHaveAttribute('data-zest-mode', 'system');
    expect(html).toHaveAttribute('data-zest-theme', 'dark');
    expect(screen.getByRole('status')).toHaveTextContent('system/dark/comfortable');

    system.set(false);
    expect(html).toHaveAttribute('data-zest-theme', 'light');
    expect(screen.getByRole('status')).toHaveTextContent('system/light/comfortable');

    unmount();
    expect(system.listeners.size).toBe(0);
  });

  it('setMode updates the document, persists the choice and notifies', async () => {
    const onModeChange = vi.fn();
    render(
      <ZestProvider defaultMode="light" onModeChange={onModeChange}>
        <Probe />
      </ZestProvider>
    );
    expect(html).toHaveAttribute('data-zest-theme', 'light');
    await userEvent.click(screen.getByRole('button', { name: 'dark' }));
    expect(html).toHaveAttribute('data-zest-theme', 'dark');
    expect(window.localStorage.getItem(ZEST_MODE_STORAGE_KEY)).toBe('dark');
    expect(onModeChange).toHaveBeenCalledWith('dark');
  });

  it('starts from a stored mode and ignores invalid stored values', () => {
    window.localStorage.setItem(ZEST_MODE_STORAGE_KEY, 'dark');
    const first = render(
      <ZestProvider defaultMode="light">
        <Probe />
      </ZestProvider>
    );
    expect(html).toHaveAttribute('data-zest-mode', 'dark');
    first.unmount();

    window.localStorage.setItem(ZEST_MODE_STORAGE_KEY, 'sepia');
    render(
      <ZestProvider defaultMode="light">
        <Probe />
      </ZestProvider>
    );
    expect(html).toHaveAttribute('data-zest-mode', 'light');
  });

  it('does not read or write storage when storageKey is null', async () => {
    window.localStorage.setItem(ZEST_MODE_STORAGE_KEY, 'dark');
    render(
      <ZestProvider defaultMode="light" storageKey={null}>
        <Probe />
      </ZestProvider>
    );
    expect(html).toHaveAttribute('data-zest-mode', 'light');
    window.localStorage.clear();
    await userEvent.click(screen.getByRole('button', { name: 'dark' }));
    expect(html).toHaveAttribute('data-zest-mode', 'dark');
    expect(window.localStorage.length).toBe(0);
  });

  it('a controlled mode only changes when the parent passes a new one', async () => {
    const onModeChange = vi.fn();
    const { rerender } = render(
      <ZestProvider mode="light" onModeChange={onModeChange} storageKey={null}>
        <Probe />
      </ZestProvider>
    );
    await userEvent.click(screen.getByRole('button', { name: 'dark' }));
    expect(onModeChange).toHaveBeenCalledWith('dark');
    expect(html).toHaveAttribute('data-zest-theme', 'light');

    rerender(
      <ZestProvider mode="dark" onModeChange={onModeChange} storageKey={null}>
        <Probe />
      </ZestProvider>
    );
    expect(html).toHaveAttribute('data-zest-theme', 'dark');
  });

  it('stamps a non-default density and clears it when back to comfortable', async () => {
    render(
      <ZestProvider defaultMode="light">
        <Probe />
      </ZestProvider>
    );
    await userEvent.click(screen.getByRole('button', { name: 'compact' }));
    expect(html).toHaveAttribute('data-zest-density', 'compact');
    await userEvent.click(screen.getByRole('button', { name: 'comfortable' }));
    expect(html).not.toHaveAttribute('data-zest-density');
  });

  it('renders the theme overrides as an inline stylesheet', () => {
    const theme = createTheme({
      colors: { primary: { main: '#0e9f6e' } },
      darkColors: { primary: { main: '#31c48d' } },
    });
    const { container, rerender } = render(
      <ZestProvider theme={theme} defaultMode="light">
        <Probe />
      </ZestProvider>
    );
    const style = container.querySelector('style[data-zest-theme-overrides]');
    expect(style?.textContent).toContain(
      ":root, [data-zest-theme='light'] { --zest-color-primary: #0e9f6e; }"
    );
    expect(style?.textContent).toContain(
      ":root[data-zest-theme='dark'] { --zest-color-primary: #31c48d; }"
    );
    expect(style?.textContent).toContain('@media (prefers-color-scheme: dark)');

    rerender(
      <ZestProvider defaultMode="light">
        <Probe />
      </ZestProvider>
    );
    expect(container.querySelector('style[data-zest-theme-overrides]')).toBeNull();
  });

  it('useZest throws a helpful error outside a provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow('useZest must be used within a <ZestProvider>.');
  });

  it('useColorScheme exposes only the appearance fields', () => {
    const { result } = renderHook(() => useColorScheme(), {
      wrapper: ({ children }) => (
        <ZestProvider defaultMode="dark" storageKey={null}>
          {children}
        </ZestProvider>
      ),
    });
    expect(Object.keys(result.current).sort()).toEqual(['mode', 'resolvedMode', 'setMode']);
    expect(result.current.resolvedMode).toBe('dark');
    act(() => result.current.setMode('light'));
    expect(result.current.resolvedMode).toBe('light');
  });
});
