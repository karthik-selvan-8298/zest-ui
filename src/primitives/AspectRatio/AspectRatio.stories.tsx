import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../Flex/Flex';
import { Typography } from '../Typography/Typography';
import { AspectRatio } from './AspectRatio';

const meta = {
  title: 'Layout/AspectRatio',
  component: AspectRatio,
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ label }: { label: string }) {
  return (
    <Flex
      center
      style={{
        height: '100%',
        background: 'var(--zest-color-background-neutral)',
        borderRadius: 'var(--zest-radius-surface)',
      }}
    >
      <Typography variant="subtitle2" color="secondary">
        {label}
      </Typography>
    </Flex>
  );
}

export const Ratios: Story = {
  render: () => (
    <Flex gap={4} style={{ maxWidth: 720 }}>
      <div style={{ flex: 1 }}>
        <AspectRatio ratio={16 / 9}>
          <Demo label="16 : 9" />
        </AspectRatio>
      </div>
      <div style={{ flex: 1 }}>
        <AspectRatio ratio={4 / 3}>
          <Demo label="4 : 3" />
        </AspectRatio>
      </div>
      <div style={{ flex: 1 }}>
        <AspectRatio ratio={1}>
          <Demo label="1 : 1" />
        </AspectRatio>
      </div>
    </Flex>
  ),
};
