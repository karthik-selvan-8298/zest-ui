import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, Stack, Typography } from '../primitives';
import * as icons from './icons';

const meta = {
  title: 'Foundation/Icons',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Gallery: Story = {
  render: () => (
    <Grid minChildWidth="120px" gap={3}>
      {Object.entries(icons).map(([name, Icon]) => (
        <Stack
          key={name}
          spacing={2}
          align="center"
          style={{
            padding: 'var(--zest-space-3)',
            border: '1px solid var(--zest-color-border-subtle)',
            borderRadius: 'var(--zest-radius-md)',
          }}
        >
          <Icon size={24} />
          <Typography variant="caption" align="center" style={{ wordBreak: 'break-all' }}>
            {name.replace(/Icon$/, '')}
          </Typography>
        </Stack>
      ))}
    </Grid>
  ),
};
