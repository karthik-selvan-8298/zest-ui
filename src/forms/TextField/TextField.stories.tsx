import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from '../../primitives';
import { SearchIcon } from '../../icons';
import { TextField } from './TextField';

const meta = {
  title: 'Forms/TextField',
  component: TextField,
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@company.com',
    helperText: 'Use your work email.',
    fullWidth: true,
  },
};

export const States: Story = {
  render: () => (
    <Grid minChildWidth="240px" gap={4}>
      <TextField label="Default" placeholder="Placeholder" />
      <TextField label="Required" required placeholder="Required" />
      <TextField label="Disabled" disabled placeholder="Disabled" defaultValue="Read only-ish" />
      <TextField label="Error" errorText="This field is required." placeholder="Invalid" />
      <TextField label="Small" size="sm" placeholder="Small field" />
      <TextField label="With prefix" startAdornment="$" placeholder="0.00" />
    </Grid>
  ),
};

export const OutlinedWithIconAndError: Story = {
  render: () => (
    <Grid minChildWidth="260px" gap={4}>
      <TextField label="Email" startIcon={<SearchIcon />} placeholder="Search users…" />
      <TextField
        label="Email"
        required
        startIcon={<SearchIcon />}
        defaultValue="not-an-email"
        errorText="Enter a valid email address."
      />
    </Grid>
  ),
};

export const FloatingLabels: Story = {
  render: () => (
    <Grid minChildWidth="240px" gap={4}>
      <TextField label="Email address" labelPlacement="floating" />
      <TextField label="With value" labelPlacement="floating" defaultValue="Prefilled text" />
      <TextField
        label="With placeholder"
        labelPlacement="floating"
        placeholder="Shown once focused"
      />
      <TextField
        label="Error"
        labelPlacement="floating"
        errorText="This field is required."
        required
      />
    </Grid>
  ),
};
