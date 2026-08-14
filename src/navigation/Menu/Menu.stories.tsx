import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../actions/Button/Button';
import { CopyIcon, EditIcon, TrashIcon } from '../../icons';
import { Menu } from './Menu';

const meta = {
  title: 'Navigation/Menu',
  component: Menu.Root,
} satisfies Meta<typeof Menu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger render={<Button variant="outlined" color="neutral">Actions</Button>} />
      <Menu.Content>
        <Menu.Item>Duplicate</Menu.Item>
        <Menu.Item>Rename</Menu.Item>
        <Menu.Item disabled>Move to…</Menu.Item>
        <Menu.Separator />
        <Menu.Item destructive>Delete</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger render={<Button variant="outlined" color="neutral">Edit</Button>} />
      <Menu.Content>
        <Menu.Item>
          <EditIcon /> Rename
        </Menu.Item>
        <Menu.Item>
          <CopyIcon /> Duplicate
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item destructive>
          <TrashIcon /> Delete
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const Grouped: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger render={<Button variant="outlined" color="neutral">View</Button>} />
      <Menu.Content>
        <Menu.Group>
          <Menu.GroupLabel>Layout</Menu.GroupLabel>
          <Menu.Item>Grid</Menu.Item>
          <Menu.Item>List</Menu.Item>
        </Menu.Group>
        <Menu.Separator />
        <Menu.Group>
          <Menu.GroupLabel>Density</Menu.GroupLabel>
          <Menu.Item>Comfortable</Menu.Item>
          <Menu.Item>Compact</Menu.Item>
        </Menu.Group>
      </Menu.Content>
    </Menu.Root>
  ),
};
