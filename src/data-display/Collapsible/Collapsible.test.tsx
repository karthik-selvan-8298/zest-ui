import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Collapsible } from './Collapsible';

describe('Collapsible', () => {
  it('toggles the panel and aria-expanded from the trigger', async () => {
    const onOpenChange = vi.fn();
    render(
      <Collapsible.Root onOpenChange={onOpenChange}>
        <Collapsible.Trigger>Advanced options</Collapsible.Trigger>
        <Collapsible.Panel>Hidden settings</Collapsible.Panel>
      </Collapsible.Root>
    );
    const trigger = screen.getByRole('button', { name: 'Advanced options' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(onOpenChange).toHaveBeenLastCalledWith(true, expect.anything());
    expect(screen.getByText('Hidden settings')).toBeInTheDocument();
  });

  it('starts open with defaultOpen and wraps content in the padded inner div', () => {
    const { container } = render(
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>More</Collapsible.Trigger>
        <Collapsible.Panel className="panel">Body</Collapsible.Panel>
      </Collapsible.Root>
    );
    expect(screen.getByRole('button', { name: 'More' })).toHaveAttribute('aria-expanded', 'true');
    const panel = container.querySelector('.zest-collapsible__panel');
    expect(panel).toHaveClass('panel');
    expect(panel?.querySelector('.zest-collapsible__content')).toHaveTextContent('Body');
  });
});
