import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../actions/Button/Button';
import { TextField } from '../TextField/TextField';
import { Form } from './Form';

const meta = {
  title: 'Forms/Form',
  component: Form,
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Form
      style={{ maxWidth: 360 }}
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <TextField name="email" label="Email" required placeholder="you@company.com" fullWidth />
      <TextField name="name" label="Name" placeholder="Full name" fullWidth />
      <Button type="submit">Submit</Button>
    </Form>
  ),
};
