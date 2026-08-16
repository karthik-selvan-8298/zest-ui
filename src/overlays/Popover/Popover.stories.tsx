import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '../../primitives';
import { Button } from '../../actions/Button/Button';
import { Popover } from './Popover';

const meta = {
  title: 'Overlays/Popover',
  component: Popover.Root,
} satisfies Meta<typeof Popover.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger render={<Button variant="soft">Open popover</Button>} />
      <Popover.Content style={{ maxWidth: 260 }}>
        <Popover.Title render={<Typography variant="label" as="h4" />}>
          Quick settings
        </Popover.Title>
        <Typography variant="body-sm" color="secondary" as="p" style={{ marginBottom: 0 }}>
          Anchored, dismissible, and focus-managed by Base UI.
        </Typography>
      </Popover.Content>
    </Popover.Root>
  ),
};
