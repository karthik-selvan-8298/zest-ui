import type { Meta, StoryObj } from '@storybook/react-vite';
import { Paper } from '../Paper/Paper';
import { Typography } from '../Typography/Typography';
import { Grid } from './Grid';

const meta = {
  title: 'Layout/Grid',
  component: Grid,
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FixedColumns: Story = {
  render: () => (
    <Grid columns={4} gap={3}>
      {Array.from({ length: 8 }, (_, i) => (
        <Paper
          key={i}
          bordered
          radius="md"
          style={{
            padding: 'var(--zest-space-3)',
            background: 'color-mix(in srgb, var(--zest-color-primary) 8%, transparent)',
          }}
        >
          <Typography variant="body-sm">Cell {i + 1}</Typography>
        </Paper>
      ))}
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Fixed column counts adjust on their own: 2 columns under 900px, 1 column under 600px.',
      },
    },
  },
};

export const AutoFit: Story = {
  render: () => (
    <Grid minChildWidth="160px" gap={3}>
      {Array.from({ length: 6 }, (_, i) => (
        <Paper
          key={i}
          bordered
          radius="md"
          style={{
            padding: 'var(--zest-space-3)',
            background: 'color-mix(in srgb, var(--zest-color-primary) 8%, transparent)',
          }}
        >
          <Typography variant="body-sm">Cell {i + 1}</Typography>
        </Paper>
      ))}
    </Grid>
  ),
};
