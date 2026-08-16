import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '../Typography/Typography';
import { Box } from './Box';

const meta = {
  title: 'Layout/Box',
  component: Box,
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SpacingProps: Story = {
  render: () => (
    <Box
      p={6}
      mx={2}
      style={{
        background: 'var(--zest-color-surface)',
        border: '1px dashed var(--zest-color-border)',
        borderRadius: 'var(--zest-radius-surface)',
      }}
    >
      <Typography variant="body2" color="secondary">
        A polymorphic element with token-aware spacing props — this one has p={'{6}'} and mx=
        {'{2}'}.
      </Typography>
    </Box>
  ),
};

export const AsElement: Story = {
  render: () => (
    <Box as="section" py={4} px={6} style={{ background: 'var(--zest-color-background-neutral)' }}>
      <Typography variant="body2">Rendered as a semantic &lt;section&gt;.</Typography>
    </Box>
  ),
};
