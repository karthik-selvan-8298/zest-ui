import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Stack, Typography } from '../../primitives';
import { FieldError, FormField, HelperText, Label } from '../FormField/FormField';
import { OtpInput } from './OtpInput';

const meta = {
  title: 'Forms/OtpInput',
  component: OtpInput,
  args: { length: 6, 'aria-label': 'Verification code' },
  argTypes: {
    type: { control: 'inline-radio', options: ['numeric', 'alphanumeric'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    length: { control: { type: 'number', min: 2, max: 10 } },
  },
} satisfies Meta<typeof OtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSeparator: Story = {
  args: { separator: '–' },
};

export const Sizes: Story = {
  render: () => (
    <Stack spacing={4}>
      <OtpInput size="sm" aria-label="Small code" />
      <OtpInput size="md" aria-label="Medium code" />
    </Stack>
  ),
};

export const Alphanumeric: Story = {
  args: { type: 'alphanumeric', length: 8, separator: '–', 'aria-label': 'Recovery code' },
};

export const Masked: Story = {
  args: { mask: true, length: 4, 'aria-label': 'PIN' },
};

export const States: Story = {
  render: () => (
    <Stack spacing={4}>
      <OtpInput defaultValue="1234" length={4} aria-label="Filled" />
      <OtpInput defaultValue="12" error aria-label="Error" />
      <OtpInput defaultValue="123456" disabled aria-label="Disabled" />
    </Stack>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <OtpInput fullWidth separator="–" aria-label="Verification code" />
    </div>
  ),
};

export const InFormField: Story = {
  render: () => (
    <FormField name="code" style={{ maxWidth: 360 }}>
      <Label required>Verification code</Label>
      <OtpInput autoFocus separator="–" />
      <HelperText>Enter the 6-digit code we sent to your phone.</HelperText>
    </FormField>
  ),
};

export const InvalidFormField: Story = {
  render: () => (
    <FormField name="code" invalid style={{ maxWidth: 360 }}>
      <Label>Verification code</Label>
      <OtpInput defaultValue="000000" />
      <FieldError match>That code has expired. Request a new one.</FieldError>
    </FormField>
  ),
};

function ControlledDemo() {
  const [value, setValue] = React.useState('');
  const [done, setDone] = React.useState<string | null>(null);
  return (
    <Stack spacing={3}>
      <OtpInput
        value={value}
        onValueChange={(next) => {
          setValue(next);
          setDone(null);
        }}
        onComplete={setDone}
        aria-label="Verification code"
      />
      <Typography variant="caption">
        value: "{value}" {done ? `· completed with ${done}` : ''}
      </Typography>
    </Stack>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
