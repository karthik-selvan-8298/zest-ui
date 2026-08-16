import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { PasswordInput } from './PasswordInput';

const meta = {
  title: 'Forms/PasswordInput',
  component: PasswordInput,
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Password', 'aria-label': 'Password' },
};

export const States: Story = {
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 320 }}>
      <PasswordInput aria-label="Visible" defaultValue="hunter2" defaultVisible fullWidth />
      <PasswordInput aria-label="Error" placeholder="Error state" error fullWidth />
      <PasswordInput aria-label="Disabled" placeholder="Disabled" disabled fullWidth />
    </Stack>
  ),
};
