import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { FileUpload } from './FileUpload';

const meta = {
  title: 'Forms/FileUpload',
  component: FileUpload,
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    multiple: true,
    maxSizeMB: 5,
  },
};

export const States: Story = {
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 480 }}>
      <FileUpload accept="image/*" label="Drop images here" description="PNG or JPG, up to 5 MB" />
      <FileUpload error label="Upload failed — try again" />
      <FileUpload disabled label="Uploads disabled" />
    </Stack>
  ),
};

export const WithPreselectedFiles: Story = {
  render: () => (
    <FileUpload
      multiple
      defaultValue={[
        new File(['a'.repeat(1500)], 'quarterly-report.pdf', { type: 'application/pdf' }),
        new File(['b'.repeat(300000)], 'screenshot.png', { type: 'image/png' }),
      ]}
      style={{ maxWidth: 480 }}
    />
  ),
};
