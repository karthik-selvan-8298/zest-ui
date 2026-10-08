import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('renders data-driven nav and marks the active item as the current page', () => {
    render(
      <Sidebar.Root
        nav={[
          {
            label: 'Overview',
            items: [{ label: 'Home', href: '/home', active: true }, { label: 'Reports' }],
          },
        ]}
      />
    );
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Reports' })).not.toHaveAttribute('aria-current');
  });

  it('forwards refs to the root and to items', () => {
    const rootRef = React.createRef<HTMLElement>();
    const itemRef = vi.fn();
    render(
      <Sidebar.Root ref={rootRef}>
        <Sidebar.Section>
          <Sidebar.Item ref={itemRef} label="Home" />
        </Sidebar.Section>
      </Sidebar.Root>
    );
    expect(rootRef.current?.tagName).toBe('ASIDE');
    expect(itemRef).toHaveBeenCalledWith(expect.any(HTMLLIElement));
  });

  it('expands nested items inline', async () => {
    render(
      <Sidebar.Root>
        <Sidebar.Section>
          <Sidebar.Item label="Settings">
            <Sidebar.Item label="Users" />
          </Sidebar.Item>
        </Sidebar.Section>
      </Sidebar.Root>
    );
    const trigger = screen.getByRole('button', { name: 'Settings' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Users' })).toBeInTheDocument();
  });

  it('treats an item whose children are all empty nodes as a leaf', () => {
    const showChild = false;
    render(
      <Sidebar.Root>
        <Sidebar.Section>
          <Sidebar.Item label="Solo">{showChild && <Sidebar.Item label="Hidden" />}</Sidebar.Item>
        </Sidebar.Section>
      </Sidebar.Root>
    );
    expect(screen.getByRole('button', { name: 'Solo' })).not.toHaveAttribute('aria-expanded');
  });

  describe('mobile off-canvas', () => {
    function MobileHarness({ tick }: { tick: number }) {
      return (
        <Sidebar.Root
          data-tick={tick}
          mobileOpen
          // A fresh inline callback each render, as consumers typically write it.
          onMobileClose={() => {}}
        >
          <Sidebar.Section>
            <Sidebar.Item label="Inbox" />
          </Sidebar.Section>
        </Sidebar.Root>
      );
    }

    it('moves focus into the dialog on open', () => {
      render(<MobileHarness tick={0} />);
      expect(screen.getByRole('dialog', { name: 'Navigation' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close navigation' })).toHaveFocus();
    });

    it('keeps focus in place when the parent re-renders with a new onMobileClose', () => {
      const { rerender } = render(<MobileHarness tick={0} />);
      const inbox = screen.getByRole('button', { name: 'Inbox' });
      inbox.focus();
      rerender(<MobileHarness tick={1} />);
      expect(inbox).toHaveFocus();
    });

    it('calls the latest onMobileClose on Escape', () => {
      const first = vi.fn();
      const second = vi.fn();
      const { rerender } = render(<Sidebar.Root mobileOpen onMobileClose={first} />);
      rerender(<Sidebar.Root mobileOpen onMobileClose={second} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledTimes(1);
    });
  });

  describe('mini rail flyout', () => {
    function renderRail() {
      return render(
        <Sidebar.Root collapsed>
          <Sidebar.Section>
            <Sidebar.Item label="Settings" icon={<span>S</span>}>
              <Sidebar.Item label="Users" />
            </Sidebar.Item>
          </Sidebar.Section>
        </Sidebar.Root>
      );
    }

    it('wires the trigger to its flyout as a disclosure', async () => {
      renderRail();
      const trigger = screen.getByRole('button', { name: 'Settings' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).not.toHaveAttribute('aria-haspopup');
      const flyout = document.getElementById(trigger.getAttribute('aria-controls') ?? '');
      expect(flyout).toHaveClass('zest-sidebar__flyout');
      // Hover opens it; the click that follows pins it rather than closing it.
      await userEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(flyout).toHaveAttribute('data-open');
      await userEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggles from the keyboard', async () => {
      renderRail();
      const trigger = screen.getByRole('button', { name: 'Settings' });
      trigger.focus();
      await userEvent.keyboard('{Enter}');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await userEvent.keyboard('{Enter}');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('returns focus to the trigger when Escape closes it from inside', async () => {
      renderRail();
      const trigger = screen.getByRole('button', { name: 'Settings' });
      await userEvent.click(trigger);
      screen.getByRole('button', { name: 'Users' }).focus();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveFocus();
    });
  });
});
