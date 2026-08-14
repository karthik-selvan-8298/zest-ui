import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex, Stack } from '../../primitives';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  args: { width: 240 },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['text', 'circular', 'rectangular', 'rounded'],
    },
    animation: { control: 'inline-radio', options: ['pulse', 'wave', false] },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Stack spacing={4}>
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width={240} height={80} />
      <Skeleton variant="rounded" width={240} height={80} />
    </Stack>
  ),
};

export const Animations: Story = {
  render: () => (
    <Stack spacing={4}>
      <Skeleton variant="rounded" width={240} height={60} animation="pulse" />
      <Skeleton variant="rounded" width={240} height={60} animation="wave" />
      <Skeleton variant="rounded" width={240} height={60} animation={false} />
    </Stack>
  ),
};

export const CardPlaceholder: Story = {
  render: () => (
    <Stack spacing={3} style={{ width: 320 }}>
      <Flex gap={3} align="center">
        <Skeleton variant="circular" width={40} height={40} />
        <Stack spacing={1} style={{ flex: 1 }}>
          <Skeleton width="50%" />
          <Skeleton width="30%" />
        </Stack>
      </Flex>
      <Skeleton variant="rounded" height={160} animation="wave" />
      <Skeleton width="80%" />
      <Skeleton width="60%" />
    </Stack>
  ),
};
