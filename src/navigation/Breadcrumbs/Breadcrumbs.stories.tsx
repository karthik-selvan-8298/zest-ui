import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { Breadcrumbs } from './Breadcrumbs';

const meta = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Reports', href: '#' },
      { label: 'Q3 revenue' },
    ],
  },
};

export const Composed: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Settings</Breadcrumbs.Item>
      <Breadcrumbs.Item>Notifications</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};

export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumbs
      separator="/"
      items={[{ label: 'Home', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Zest UI' }]}
    />
  ),
};

export const Collapsed: Story = {
  render: () => (
    <Stack spacing={3}>
      <Breadcrumbs
        maxItems={3}
        items={[
          { label: 'Home', href: '#' },
          { label: 'Workspaces', href: '#' },
          { label: 'Engineering', href: '#' },
          { label: 'Design systems', href: '#' },
          { label: 'Zest UI' },
        ]}
      />
    </Stack>
  ),
};
