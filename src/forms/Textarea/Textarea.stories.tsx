import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { Textarea } from './Textarea';

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Multi-line notes…', 'aria-label': 'Notes' },
};

export const States: Story = {
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 360 }}>
      <Textarea aria-label="Default" placeholder="Default" fullWidth />
      <Textarea aria-label="Error" placeholder="Error state" error fullWidth />
      <Textarea aria-label="Disabled" placeholder="Disabled" disabled fullWidth />
    </Stack>
  ),
};
