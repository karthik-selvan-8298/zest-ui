import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../primitives';
import { EditIcon, SettingsIcon, StarIcon, TrashIcon } from '../../icons';
import { IconButton } from './IconButton';

const meta = {
  title: 'Actions/IconButton',
  component: IconButton,
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { 'aria-label': 'Settings', children: <SettingsIcon /> },
};

export const Variants: Story = {
  args: { 'aria-label': 'Example' },
  render: () => (
    <Flex gap={3} align="center">
      <IconButton aria-label="Edit" variant="solid" color="primary">
        <EditIcon />
      </IconButton>
      <IconButton aria-label="Star" variant="soft" color="primary">
        <StarIcon />
      </IconButton>
      <IconButton aria-label="Settings" variant="outlined" color="neutral">
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="Delete" variant="ghost" color="error">
        <TrashIcon />
      </IconButton>
    </Flex>
  ),
};

export const SizesAndShape: Story = {
  args: { 'aria-label': 'Example' },
  render: () => (
    <Flex gap={3} align="center">
      <IconButton aria-label="Small" size="sm">
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="Medium" size="md">
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="Large" size="lg">
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="Round" shape="round" variant="soft" color="primary">
        <StarIcon />
      </IconButton>
      <IconButton aria-label="Disabled" disabled>
        <SettingsIcon />
      </IconButton>
    </Flex>
  ),
};
