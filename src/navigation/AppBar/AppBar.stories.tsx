import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '../../primitives';
import { MenuIcon, SearchIcon } from '../../icons';
import { IconButton } from '../../actions/IconButton/IconButton';
import { TextField } from '../../forms/TextField/TextField';
import { Avatar } from '../../data-display/Avatar/Avatar';
import { AppBar } from './AppBar';

const meta = {
  title: 'Navigation/AppBar',
  component: AppBar,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div>
      <AppBar
        start={
          <>
            <IconButton aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle2">Dashboard</Typography>
          </>
        }
        center={<TextField placeholder="Search…" startIcon={<SearchIcon />} size="sm" />}
        end={<Avatar name="Karthikselvan N" variant="solid" color="primary" size="sm" />}
      />
      <div style={{ height: 240, padding: 24 }}>
        <Typography color="secondary" variant="body2">
          Content scrolls under the sticky, blurred bar.
        </Typography>
      </div>
    </div>
  ),
};
