import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion';

const meta = {
  title: 'Data Display/Accordion',
  component: Accordion.Root,
} satisfies Meta<typeof Accordion.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Accordion.Root defaultValue={['shipping']}>
        <Accordion.Item value="shipping">
          <Accordion.Trigger>Shipping</Accordion.Trigger>
          <Accordion.Panel>
            Orders ship within 2 business days. Tracking is emailed as soon as the label is
            created.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="returns">
          <Accordion.Trigger>Returns</Accordion.Trigger>
          <Accordion.Panel>
            Returns are free within 30 days. Start one from your order history page.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="warranty">
          <Accordion.Trigger>Warranty</Accordion.Trigger>
          <Accordion.Panel>
            Every product carries a 2-year limited warranty covering manufacturing defects.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Accordion.Root multiple defaultValue={['a', 'b']}>
        <Accordion.Item value="a">
          <Accordion.Trigger>First section</Accordion.Trigger>
          <Accordion.Panel>Several sections can stay open at once.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.Trigger>Second section</Accordion.Trigger>
          <Accordion.Panel>Both this and the first section start expanded.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="c">
          <Accordion.Trigger>Third section</Accordion.Trigger>
          <Accordion.Panel>Closed by default.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

export const DisabledItem: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Accordion.Root>
        <Accordion.Item value="open">
          <Accordion.Trigger>Available</Accordion.Trigger>
          <Accordion.Panel>This item opens normally.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="locked" disabled>
          <Accordion.Trigger>Locked</Accordion.Trigger>
          <Accordion.Panel>Unreachable content.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};
