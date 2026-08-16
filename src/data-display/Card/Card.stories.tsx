import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, Typography, Divider, Stack } from '../../primitives';
import { MoreVerticalIcon } from '../../icons';
import { Button } from '../../actions/Button/Button';
import { IconButton } from '../../actions/IconButton/IconButton';
import { Card } from './Card';

const meta = {
  title: 'Data Display/Card',
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 400 }}>
      <Card.Header
        title="Team settings"
        subtitle="Manage members and roles"
        action={
          <IconButton aria-label="More options">
            <MoreVerticalIcon />
          </IconButton>
        }
      />
      <Card.Content>
        <Typography color="secondary" variant="body2">
          Cards use the Sigma surface language: 16px radius and the soft two-layer card shadow.
        </Typography>
      </Card.Content>
      <Card.Footer>
        <Button size="sm">Save</Button>
        <Button size="sm" variant="ghost" color="neutral">
          Cancel
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <Grid minChildWidth="240px" gap={4}>
      <Card>
        <Card.Content>Elevated (default)</Card.Content>
      </Card>
      <Card variant="outlined">
        <Card.Content>Outlined</Card.Content>
      </Card>
    </Grid>
  ),
};

export const WithSections: Story = {
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <Card.Header title="Usage" subtitle="Last 30 days" />
      <Card.Content>
        <Stack spacing={3} divider={<Divider variant="dashed" />}>
          <Stack direction="row" justify="between">
            <Typography variant="body2" color="secondary">
              API calls
            </Typography>
            <Typography variant="subtitle2">128,441</Typography>
          </Stack>
          <Stack direction="row" justify="between">
            <Typography variant="body2" color="secondary">
              Storage
            </Typography>
            <Typography variant="subtitle2">18.2 GB</Typography>
          </Stack>
          <Stack direction="row" justify="between">
            <Typography variant="body2" color="secondary">
              Seats
            </Typography>
            <Typography variant="subtitle2">12 / 20</Typography>
          </Stack>
        </Stack>
      </Card.Content>
    </Card>
  ),
};
