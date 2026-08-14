import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../primitives';
import { Image } from './Image';

const meta = {
  title: 'Media/Image',
  component: Image,
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

const brandSquare =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' fill='%237c3aed'/%3E%3C/svg%3E";

export const Variants: Story = {
  render: () => (
    <Flex gap={4} align="center" wrap>
      <Image src={brandSquare} alt="Rounded" radius="control" style={{ width: 96 }} />
      <Image src={brandSquare} alt="Surface radius" radius="surface" style={{ width: 96 }} />
      <Image src={brandSquare} alt="Circle" radius="full" style={{ width: 96 }} />
    </Flex>
  ),
};

export const RatioAndFallback: Story = {
  render: () => (
    <Flex gap={4} align="center">
      <Image src={brandSquare} alt="16:9 frame" ratio={16 / 9} style={{ width: 240 }} />
      <Image
        src="https://invalid.example/broken.png"
        alt="Broken"
        ratio={16 / 9}
        fallback="Image unavailable"
        style={{ width: 240 }}
      />
    </Flex>
  ),
};
