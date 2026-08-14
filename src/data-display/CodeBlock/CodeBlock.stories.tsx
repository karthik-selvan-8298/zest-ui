import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { CodeBlock } from './CodeBlock';

const meta = {
  title: 'Data Display/CodeBlock',
  component: CodeBlock,
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const curlExample = `# 1 — Initialize (returns Mcp-Session-Id in response headers)
curl -si -X POST https://api.example.com/mcp/public \\
  -H 'Content-Type: application/json' \\
  -H 'Accept: application/json, text/event-stream' \\
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"my-app","version":"1.0.0"}}}'

# 2 — Use the session to list tools
SESSION="<mcp-session-id-from-step-1>"
curl -s -X POST https://api.example.com/mcp/public \\
  -H 'Content-Type: application/json' \\
  -H 'Accept: application/json, text/event-stream' \\
  -H "Mcp-Session-Id: $SESSION" \\
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'`;

export const Bash: Story = {
  args: {
    language: 'bash',
    code: curlExample,
  },
};

export const InnerScroll: Story = {
  args: { code: '' },
  render: () => (
    <CodeBlock
      language="json"
      maxHeight={200}
      code={JSON.stringify(
        {
          tools: Array.from({ length: 12 }, (_, i) => ({
            name: `tool_${i + 1}`,
            visibility: i % 2 ? 'public' : 'private',
            endpoint: `https://api.example.com/tools/${i + 1}`,
          })),
        },
        null,
        2
      )}
    />
  ),
};

export const Variants: Story = {
  args: { code: '' },
  render: () => (
    <Stack spacing={4}>
      <CodeBlock title="install.sh" language="bash" code={'npm install zest-ui'} />
      <CodeBlock hideCopy language="tsx" code={`<Button color="primary">Save</Button>`} />
      <CodeBlock
        language="bash"
        wrap
        code={
          'curl -X POST https://very-long-endpoint.example.com/api/v2/deployments/production/rollout --header "Authorization: Bearer <token>" --data "stage=canary&percent=10"'
        }
      />
    </Stack>
  ),
};
