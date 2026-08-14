import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';

function renderTabs() {
  return render(
    <Tabs.Root defaultValue="one">
      <Tabs.List>
        <Tabs.Tab value="one">One</Tabs.Tab>
        <Tabs.Tab value="two">Two</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="one">Panel one</Tabs.Panel>
      <Tabs.Panel value="two">Panel two</Tabs.Panel>
    </Tabs.Root>
  );
}

describe('Tabs', () => {
  it('shows the default panel', () => {
    renderTabs();
    expect(screen.getByText('Panel one')).toBeVisible();
    expect(screen.queryByText('Panel two')).not.toBeInTheDocument();
  });

  it('switches panels on click', async () => {
    renderTabs();
    await userEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(screen.getByText('Panel two')).toBeVisible();
  });

  it('supports arrow-key navigation', async () => {
    renderTabs();
    const first = screen.getByRole('tab', { name: 'One' });
    first.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus();
  });

  it('has correct aria roles', () => {
    renderTabs();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });
});
