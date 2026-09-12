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

const people = [
  { name: 'Ada Lovelace', role: 'Engineering', color: 'primary' },
  { name: 'Grace Hopper', role: 'Compilers', color: 'secondary' },
  { name: 'Katherine Johnson', role: 'Orbital mechanics', color: 'info' },
  { name: 'Margaret Hamilton', role: 'Flight software', color: 'success' },
  { name: 'Radia Perlman', role: 'Networking', color: 'warning' },
] as const;

export const Rows: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <List.Root>
        {people.map((person, index) => (
          <List.Row
            key={person.name}
            leading={<Avatar name={person.name} size="sm" color={person.color} />}
            title={person.name}
            subtitle={person.role}
            trailing={
              <IconButton aria-label={`More options for ${person.name}`} size="sm">
                <MoreVerticalIcon />
              </IconButton>
            }
            onClick={() => {}}
            selected={index === 1}
            disabled={index === 4}
            divider
          />
        ))}
      </List.Root>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`List.Row` is the one-line recipe: `leading` + `title`/`subtitle` + `trailing`. With `onClick`/`href` the title area becomes the control and the trailing slot stays a sibling, so the menu button is never nested inside another button.',
      },
    },
  },
};
