import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../actions/Button/Button';
import { Flex } from '../../primitives';
import { Toaster, ZestToastProvider, useToast, type ToastSeverity } from './Toast';

const meta = {
  title: 'Feedback/Toast',
  component: Toaster,
  args: { position: 'bottom-right' },
  argTypes: {
    position: {
      control: 'inline-radio',
      options: ['bottom-right', 'top-right', 'bottom-center'],
    },
  },
  decorators: [
    (Story, context) => (
      <ZestToastProvider>
        <Story />
        <Toaster position={context.args.position} />
      </ZestToastProvider>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

const severityColor = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
} as const;

const severityCopy: Record<ToastSeverity, { title: string; description: string }> = {
  info: { title: 'Heads up', description: 'A new version is available.' },
  success: { title: 'Saved', description: 'Your changes have been saved.' },
  warning: { title: 'Storage almost full', description: 'You have used 90% of your quota.' },
  error: { title: 'Upload failed', description: 'The file could not be uploaded.' },
};

function SeverityButtons() {
  const toast = useToast();
  return (
    <Flex gap={2} wrap>
      {(Object.keys(severityCopy) as ToastSeverity[]).map((severity) => (
        <Button
          key={severity}
          variant="soft"
          color={severityColor[severity]}
          onClick={() => toast.add({ ...severityCopy[severity], severity })}
        >
          {severity}
        </Button>
      ))}
      <Button
        variant="outlined"
        color="neutral"
        onClick={() => toast.add({ title: 'Plain toast', description: 'No severity styling.' })}
      >
        plain
      </Button>
    </Flex>
  );
}

export const Severities: Story = {
  render: () => <SeverityButtons />,
};

function ActionDemo() {
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast.add({
          title: 'Message archived',
          description: 'The conversation was moved to the archive.',
          severity: 'info',
          timeout: 0,
          action: {
            label: 'Undo',
            onClick: () => toast.add({ title: 'Restored', severity: 'success' }),
          },
        })
      }
    >
      Archive message
    </Button>
  );
}

export const WithAction: Story = {
  render: () => <ActionDemo />,
};

function PromiseDemo() {
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast.promise(
          new Promise<string>((resolve, reject) => {
            setTimeout(() => (Math.random() > 0.4 ? resolve('report.pdf') : reject()), 2000);
          }),
          {
            loading: { title: 'Uploading…', description: 'This can take a moment.' },
            success: (file) => ({ title: 'Uploaded', description: `${file} is ready.` }),
            error: { title: 'Upload failed', description: 'Please try again.' },
          }
        )
      }
    >
      Upload file
    </Button>
  );
}

export const PromiseToast: Story = {
  render: () => <PromiseDemo />,
};

function StackDemo() {
  const toast = useToast();
  return (
    <Button
      variant="outlined"
      onClick={() => {
        toast.add({ title: 'First', description: 'Hover the stack to expand it.', severity: 'info' });
        toast.add({ title: 'Second', severity: 'success' });
        toast.add({ title: 'Third', severity: 'warning' });
      }}
    >
      Fire three toasts
    </Button>
  );
}

export const Stacking: Story = {
  render: () => <StackDemo />,
};
