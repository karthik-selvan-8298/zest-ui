import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
  it('renders a group named by the legend prop', () => {
    render(
      <Fieldset legend="Billing">
        <input aria-label="Street" />
      </Fieldset>
    );
    const group = screen.getByRole('group', { name: 'Billing' });
    expect(group.tagName).toBe('FIELDSET');
    expect(group).toHaveClass('zest-fieldset');
    expect(group).toHaveAttribute('data-gap', 'md');
  });

  it('wires the description via aria-describedby', () => {
    render(
      <Fieldset legend="Billing" description="Where we send invoices.">
        <input aria-label="Street" />
      </Fieldset>
    );
    const group = screen.getByRole('group', { name: 'Billing' });
    const description = screen.getByText('Where we send invoices.');
    expect(description).toHaveClass('zest-fieldset__description');
    expect(group).toHaveAccessibleDescription('Where we send invoices.');
  });

  it('preserves a caller-provided aria-describedby alongside the description', () => {
    render(
      <>
        <p id="extra">Extra note</p>
        <Fieldset legend="Billing" description="Desc" aria-describedby="extra">
          <input aria-label="Street" />
        </Fieldset>
      </>
    );
    expect(screen.getByRole('group')).toHaveAccessibleDescription('Extra note Desc');
  });

  it('supports composed Legend and Description parts', () => {
    render(
      <Fieldset.Root gap="lg">
        <Fieldset.Legend>Notifications</Fieldset.Legend>
        <Fieldset.Description>Pick a few.</Fieldset.Description>
        <input aria-label="Alerts" type="checkbox" />
      </Fieldset.Root>
    );
    const group = screen.getByRole('group', { name: 'Notifications' });
    expect(group).toHaveAttribute('data-gap', 'lg');
    expect(document.querySelector('.zest-fieldset__header')).toBeNull();
    expect(screen.getByText('Pick a few.')).toHaveClass('zest-fieldset__description');
  });

  it('disables descendant controls', () => {
    render(
      <Fieldset legend="Archived" disabled>
        <input aria-label="Name" />
      </Fieldset>
    );
    expect(screen.getByRole('group')).toHaveAttribute('data-disabled');
    expect(screen.getByLabelText('Name')).toBeDisabled();
  });

  it('renders no header when neither legend nor description is given', () => {
    render(
      <Fieldset aria-label="Bare">
        <input aria-label="Name" />
      </Fieldset>
    );
    expect(screen.getByRole('group', { name: 'Bare' })).toBeInTheDocument();
    expect(document.querySelector('.zest-fieldset__header')).toBeNull();
  });
});
