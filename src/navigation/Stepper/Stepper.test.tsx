import type * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Stepper } from './Stepper';

function renderStepper(props: Partial<React.ComponentProps<typeof Stepper.Root>> = {}) {
  return render(
    <Stepper.Root activeStep={1} {...props}>
      <Stepper.Step label="Account" />
      <Stepper.Step label="Shipping" description="Where should we deliver?" />
      <Stepper.Step label="Payment" />
    </Stepper.Root>
  );
}

describe('Stepper', () => {
  it('renders completed, active, and upcoming states', () => {
    const { container } = renderStepper();
    const steps = container.querySelectorAll('.zest-stepper__step');
    expect(steps).toHaveLength(3);
    expect(steps[0]).toHaveAttribute('data-status', 'completed');
    expect(steps[1]).toHaveAttribute('data-status', 'active');
    expect(steps[2]).toHaveAttribute('data-status', 'upcoming');

    // Completed steps show a check icon instead of their number.
    expect(steps.item(0).querySelector('.zest-stepper__indicator svg')).toBeInTheDocument();
    expect(steps.item(0).querySelector('.zest-stepper__indicator')).not.toHaveTextContent('1');
    // Active and upcoming steps show their 1-based number.
    expect(steps.item(1).querySelector('.zest-stepper__indicator')).toHaveTextContent('2');
    expect(steps.item(2).querySelector('.zest-stepper__indicator')).toHaveTextContent('3');

    expect(screen.getByText('Where should we deliver?')).toBeInTheDocument();
  });

  it('renders steps from the steps array prop', () => {
    render(<Stepper.Root activeStep={0} steps={[{ label: 'One' }, { label: 'Two' }]} />);
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('marks the active step with aria-current="step"', () => {
    const { container } = renderStepper();
    const current = container.querySelectorAll('[aria-current="step"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent('Shipping');
  });

  it('fires onStepClick only for previous steps', async () => {
    const onStepClick = vi.fn();
    renderStepper({ onStepClick });

    // Only the completed step is a button.
    const completed = screen.getByRole('button', { name: /Account/ });
    expect(screen.queryByRole('button', { name: /Shipping/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Payment/ })).not.toBeInTheDocument();

    await userEvent.click(completed);
    expect(onStepClick).toHaveBeenCalledTimes(1);
    expect(onStepClick).toHaveBeenCalledWith(0);
  });

  it('renders no step buttons without onStepClick', () => {
    renderStepper();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
