import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserIcon, SettingsIcon, StarIcon, MoreVerticalIcon, ChevronRightIcon } from '../../icons';
import { IconButton } from '../../actions/IconButton/IconButton';
import { Avatar } from '../Avatar/Avatar';
import { List } from './List';

const meta = {
  title: 'Data Display/List',
  component: List.Root,
} satisfies Meta<typeof List.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <List.Root>
        <List.Item>
          <List.ItemIcon>
            <UserIcon />
          </List.ItemIcon>
          <List.ItemText primary="Profile" secondary="Name, avatar, contact details" />
        </List.Item>
        <List.Item>
          <List.ItemIcon>
            <SettingsIcon />
          </List.ItemIcon>
          <List.ItemText primary="Preferences" secondary="Theme, language, notifications" />
        </List.Item>
        <List.Item>
          <List.ItemIcon>
            <StarIcon />
          </List.ItemIcon>
          <List.ItemText primary="Starred" />
        </List.Item>
      </List.Root>
    </div>
  ),
};

export const BorderedWithActions: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <List.Root bordered>
        <List.Item>
          <List.ItemIcon>
            <Avatar name="Ada Lovelace" size="sm" color="primary" />
          </List.ItemIcon>
          <List.ItemText primary="Ada Lovelace" secondary="Engineering" />
          <List.ItemAction>
            <IconButton aria-label="More options" size="sm">
              <MoreVerticalIcon />
            </IconButton>
          </List.ItemAction>
        </List.Item>
        <List.Item>
          <List.ItemIcon>
            <Avatar name="Grace Hopper" size="sm" color="secondary" />
          </List.ItemIcon>
          <List.ItemText primary="Grace Hopper" secondary="Compilers" />
          <List.ItemAction>
            <IconButton aria-label="More options" size="sm">
              <MoreVerticalIcon />
            </IconButton>
          </List.ItemAction>
        </List.Item>
      </List.Root>
    </div>
  ),
};

export const Clickable: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <List.Root bordered inset>
        {['General', 'Security', 'Billing'].map((section) => (
          <List.Item key={section} onClick={() => {}}>
            <List.ItemIcon>
              <SettingsIcon />
            </List.ItemIcon>
            <List.ItemText primary={section} secondary={`${section} settings`} />
            <List.ItemAction>
              <ChevronRightIcon />
            </List.ItemAction>
          </List.Item>
        ))}
      </List.Root>
    </div>
  ),
};
