import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../actions/Button/Button';
import { Flex, Stack } from '../../primitives';
import { Drawer } from './Drawer';

const meta = {
  title: 'Overlays/Drawer',
  component: Drawer.Root,
} satisfies Meta<typeof Drawer.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger render={<Button variant="outlined" color="neutral">Open drawer</Button>} />
      <Drawer.Content title="Filters" description="Narrow down the result list.">
        <Stack spacing={4}>
          <span>Drawer body content goes here.</span>
          <Drawer.Close render={<Button variant="ghost" color="neutral" />}>Done</Drawer.Close>
        </Stack>
      </Drawer.Content>
    </Drawer.Root>
  ),
};

export const Sides: Story = {
  render: () => (
    <Flex gap={2}>
      <Drawer.Root>
        <Drawer.Trigger render={<Button variant="outlined" color="neutral">Right</Button>} />
        <Drawer.Content side="right" title="Right drawer">
          Slides in from the right edge.
        </Drawer.Content>
      </Drawer.Root>
      <Drawer.Root>
        <Drawer.Trigger render={<Button variant="outlined" color="neutral">Left</Button>} />
        <Drawer.Content side="left" title="Left drawer">
          Slides in from the left edge.
        </Drawer.Content>
      </Drawer.Root>
      <Drawer.Root>
        <Drawer.Trigger render={<Button variant="outlined" color="neutral">Bottom</Button>} />
        <Drawer.Content side="bottom" title="Bottom sheet">
          Slides up from the bottom edge.
        </Drawer.Content>
      </Drawer.Root>
    </Flex>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex gap={2}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Drawer.Root key={size}>
          <Drawer.Trigger render={<Button variant="outlined" color="neutral">{size}</Button>} />
          <Drawer.Content size={size} title={`Size ${size}`}>
            {size === 'sm' ? '320px wide.' : size === 'md' ? '400px wide.' : '560px wide.'}
          </Drawer.Content>
        </Drawer.Root>
      ))}
    </Flex>
  ),
};

export const WithoutCloseButton: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger render={<Button variant="outlined" color="neutral">Open</Button>} />
      <Drawer.Content title="No close button" hideClose>
        <Stack spacing={4}>
          <span>Dismiss with the button below or press Escape.</span>
          <Drawer.Close render={<Button color="primary" />}>Close</Drawer.Close>
        </Stack>
      </Drawer.Content>
    </Drawer.Root>
  ),
};
