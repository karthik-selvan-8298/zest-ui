import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex, Typography } from '../../primitives';
import { Link } from './Link';

const meta = {
  title: 'Actions/Link',
  component: Link,
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { href: '#', children: 'Read the documentation' },
};

export const Underline: Story = {
  render: () => (
    <Flex gap={6} align="center">
      <Link href="#" underline="hover">
        Darken on hover
      </Link>
      <Link href="#" underline="underline-hover">
        Underline on hover
      </Link>
      <Link href="#" underline="always">
        Always underlined
      </Link>
      <Link href="#" underline="none">
        No underline
      </Link>
    </Flex>
  ),
};

export const InheritColor: Story = {
  render: () => (
    <Typography variant="body2" color="secondary">
      Body copy with an{' '}
      <Link href="#" color="inherit" underline="always">
        inherited-color link
      </Link>{' '}
      and an{' '}
      <Link href="https://example.com" external>
        external link
      </Link>
      .
    </Typography>
  ),
};
