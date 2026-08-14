import type { Meta, StoryObj } from '@storybook/react-vite';
import { InboxIcon } from '../../icons';
import { IconButton } from '../../actions/IconButton/IconButton';
import { Avatar } from '../Avatar/Avatar';
import { Flex } from '../../primitives';
import { Badge } from './Badge';

const meta = {
  title: 'Data Display/Badge',
  component: Badge,
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
    },
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { count: 5 },
  render: (args) => (
    <Badge {...args}>
      <IconButton aria-label="Notifications" variant="soft">
        <InboxIcon />
      </IconButton>
    </Badge>
  ),
};

export const MaxOverflow: Story = {
  render: () => (
    <Flex gap={4}>
      <Badge count={99}>
        <IconButton aria-label="Inbox" variant="soft">
          <InboxIcon />
        </IconButton>
      </Badge>
      <Badge count={1200}>
        <IconButton aria-label="Inbox" variant="soft">
          <InboxIcon />
        </IconButton>
      </Badge>
      <Badge count={1200} max={999}>
        <IconButton aria-label="Inbox" variant="soft">
          <InboxIcon />
        </IconButton>
      </Badge>
    </Flex>
  ),
};

export const Dot: Story = {
  render: () => (
    <Flex gap={4}>
      <Badge dot color="success" position="bottom-right">
        <Avatar name="Ada Lovelace" color="primary" />
      </Badge>
      <Badge dot color="error">
        <IconButton aria-label="Notifications" variant="soft">
          <InboxIcon />
        </IconButton>
      </Badge>
    </Flex>
  ),
};

export const ShowZero: Story = {
  render: () => (
    <Flex gap={4}>
      <Badge count={0}>
        <IconButton aria-label="Inbox" variant="soft">
          <InboxIcon />
        </IconButton>
      </Badge>
      <Badge count={0} showZero color="neutral">
        <IconButton aria-label="Inbox" variant="soft">
          <InboxIcon />
        </IconButton>
      </Badge>
    </Flex>
  ),
};

export const Standalone: Story = {
  render: () => (
    <Flex gap={2} align="center">
      <Badge count={3} color="primary" />
      <Badge count={42} color="info" />
      <Badge count={500} color="error" />
      <Badge dot color="success" />
    </Flex>
  ),
};
