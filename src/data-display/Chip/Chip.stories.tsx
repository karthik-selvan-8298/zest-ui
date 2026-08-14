import type { Meta, StoryObj } from '@storybook/react-vite';
import { StarIcon, CheckIcon } from '../../icons';
import { Stack, Flex } from '../../primitives';
import { Avatar } from '../Avatar/Avatar';
import { Chip } from './Chip';

const meta = {
  title: 'Data Display/Chip',
  component: Chip,
  args: { label: 'Chip' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['soft', 'solid', 'outlined'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const tones = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] as const;
const variants = ['soft', 'solid', 'outlined'] as const;

export const Variants: Story = {
  render: () => (
    <Stack spacing={3}>
      {variants.map((variant) => (
        <Flex key={variant} gap={2} wrap>
          {tones.map((color) => (
            <Chip key={color} variant={variant} color={color} label={color} />
          ))}
        </Flex>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex gap={2} align="center">
      <Chip size="sm" label="Small" color="primary" />
      <Chip size="md" label="Medium" color="primary" />
    </Flex>
  ),
};

export const WithSlots: Story = {
  render: () => (
    <Flex gap={2} align="center">
      <Chip startIcon={<StarIcon />} label="Starred" color="warning" />
      <Chip startIcon={<CheckIcon />} label="Done" color="success" variant="outlined" />
      <Chip avatar={<Avatar name="Ada Lovelace" color="primary" />} label="Ada Lovelace" />
    </Flex>
  ),
};

export const Deletable: Story = {
  render: () => (
    <Flex gap={2}>
      <Chip label="Design" color="primary" onDelete={() => {}} />
      <Chip label="Engineering" color="info" variant="outlined" onDelete={() => {}} />
      <Chip label="Disabled" disabled onDelete={() => {}} />
    </Flex>
  ),
};

export const Clickable: Story = {
  render: () => (
    <Flex gap={2}>
      <Chip label="Click me" clickable onClick={() => {}} color="primary" />
      <Chip label="Click + delete" onClick={() => {}} onDelete={() => {}} color="secondary" />
      <Chip label="Disabled" clickable disabled onClick={() => {}} />
    </Flex>
  ),
};
