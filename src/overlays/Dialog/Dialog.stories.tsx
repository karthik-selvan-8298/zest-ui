import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { Button } from '../../actions/Button/Button';
import { TextField } from '../../forms/TextField/TextField';
import { Dialog } from './Dialog';

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog.Root,
} satisfies Meta<typeof Dialog.Root>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button>Edit profile</Button>} />
      <Dialog.Content
        title="Edit profile"
        description="Update your account details. Changes are saved immediately."
      >
        <Stack spacing={4}>
          <TextField label="Display name" defaultValue="Karthik" fullWidth />
          <TextField label="Job title" placeholder="e.g. Product Engineer" fullWidth />
        </Stack>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="ghost" color="neutral">Cancel</Button>} />
          <Dialog.Close render={<Button>Save changes</Button>} />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Dialog.Root key={size}>
          <Dialog.Trigger render={<Button variant="outlined">{size}</Button>} />
          <Dialog.Content size={size} title={`Dialog ${size}`}>
            This dialog uses size “{size}”.
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </Stack>
  ),
};
