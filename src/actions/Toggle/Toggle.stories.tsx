import type { Meta, StoryObj } from '@storybook/react-vite';
import { StarIcon, EyeIcon, EditIcon } from '../../icons';
import { Flex, Stack } from '../../primitives';
import { Toggle } from './Toggle';

const meta = {
  title: 'Actions/Toggle',
  component: Toggle,
  args: { 'aria-label': 'Favorite', children: <StarIcon /> },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const tones = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] as const;

export const Colors: Story = {
  render: () => (
    <Flex gap={2} wrap>
      {tones.map((color) => (
        <Toggle key={color} color={color} defaultPressed aria-label={color}>
          <StarIcon />
        </Toggle>
      ))}
    </Flex>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex gap={2} align="center">
      <Toggle size="sm" defaultPressed aria-label="Small">
        <EditIcon />
      </Toggle>
      <Toggle size="md" defaultPressed aria-label="Medium">
        <EditIcon />
      </Toggle>
      <Toggle size="lg" defaultPressed aria-label="Large">
        <EditIcon />
      </Toggle>
    </Flex>
  ),
};

export const States: Story = {
  render: () => (
    <Stack spacing={3}>
      <Flex gap={2}>
        <Toggle aria-label="Unpressed">
          <EyeIcon />
        </Toggle>
        <Toggle defaultPressed aria-label="Pressed">
          <EyeIcon />
        </Toggle>
      </Flex>
      <Flex gap={2}>
        <Toggle disabled aria-label="Disabled">
          <EyeIcon />
        </Toggle>
        <Toggle disabled defaultPressed aria-label="Disabled pressed">
          <EyeIcon />
        </Toggle>
      </Flex>
    </Stack>
  ),
};
