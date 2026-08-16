import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../Flex/Flex';
import { Typography } from '../Typography/Typography';
import { Paper } from './Paper';

const meta = {
  title: 'Layout/Paper',
  component: Paper,
} satisfies Meta<typeof Paper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Elevations: Story = {
  render: () => (
    <Flex gap={4} wrap>
      {(['none', 'sm', 'card', 'md', 'lg'] as const).map((shadow) => (
        <Paper
          key={shadow}
          shadow={shadow}
          bordered={shadow === 'none'}
          radius="lg"
          style={{ padding: 'var(--zest-space-5)', minWidth: 120 }}
        >
          <Typography variant="label">{shadow}</Typography>
        </Paper>
      ))}
    </Flex>
  ),
};
