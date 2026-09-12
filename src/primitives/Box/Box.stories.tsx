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

export const SizingProps: Story = {
  render: () => (
    <Box
      as="section"
      p={4}
      width="100%"
      maxWidth={480}
      minHeight={96}
      overflow="auto"
      style={{
        border: '1px dashed var(--zest-color-border)',
        borderRadius: 'var(--zest-radius-surface)',
      }}
    >
      <Typography variant="body2" color="secondary">
        Size shorthands: width=&quot;100%&quot; maxWidth={'{480}'} minHeight={'{96}'} overflow=
        &quot;auto&quot;. Numbers are px; strings pass through.
      </Typography>
    </Box>
  ),
};

export const FlexChild: Story = {
  render: () => (
    <Box style={{ display: 'flex', gap: 'var(--zest-space-2)', maxWidth: 480 }}>
      <Box flex minWidth={0} p={3} style={{ background: 'var(--zest-color-background-neutral)' }}>
        <Typography variant="body2" truncate>
          flex + minWidth={'{0}'} — fills and truncates instead of overflowing the row.
        </Typography>
      </Box>
      <Box shrink={false} p={3} style={{ background: 'var(--zest-color-background-neutral)' }}>
        <Typography variant="body2">shrink={'{false}'}</Typography>
      </Box>
    </Box>
  ),
};
