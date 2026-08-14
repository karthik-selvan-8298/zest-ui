import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex, Stack } from '../../primitives';
import { CalendarIcon, InboxIcon, SettingsIcon, StarIcon, UserIcon } from '../../icons';
import { IconTile } from './IconTile';

const meta = {
  title: 'Data Display/IconTile',
  component: IconTile,
} satisfies Meta<typeof IconTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <Flex gap={3} align="center" wrap>
      <IconTile color="primary"><SettingsIcon /></IconTile>
      <IconTile color="secondary"><StarIcon /></IconTile>
      <IconTile color="info"><InboxIcon /></IconTile>
      <IconTile color="warning"><CalendarIcon /></IconTile>
      <IconTile color="error"><UserIcon /></IconTile>
      <IconTile color="neutral"><SettingsIcon /></IconTile>
      <IconTile color="gradient"><StarIcon /></IconTile>
    </Flex>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={3} align="center">
      <IconTile size="sm"><SettingsIcon /></IconTile>
      <IconTile size="md"><SettingsIcon /></IconTile>
      <IconTile size="lg"><SettingsIcon /></IconTile>
      <IconTile size="xl" color="gradient"><SettingsIcon /></IconTile>
    </Stack>
  ),
};
