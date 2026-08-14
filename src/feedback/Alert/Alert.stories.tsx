import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { Button } from '../../actions/Button/Button';
import { Alert, type AlertSeverity } from './Alert';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

const severities: AlertSeverity[] = ['info', 'success', 'warning', 'error'];

export const Soft: Story = {
  render: () => (
    <Stack spacing={3}>
      {severities.map((severity) => (
        <Alert key={severity} severity={severity} title={`${severity} alert`}>
          Something happened that you should know about.
        </Alert>
      ))}
    </Stack>
  ),
};

export const Solid: Story = {
  render: () => (
    <Stack spacing={3}>
      {severities.map((severity) => (
        <Alert key={severity} severity={severity} variant="solid">
          A {severity} message with solid emphasis.
        </Alert>
      ))}
    </Stack>
  ),
};

export const Outlined: Story = {
  render: () => (
    <Stack spacing={3}>
      {severities.map((severity) => (
        <Alert key={severity} severity={severity} variant="outlined" title={`${severity}`}>
          Outlined variant.
        </Alert>
      ))}
    </Stack>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Stack spacing={3}>
      <Alert
        severity="warning"
        title="Storage almost full"
        onClose={() => {}}
        action={
          <Button size="sm" variant="soft" color="warning">
            Upgrade
          </Button>
        }
      >
        You have used 92% of your storage quota.
      </Alert>
    </Stack>
  ),
};
