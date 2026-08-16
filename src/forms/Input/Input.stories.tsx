import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { SearchIcon, UserIcon } from '../../icons';
import { Input } from './Input';

const meta = {
  title: 'Forms/Input',
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Bare input', 'aria-label': 'Bare input' },
};

export const Adornments: Story = {
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 320 }}>
      <Input aria-label="Search" placeholder="Search…" startIcon={<SearchIcon />} fullWidth />
      <Input aria-label="Username" placeholder="Username" endIcon={<UserIcon />} fullWidth />
      <Input aria-label="Amount" placeholder="0.00" startAdornment="$" endAdornment="USD" fullWidth />
    </Stack>
  ),
};

export const States: Story = {
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 320 }}>
      <Input aria-label="Small" placeholder="Small" size="sm" fullWidth />
      <Input aria-label="Error" placeholder="Error state" error fullWidth />
      <Input aria-label="Disabled" placeholder="Disabled" disabled fullWidth />
    </Stack>
  ),
};
