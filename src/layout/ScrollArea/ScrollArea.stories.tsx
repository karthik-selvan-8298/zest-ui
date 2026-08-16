import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Typography } from '../../primitives';
import { ScrollArea } from './ScrollArea';

const meta = {
  title: 'Layout/ScrollArea',
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollArea maxHeight={200} style={{ maxWidth: 420 }}>
      <Stack spacing={2} style={{ paddingRight: 12 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <Typography key={i} variant="body2" color="secondary">
            Row {i + 1} — themed overlay scrollbars instead of a raw overflow div.
          </Typography>
        ))}
      </Stack>
    </ScrollArea>
  ),
};
