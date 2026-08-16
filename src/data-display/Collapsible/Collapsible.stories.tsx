import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider, Stack } from '../../primitives';
import { Collapsible } from './Collapsible';

const meta = {
  title: 'Data Display/Collapsible',
  component: Collapsible.Root,
} satisfies Meta<typeof Collapsible.Root>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Stack spacing={1} style={{ maxWidth: 420 }} divider={<Divider />}>
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>Advanced options</Collapsible.Trigger>
        <Collapsible.Panel>
          Retries, timeouts, and webhook signing configuration live here.
        </Collapsible.Panel>
      </Collapsible.Root>
      <Collapsible.Root>
        <Collapsible.Trigger>Danger zone</Collapsible.Trigger>
        <Collapsible.Panel>Delete this project and all of its data.</Collapsible.Panel>
      </Collapsible.Root>
    </Stack>
  ),
};
