import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Typography } from '../../primitives';
import { Button } from '../../actions/Button';
import { FormField, HelperText, Label } from '../FormField';
import { Select } from './Select';

const meta = {
  title: 'Forms/Select',
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const roles = [
  { value: 'admin', label: 'Administrator' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'guest', label: 'Guest', disabled: true },
];

const tags = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'support', label: 'Customer support' },
  { value: 'finance', label: 'Finance' },
];

export const Default: Story = {
  args: {
    options: roles,
    placeholder: 'Choose a role',
    'aria-label': 'Role',
  },
};

function ControlledDemo() {
  const [value, setValue] = React.useState<string | null>('editor');
  return (
    <Stack spacing={2}>
      <Select aria-label="Role" options={roles} value={value} onValueChange={setValue} />
      <Typography variant="body2" color="secondary">
        Selected: {value ?? 'none'}
      </Typography>
    </Stack>
  );
}

export const Controlled: Story = {
  args: { options: roles },
  render: () => <ControlledDemo />,
};

export const States: Story = {
  args: { options: roles },
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 280 }}>
      <Select aria-label="Small" options={roles} size="sm" placeholder="Small" fullWidth />
      <Select aria-label="Error" options={roles} error placeholder="Error state" fullWidth />
      <Select aria-label="Disabled" options={roles} disabled placeholder="Disabled" fullWidth />
    </Stack>
  ),
};

export const Clearable: Story = {
  args: { options: roles },
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 280 }}>
      <Select aria-label="Role" options={roles} defaultValue="viewer" clearable fullWidth />
      <Select
        aria-label="Teams"
        options={tags}
        multiple
        defaultValue={['design', 'sales']}
        clearable
        fullWidth
      />
    </Stack>
  ),
};

function MultipleDemo() {
  const [value, setValue] = React.useState<string[]>(['design']);
  return (
    <Stack spacing={2} style={{ maxWidth: 320 }}>
      <Select
        aria-label="Teams"
        options={tags}
        multiple
        value={value}
        onValueChange={setValue}
        placeholder="Pick teams"
        fullWidth
      />
      <Typography variant="body2" color="secondary">
        {value.length} selected{value.length ? `: ${value.join(', ')}` : ''}
      </Typography>
    </Stack>
  );
}

export const Multiple: Story = {
  args: { options: tags, multiple: true },
  render: () => <MultipleDemo />,
};

export const MultipleManyValues: Story = {
  args: { options: tags, multiple: true },
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 320 }}>
      <Select
        aria-label="Teams (2 visible)"
        options={tags}
        multiple
        defaultValue={['design', 'engineering', 'marketing', 'sales', 'finance']}
        fullWidth
      />
      <Select
        aria-label="Teams (3 visible)"
        options={tags}
        multiple
        maxVisible={3}
        defaultValue={['design', 'engineering', 'marketing', 'sales', 'finance']}
        fullWidth
      />
      <Select
        aria-label="Teams (count only)"
        options={tags}
        multiple
        defaultValue={['design', 'engineering', 'marketing']}
        renderValue={(selected) => `${selected.length} teams selected`}
        fullWidth
      />
      <Select
        aria-label="Teams (small)"
        options={tags}
        multiple
        size="sm"
        defaultValue={['support', 'engineering', 'marketing']}
        fullWidth
      />
    </Stack>
  ),
};

function MultipleFormDemo() {
  const [submitted, setSubmitted] = React.useState<string[] | null>(null);
  return (
    <form
      style={{ maxWidth: 360 }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmitted(data.getAll('teams').map(String));
      }}
    >
      <Stack spacing={4}>
        <FormField>
          <Label required>Teams</Label>
          <Select
            name="teams"
            options={tags}
            multiple
            required
            defaultValue={['design']}
            placeholder="Pick at least one team"
            fullWidth
          />
          <HelperText>Submitted as one `teams` entry per selected value.</HelperText>
        </FormField>
        <Button type="submit">Submit</Button>
        {submitted ? (
          <Typography variant="body2" color="secondary">
            FormData.getAll(&apos;teams&apos;) → [{submitted.join(', ')}]
          </Typography>
        ) : null}
      </Stack>
    </form>
  );
}

export const MultipleFullWidthInForm: Story = {
  args: { options: tags, multiple: true },
  render: () => <MultipleFormDemo />,
};

const countries = [
  'Australia',
  'Austria',
  'Belgium',
  'Brazil',
  'Canada',
  'Chile',
  'Denmark',
  'Egypt',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'India',
  'Ireland',
  'Italy',
  'Japan',
  'Kenya',
  'Mexico',
  'Netherlands',
  'Norway',
  'Portugal',
  'Singapore',
  'Spain',
  'Sweden',
  'Switzerland',
].map((name) => ({ value: name.toLowerCase(), label: name }));

/** More than `searchThreshold` (8) options → the search field appears automatically. */
export const Searchable: Story = {
  args: { options: tags, multiple: true },
  render: () => <Select aria-label="Country" placeholder="Country" options={countries} clearable />,
};

export const SearchableMultiple: Story = {
  args: { options: tags, multiple: true },
  render: () => (
    <div style={{ width: 360 }}>
      <Select
        multiple
        aria-label="Countries"
        placeholder="Countries"
        options={countries}
        defaultValue={['india', 'japan', 'spain']}
        fullWidth
        clearable
      />
    </div>
  ),
};

/** Short lists stay clean — force it with `searchable` when you still want it. */
export const SearchForced: Story = {
  args: { options: tags, multiple: true },
  render: () => (
    <Select
      aria-label="Role"
      placeholder="Role"
      searchable
      options={[
        { value: 'admin', label: 'Admin' },
        { value: 'member', label: 'Member' },
        { value: 'viewer', label: 'Viewer' },
      ]}
    />
  ),
};
