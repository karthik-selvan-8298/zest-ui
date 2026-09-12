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
      <Menu.Trigger
        render={
          <Button variant="outlined" color="neutral">
            Actions
          </Button>
        }
      />
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
      <Menu.Trigger
        render={
          <Button variant="outlined" color="neutral">
            Edit
          </Button>
        }
      />
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
      <Menu.Trigger
        render={
          <Button variant="outlined" color="neutral">
            View
          </Button>
        }
      />
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

export const Submenu: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger
        render={
          <Button variant="outlined" color="neutral">
            File
          </Button>
        }
      />
      <Menu.Content>
        <Menu.Item>Open</Menu.Item>
        <Menu.Item>Download</Menu.Item>
        <Menu.SubmenuRoot>
          <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
          <Menu.Content>
            <Menu.Item>Copy link</Menu.Item>
            <Menu.Item>Email</Menu.Item>
            <Menu.Item>Invite people…</Menu.Item>
          </Menu.Content>
        </Menu.SubmenuRoot>
        <Menu.Separator />
        <Menu.Item destructive>
          <TrashIcon /> Move to trash
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

/* Radio items pick one theme; the checkbox item toggles an independent setting. */
export const Appearance: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger
        render={
          <Button variant="outlined" color="neutral">
            Appearance
          </Button>
        }
      />
      <Menu.Content>
        <Menu.Group>
          <Menu.GroupLabel>Theme</Menu.GroupLabel>
          <Menu.RadioGroup defaultValue="system">
            <Menu.RadioItem value="light">Light</Menu.RadioItem>
            <Menu.RadioItem value="dark">Dark</Menu.RadioItem>
            <Menu.RadioItem value="system">System</Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Group>
        <Menu.Separator />
        <Menu.CheckboxItem defaultChecked>Compact rows</Menu.CheckboxItem>
        <Menu.CheckboxItem disabled>Show line numbers</Menu.CheckboxItem>
      </Menu.Content>
    </Menu.Root>
  ),
};
