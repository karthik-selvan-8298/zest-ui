// Base UI NavigationMenu measures its content to size the popup; jsdom has
// no ResizeObserver, so provide an inert stand-in before the component loads.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof globalThis.ResizeObserver;
}

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { NavigationMenu } from './NavigationMenu';

/* Stand-in for a router link (react-router / Next both fit this shape). */
const FakeRouterLink = React.forwardRef<
  HTMLAnchorElement,
  { to: string } & React.ComponentProps<'a'>
>(function FakeRouterLink({ to, children, ...props }, ref) {
  return (
    <a ref={ref} href={to} data-router-link="" {...props}>
      {children}
    </a>
  );
});

function renderMenu(rootProps: Partial<React.ComponentProps<typeof NavigationMenu.Root>> = {}) {
  return render(
    <NavigationMenu.Root {...rootProps}>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/crm" description="Sell smarter">
              CRM
            </NavigationMenu.Link>
            <NavigationMenu.Link render={<FakeRouterLink to="/desk" />}>Desk</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/pricing" active>
            Pricing
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

describe('NavigationMenu', () => {
  it('renders a nav landmark with a list of triggers and links', () => {
    renderMenu();
    expect(screen.getByRole('navigation')).toHaveClass('zest-navigation-menu');
    expect(screen.getByRole('list')).toHaveClass('zest-navigation-menu__list');
    const trigger = screen.getByRole('button', { name: 'Products' });
    expect(trigger).toHaveClass('zest-navigation-menu__trigger', 'zest-focusable');
    expect(trigger).not.toHaveAttribute('data-popup-open');
    expect(trigger.querySelector('.zest-navigation-menu__chevron')).not.toBeNull();
  });

  it('marks the current page link with data-active', () => {
    renderMenu();
    const pricing = screen.getByRole('link', { name: 'Pricing' });
    expect(pricing).toHaveAttribute('href', '/pricing');
    expect(pricing).toHaveAttribute('data-active');
    expect(pricing).toHaveClass('zest-navigation-menu__link', 'zest-focusable');
  });

  it('opens the flyout on click and shows the content links', async () => {
    renderMenu();
    const trigger = screen.getByRole('button', { name: 'Products' });
    await userEvent.click(trigger);

    const crm = await screen.findByRole('link', { name: /CRM/ });
    expect(crm).toHaveAttribute('href', '/crm');
    expect(trigger).toHaveAttribute('data-popup-open');
    expect(trigger.querySelector('.zest-navigation-menu__chevron')).toHaveAttribute(
      'data-popup-open'
    );
    expect(document.querySelector('.zest-navigation-menu__popup')).not.toBeNull();
  });

  it('renders the optional description as a secondary line', async () => {
    renderMenu();
    await userEvent.click(screen.getByRole('button', { name: 'Products' }));
    const description = await screen.findByText('Sell smarter');
    expect(description).toHaveClass('zest-navigation-menu__link-description');
    expect(screen.getByText('CRM')).toHaveClass('zest-navigation-menu__link-label');
  });

  it('supports router links through `render`', async () => {
    renderMenu();
    await userEvent.click(screen.getByRole('button', { name: 'Products' }));
    const desk = await screen.findByRole('link', { name: 'Desk' });
    expect(desk).toHaveAttribute('href', '/desk');
    expect(desk).toHaveAttribute('data-router-link');
    expect(desk).toHaveClass('zest-navigation-menu__link');
  });

  it('closes on Escape', async () => {
    renderMenu();
    const trigger = screen.getByRole('button', { name: 'Products' });
    await userEvent.click(trigger);
    await screen.findByRole('link', { name: /CRM/ });
    await userEvent.keyboard('{Escape}');
    expect(trigger).not.toHaveAttribute('data-popup-open');
  });

  it('renders the arrow only when requested', async () => {
    renderMenu({ arrow: true });
    await userEvent.click(screen.getByRole('button', { name: 'Products' }));
    await screen.findByRole('link', { name: /CRM/ });
    expect(document.querySelector('.zest-navigation-menu__arrow')).not.toBeNull();
  });

  it('hides the chevron with hideChevron', () => {
    render(
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger hideChevron>Plain</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/a">A</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    );
    const trigger = screen.getByRole('button', { name: 'Plain' });
    expect(trigger.querySelector('.zest-navigation-menu__chevron')).toBeNull();
  });
});
