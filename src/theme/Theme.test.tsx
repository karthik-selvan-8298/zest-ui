import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createTheme } from './createTheme';
import { Theme } from './Theme';

describe('Theme', () => {
  it('scopes its overrides to its own subtree', () => {
    const theme = createTheme({ colors: { primary: { main: '#0e9f6e' } } });
    render(
      <Theme theme={theme} data-testid="scope">
        <span>Inside</span>
      </Theme>
    );
    const scope = screen.getByTestId('scope');
    const id = scope.getAttribute('data-zest-scope');
    expect(id).toMatch(/^zest-[a-zA-Z0-9-]+$/);
    expect(scope).toHaveClass('zest-theme');
    expect(scope.querySelector('style')?.textContent).toBe(
      `[data-zest-scope='${id}'] { --zest-color-primary: #0e9f6e; }\n`
    );
    expect(screen.getByText('Inside')).toBeInTheDocument();
  });

  it('emits dark overrides for explicit dark mode and for the OS preference', () => {
    const theme = createTheme({ darkColors: { surface: '#111' } });
    render(<Theme theme={theme} data-testid="scope" />);
    const scope = screen.getByTestId('scope');
    const id = scope.getAttribute('data-zest-scope');
    const css = scope.querySelector('style')?.textContent ?? '';
    expect(css).toContain(`[data-zest-theme='dark'] [data-zest-scope='${id}']`);
    expect(css).toContain(`[data-zest-scope='${id}'][data-zest-theme='dark']`);
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain('--zest-color-surface: #111;');
    expect(css).not.toContain(`[data-zest-scope='${id}'] { }`);
  });

  it('renders no stylesheet for an empty theme', () => {
    render(<Theme theme={createTheme()} data-testid="scope" />);
    expect(screen.getByTestId('scope').querySelector('style')).toBeNull();
  });

  it('gives nested themes distinct scopes', () => {
    render(
      <Theme theme={createTheme({ radius: { md: '8px' } })} data-testid="outer">
        <Theme theme={createTheme({ radius: { md: '2px' } })} data-testid="inner" />
      </Theme>
    );
    expect(screen.getByTestId('outer').getAttribute('data-zest-scope')).not.toBe(
      screen.getByTestId('inner').getAttribute('data-zest-scope')
    );
  });

  it('forwards the ref, className and other props to the wrapper', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Theme ref={ref} theme={createTheme()} className="marketing" id="hero" />);
    expect(ref.current).toHaveClass('zest-theme', 'marketing');
    expect(ref.current).toHaveAttribute('id', 'hero');
  });
});
