import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../index';
import { Typography, type TypographyVariant } from './Typography';

const meta = {
  title: 'Foundation/Typography',
  component: Typography,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

const variants: TypographyVariant[] = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'caption',
  'overline',
];

export const Scale: Story = {
  render: () => (
    <Stack spacing={3}>
      {variants.map((variant) => (
        <Typography key={variant} variant={variant}>
          {variant} — The quick brown fox jumps over the lazy dog
        </Typography>
      ))}
    </Stack>
  ),
};

export const Colors: Story = {
  render: () => (
    <Stack spacing={2}>
      <Typography color="primary">Text primary</Typography>
      <Typography color="secondary">Text secondary</Typography>
      <Typography color="disabled">Text disabled</Typography>
      <Typography color="brand">Brand</Typography>
      <Typography color="success">Success</Typography>
      <Typography color="warning">Warning</Typography>
      <Typography color="error">Error</Typography>
    </Stack>
  ),
};

export const TruncationAndClamping: Story = {
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 320 }}>
      <Typography truncate>
        Single line truncation — this very long sentence will be cut with an ellipsis instead of
        wrapping onto the next line.
      </Typography>
      <Typography truncate={2}>
        Two-line clamp — this very long paragraph demonstrates multi-line clamping. It will show at
        most two lines of text and then cut off with an ellipsis, no matter how much content
        follows after that point.
      </Typography>
    </Stack>
  ),
};
