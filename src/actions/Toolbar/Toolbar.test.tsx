import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../../forms/Input';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Toolbar } from './Toolbar';

function renderToolbar(rootProps: Partial<React.ComponentProps<typeof Toolbar.Root>> = {}) {
  return render(
    <Toolbar.Root aria-label="Actions" {...rootProps}>
      <Toolbar.Button aria-label="Edit">E</Toolbar.Button>
      <Toolbar.Button aria-label="Copy">C</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button aria-label="Delete">D</Toolbar.Button>
    </Toolbar.Root>
  );
}

describe('Toolbar', () => {
  it('renders role="toolbar" with a horizontal orientation by default', () => {
    renderToolbar();
    const toolbar = screen.getByRole('toolbar', { name: 'Actions' });
    expect(toolbar).toHaveClass('zest-toolbar');
    expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal');
    expect(toolbar).toHaveAttribute('data-orientation', 'horizontal');
    expect(toolbar).toHaveAttribute('data-variant', 'plain');
  });

  it('reflects vertical orientation and the contained variant', () => {
    renderToolbar({ orientation: 'vertical', variant: 'contained' });
    const toolbar = screen.getByRole('toolbar');
    expect(toolbar).toHaveAttribute('aria-orientation', 'vertical');
    expect(toolbar).toHaveAttribute('data-variant', 'contained');
  });

  it('draws plain buttons with the built-in ghost look and a focus ring class', () => {
    renderToolbar();
    const edit = screen.getByRole('button', { name: 'Edit' });
    expect(edit).toHaveClass('zest-toolbar__button', 'zest-focusable');
    expect(edit).toHaveAttribute('data-plain');
  });

  it('renders an accessible separator that flips against the toolbar axis', () => {
    renderToolbar();
    const separator = screen.getByRole('separator');
    expect(separator).toHaveClass('zest-toolbar__separator');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
  });

  it('moves focus with arrow keys and wraps at the ends', async () => {
    renderToolbar();
    const edit = screen.getByRole('button', { name: 'Edit' });
    const copy = screen.getByRole('button', { name: 'Copy' });
    const del = screen.getByRole('button', { name: 'Delete' });

    edit.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(copy).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(del).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(edit).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(del).toHaveFocus();
  });

  it('uses vertical arrows when orientation is vertical', async () => {
    renderToolbar({ orientation: 'vertical' });
    const edit = screen.getByRole('button', { name: 'Edit' });
    edit.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Copy' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(edit).toHaveFocus();
  });

  it('composes Zest controls through `render` without the plain styling', async () => {
    const onClick = vi.fn();
    render(
      <Toolbar.Root aria-label="Mixed">
        <Toolbar.Button render={<IconButton aria-label="Star">*</IconButton>} onClick={onClick} />
        <Toolbar.Button render={<Button variant="ghost">Share</Button>} />
      </Toolbar.Root>
    );
    const star = screen.getByRole('button', { name: 'Star' });
    expect(star).toHaveClass('zest-icon-button', 'zest-toolbar__button');
    expect(star).not.toHaveAttribute('data-plain');
    await userEvent.click(star);
    expect(onClick).toHaveBeenCalledTimes(1);

    const share = screen.getByRole('button', { name: 'Share' });
    expect(share).toHaveClass('zest-button', 'zest-toolbar__button');
  });

  it('renders links and inputs as roving items', async () => {
    render(
      <Toolbar.Root aria-label="Mixed">
        <Toolbar.Button aria-label="Edit">E</Toolbar.Button>
        <Toolbar.Link href="/docs">Docs</Toolbar.Link>
        <Toolbar.Input render={<Input size="sm" />} aria-label="Search" />
      </Toolbar.Root>
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).toHaveClass('zest-toolbar__link', 'zest-focusable');

    const input = screen.getByRole('textbox', { name: 'Search' });
    expect(input).toBeInTheDocument();

    screen.getByRole('button', { name: 'Edit' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(link).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(input).toHaveFocus();
  });

  it('disables every item when the root is disabled', () => {
    renderToolbar({ disabled: true });
    const edit = screen.getByRole('button', { name: 'Edit' });
    expect(edit).toHaveAttribute('data-disabled');
    expect(edit).toHaveAttribute('aria-disabled', 'true');
  });
});
