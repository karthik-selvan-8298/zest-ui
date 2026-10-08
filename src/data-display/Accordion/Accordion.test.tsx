import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Accordion } from './Accordion';

function renderAccordion() {
  return render(
    <Accordion.Root defaultValue={['billing']}>
      <Accordion.Item value="billing">
        <Accordion.Trigger>Billing</Accordion.Trigger>
        <Accordion.Panel>Billing details</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="security">
        <Accordion.Trigger>Security</Accordion.Trigger>
        <Accordion.Panel>Security details</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  );
}

describe('Accordion', () => {
  it('wraps each trigger in a heading and reflects aria-expanded', async () => {
    renderAccordion();
    const billing = screen.getByRole('button', { name: 'Billing' });
    const security = screen.getByRole('button', { name: 'Security' });
    expect(billing.closest('h3')).toHaveClass('zest-accordion__header');
    expect(billing).toHaveAttribute('aria-expanded', 'true');
    expect(security).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(security);
    expect(security).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Security details')).toBeInTheDocument();
  });

  it('merges className on every part', () => {
    const { container } = render(
      <Accordion.Root className="root">
        <Accordion.Item value="a" className="item">
          <Accordion.Trigger className="trigger">A</Accordion.Trigger>
        </Accordion.Item>
      </Accordion.Root>
    );
    expect(container.querySelector('.zest-accordion')).toHaveClass('root');
    expect(container.querySelector('.zest-accordion__item')).toHaveClass('item');
    expect(screen.getByRole('button', { name: 'A' })).toHaveClass(
      'zest-accordion__trigger',
      'trigger'
    );
  });

  it('has no axe violations', async () => {
    const { container } = renderAccordion();
    expect((await axe(container)).violations).toEqual([]);
  });
});
