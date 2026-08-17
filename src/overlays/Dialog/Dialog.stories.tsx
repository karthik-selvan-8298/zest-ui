import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, Stack } from '../../primitives';
import { Button } from '../../actions/Button/Button';
import { ButtonGroup } from '../../actions/ButtonGroup/ButtonGroup';
import { FormField, Label } from '../../forms/FormField/FormField';
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

export const LongContent: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button>Open long dialog</Button>} />
      <Dialog.Content title="Terms of service" description="Scroll to review the terms.">
        <Stack spacing={2}>
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i} style={{ margin: 0 }}>
              {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>
          ))}
        </Stack>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="ghost" color="neutral">Decline</Button>} />
          <Dialog.Close render={<Button>Accept</Button>} />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

export const FormLayout: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button>Create webhook</Button>} />
      <Dialog.Content
        size="lg"
        title="Create webhook"
        description="The webhook will respond to any hit with the status, headers and body you configure here."
      >
        <Stack spacing={4}>
          <TextField label="Name" required placeholder="e.g. Stripe test webhook" fullWidth />
          <Grid columns={2} gap={4}>
            <TextField label="Status code" required defaultValue="200" fullWidth />
            <TextField label="Retain requests (days)" defaultValue="30" fullWidth />
            <FormField>
              <Label>Access</Label>
              <ButtonGroup fullWidth>
                <Button>Public</Button>
                <Button variant="ghost" color="neutral">
                  Auth required
                </Button>
              </ButtonGroup>
            </FormField>
            <TextField
              label="Response delay (s)"
              defaultValue="0"
              helperText="Wait before responding (0–300 s)."
              fullWidth
            />
          </Grid>
        </Stack>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="ghost" color="neutral">Cancel</Button>} />
          <Dialog.Close render={<Button>Create webhook</Button>} />
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
