import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Stack } from '../../primitives';
import { NavigationMenu } from './NavigationMenu';

const meta = {
  title: 'Navigation/NavigationMenu',
  component: NavigationMenu.Root,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NavigationMenu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const products = [
  { href: '#crm', label: 'CRM', description: 'Close more deals in less time.' },
  { href: '#desk', label: 'Desk', description: 'Customer service that scales.' },
  { href: '#books', label: 'Books', description: 'Accounting for growing teams.' },
  { href: '#people', label: 'People', description: 'HR, payroll and time-off in one place.' },
];

const resources = [
  { href: '#docs', label: 'Documentation' },
  { href: '#guides', label: 'Guides' },
  { href: '#community', label: 'Community' },
  { href: '#status', label: 'Status' },
];

/* Stand-in for a router link (react-router / Next both fit this shape). */
const RouterLink = React.forwardRef<HTMLAnchorElement, { to: string } & React.ComponentProps<'a'>>(
  function RouterLink({ to, children, ...props }, ref) {
    return (
      <a ref={ref} href={to} {...props}>
        {children}
      </a>
    );
  }
);

export const Default: Story = {
  render: () => (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            {products.map((item) => (
              <NavigationMenu.Link key={item.href} href={item.href} description={item.description}>
                {item.label}
              </NavigationMenu.Link>
            ))}
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            {resources.map((item) => (
              <NavigationMenu.Link key={item.href} href={item.href}>
                {item.label}
              </NavigationMenu.Link>
            ))}
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#pricing">Pricing</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <NavigationMenu.Root arrow align="center">
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            {products.map((item) => (
              <NavigationMenu.Link key={item.href} href={item.href} description={item.description}>
                {item.label}
              </NavigationMenu.Link>
            ))}
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            {resources.map((item) => (
              <NavigationMenu.Link key={item.href} href={item.href}>
                {item.label}
              </NavigationMenu.Link>
            ))}
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  ),
};

export const ActiveLink: Story = {
  render: () => (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            {products.map((item, index) => (
              <NavigationMenu.Link
                key={item.href}
                href={item.href}
                description={item.description}
                active={index === 1}
              >
                {item.label}
              </NavigationMenu.Link>
            ))}
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#pricing" active>
            Pricing
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  ),
};

export const RouterLinks: Story = {
  render: () => (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Workspace</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link
              render={<RouterLink to="/projects" />}
              description="All active work"
            >
              Projects
            </NavigationMenu.Link>
            <NavigationMenu.Link render={<RouterLink to="/reports" />} description="Weekly rollups">
              Reports
            </NavigationMenu.Link>
            <NavigationMenu.Link render={<RouterLink to="/settings" />} closeOnClick>
              Settings
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  ),
};

export const Sides: Story = {
  render: () => (
    <Stack spacing={6}>
      <NavigationMenu.Root side="bottom" align="start">
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Bottom / start</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              {resources.map((item) => (
                <NavigationMenu.Link key={item.href} href={item.href}>
                  {item.label}
                </NavigationMenu.Link>
              ))}
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
      <NavigationMenu.Root side="right" align="start">
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Right / start</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              {resources.map((item) => (
                <NavigationMenu.Link key={item.href} href={item.href}>
                  {item.label}
                </NavigationMenu.Link>
              ))}
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </Stack>
  ),
};
