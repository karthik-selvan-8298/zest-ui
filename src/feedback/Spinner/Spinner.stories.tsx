import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex, Typography } from '../../primitives';
import { Spinner } from './Spinner';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    color: {
      control: 'select',
      options: [
        'inherit',
        'primary',
        'secondary',
        'success',
        'warning',
        'error',
        'info',
        'neutral',
      ],
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Flex gap={4} align="center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size={48} />
    </Flex>
  ),
};

export const Colors: Story = {
  render: () => (
    <Flex gap={4} align="center">
      <Spinner color="primary" />
      <Spinner color="success" />
      <Spinner color="error" />
      <Spinner color="neutral" />
    </Flex>
  ),
};

export const InheritsColor: Story = {
  render: () => (
    <Flex gap={2} align="center" style={{ color: 'var(--zest-color-info)' }}>
      <Spinner size="sm" />
      <Typography variant="body2" color="inherit">
        Loading results…
      </Typography>
    </Flex>
  ),
};
