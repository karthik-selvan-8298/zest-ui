import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../actions/Button/Button';
import { Stack } from '../../primitives';
import { Stepper } from './Stepper';

const meta = {
  title: 'Navigation/Stepper',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Horizontal: Story = {
  render: () => (
    <Stepper.Root activeStep={1} style={{ maxWidth: 640 }}>
      <Stepper.Step label="Account" />
      <Stepper.Step label="Shipping" />
      <Stepper.Step label="Payment" />
      <Stepper.Step label="Review" />
    </Stepper.Root>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Stepper.Root activeStep={2} orientation="vertical" style={{ maxWidth: 360 }}>
      <Stepper.Step label="Create workspace" description="Pick a name and a logo." />
      <Stepper.Step label="Invite your team" description="Teammates get an email invitation." />
      <Stepper.Step
        label="Connect data sources"
        description="Link the tools your team already uses."
      />
      <Stepper.Step label="Done" description="Start collaborating." />
    </Stepper.Root>
  ),
};

function ClickableStepperDemo() {
  const [activeStep, setActiveStep] = React.useState(2);
  return (
    <Stack spacing={6} style={{ maxWidth: 640 }}>
      <Stepper.Root activeStep={activeStep} onStepClick={setActiveStep}>
        <Stepper.Step label="Account" />
        <Stepper.Step label="Shipping" />
        <Stepper.Step label="Payment" />
        <Stepper.Step label="Review" />
      </Stepper.Root>
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          color="neutral"
          disabled={activeStep === 0}
          onClick={() => setActiveStep(activeStep - 1)}
        >
          Back
        </Button>
        <Button disabled={activeStep === 3} onClick={() => setActiveStep(activeStep + 1)}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
}

export const Clickable: Story = {
  render: () => <ClickableStepperDemo />,
};

export const FromStepsArray: Story = {
  render: () => (
    <Stepper.Root
      activeStep={1}
      style={{ maxWidth: 640 }}
      steps={[
        { label: 'Upload', description: 'CSV or XLSX' },
        { label: 'Map columns' },
        { label: 'Import' },
      ]}
    />
  ),
};
