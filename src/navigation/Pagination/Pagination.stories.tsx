import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { Pagination } from './Pagination';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  args: { count: 10 },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ManyPages: Story = {
  args: { count: 42, defaultPage: 21 },
};

export const BoundaryAndSiblings: Story = {
  render: () => (
    <Stack spacing={3}>
      <Pagination count={30} defaultPage={15} siblingCount={0} />
      <Pagination count={30} defaultPage={15} siblingCount={2} />
      <Pagination count={30} defaultPage={15} boundaryCount={2} />
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack spacing={3}>
      <Pagination count={10} defaultPage={5} size="md" />
      <Pagination count={10} defaultPage={5} size="sm" />
    </Stack>
  ),
};

export const Disabled: Story = {
  args: { count: 10, defaultPage: 3, disabled: true },
};
