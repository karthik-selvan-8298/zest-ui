import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlusIcon, ArrowRightIcon } from '../../icons';
import { Stack, Flex } from '../../primitives';
import { Button } from './Button';

const meta = {
  title: 'Actions/Button',
  component: Button,
  args: { children: 'Button' },
  argTypes: {
    variant: { control: 'select', options: ['solid', 'outlined', 'ghost', 'soft'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const tones = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] as const;
const variants = ['solid', 'soft', 'outlined', 'ghost'] as const;

export const Variants: Story = {
  render: () => (
    <Stack spacing={4}>
      {variants.map((variant) => (
        <Flex key={variant} gap={2} wrap>
          {tones.map((color) => (
            <Button key={color} variant={variant} color={color}>
              {color}
            </Button>
          ))}
        </Flex>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex gap={2} align="center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Flex>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Flex gap={2}>
      <Button startIcon={<PlusIcon />}>New item</Button>
      <Button variant="outlined" endIcon={<ArrowRightIcon />}>
        Continue
      </Button>
    </Flex>
  ),
};

export const States: Story = {
  render: () => (
    <Flex gap={2}>
      <Button loading>Saving…</Button>
      <Button disabled>Disabled</Button>
      <Button fullWidth>Full width</Button>
    </Flex>
  ),
};
