import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders a span with the shared visually-hidden class and accessible text', () => {
    render(
      <button type="button">
        <VisuallyHidden>Delete draft</VisuallyHidden>
      </button>
    );
    const button = screen.getByRole('button', { name: 'Delete draft' });
    const hidden = button.firstElementChild as HTMLElement;
    expect(hidden.tagName).toBe('SPAN');
    expect(hidden).toHaveClass('zest-visually-hidden');
    expect(hidden).not.toHaveClass('zest-visually-hidden--focusable');
    expect(hidden).not.toHaveClass('zest-focusable');
  });

  it('is polymorphic via `as` and forwards native props and refs', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(
      <VisuallyHidden as="a" href="#main" ref={ref} data-testid="skip">
        Skip to content
      </VisuallyHidden>
    );
    const link = screen.getByRole('link', { name: 'Skip to content' });
    expect(link).toHaveAttribute('href', '#main');
    expect(link).toHaveAttribute('data-testid', 'skip');
    expect(ref.current).toBe(link);
  });

  it('adds the focus-reveal classes with `focusable` and merges className', () => {
    render(
      <VisuallyHidden as="a" href="#main" focusable className="custom">
        Skip to content
      </VisuallyHidden>
    );
    const link = screen.getByRole('link', { name: 'Skip to content' });
    expect(link).toHaveClass('zest-visually-hidden');
    expect(link).toHaveClass('zest-visually-hidden--focusable');
    expect(link).toHaveClass('zest-focusable');
    expect(link).toHaveClass('custom');
  });
});
