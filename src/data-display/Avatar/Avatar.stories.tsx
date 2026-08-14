import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Flex } from '../../primitives';
import { Avatar, AvatarGroup } from './Avatar';

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar,
  args: { name: 'Ada Lovelace' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'inline-radio', options: ['circle', 'rounded'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithImage: Story = {
  args: { src: 'https://i.pravatar.cc/128?img=8', name: 'Kai Zhang' },
};

const tones = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] as const;

export const Colors: Story = {
  render: () => (
    <Flex gap={2}>
      {tones.map((color) => (
        <Avatar key={color} color={color} name={color} />
      ))}
    </Flex>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex gap={2} align="center">
      <Avatar size="xs" name="Ada Lovelace" />
      <Avatar size="sm" name="Ada Lovelace" />
      <Avatar size="md" name="Ada Lovelace" />
      <Avatar size="lg" name="Ada Lovelace" />
      <Avatar size="xl" name="Ada Lovelace" />
    </Flex>
  ),
};

export const Shapes: Story = {
  render: () => (
    <Flex gap={2}>
      <Avatar shape="circle" name="Grace Hopper" color="primary" />
      <Avatar shape="rounded" name="Grace Hopper" color="primary" />
    </Flex>
  ),
};

export const Fallbacks: Story = {
  render: () => (
    <Flex gap={2}>
      <Avatar name="Ada Lovelace" />
      <Avatar name="Plato" color="info" />
      <Avatar />
      <Avatar src="/broken.png" name="Bad Image" color="warning" />
    </Flex>
  ),
};

export const Group: Story = {
  render: () => (
    <Stack spacing={4}>
      <AvatarGroup>
        <Avatar name="Ada Lovelace" color="primary" />
        <Avatar name="Grace Hopper" color="secondary" />
        <Avatar name="Kai Zhang" color="info" />
      </AvatarGroup>
      <AvatarGroup max={3} size="sm">
        <Avatar name="Ada Lovelace" color="primary" />
        <Avatar name="Grace Hopper" color="secondary" />
        <Avatar name="Kai Zhang" color="info" />
        <Avatar name="Mary Shelley" color="success" />
        <Avatar name="Alan Turing" color="warning" />
      </AvatarGroup>
    </Stack>
  ),
};
