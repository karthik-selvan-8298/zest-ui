import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Typography } from '../../primitives';
import { Combobox } from './Combobox';

const meta = {
  title: 'Forms/Combobox',
  component: Combobox,
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'papaya', label: 'Papaya', disabled: true },
];

export const Default: Story = {
  args: {
    options: fruits,
    placeholder: 'Search fruit…',
    'aria-label': 'Fruit',
  },
};

function ControlledDemo() {
  const [value, setValue] = React.useState<string | null>('cherry');
  return (
    <Stack spacing={2}>
      <Combobox aria-label="Fruit" options={fruits} value={value} onValueChange={setValue} />
      <Typography variant="body2" color="secondary">
        Selected: {value ?? 'none'}
      </Typography>
    </Stack>
  );
}

export const Controlled: Story = {
  args: { options: fruits },
  render: () => <ControlledDemo />,
};

export const States: Story = {
  args: { options: fruits },
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 280 }}>
      <Combobox aria-label="Small" options={fruits} size="sm" placeholder="Small" fullWidth />
      <Combobox aria-label="Error" options={fruits} error placeholder="Error state" fullWidth />
      <Combobox aria-label="Disabled" options={fruits} disabled placeholder="Disabled" fullWidth />
    </Stack>
  ),
};
