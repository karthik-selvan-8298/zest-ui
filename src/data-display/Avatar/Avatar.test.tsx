import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarGroup, initialsFromName } from './Avatar';

describe('initialsFromName', () => {
  it('takes the first letters of the first and last words', () => {
    expect(initialsFromName('Ada Lovelace')).toBe('AL');
    expect(initialsFromName('  grace  brewster murray hopper ')).toBe('GH');
    expect(initialsFromName('Kai')).toBe('K');
    expect(initialsFromName('   ')).toBe('');
  });
});

describe('Avatar', () => {
  it('shows initials as the fallback and stamps defaults', () => {
    const { container } = render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByText('AL')).toBeInTheDocument();
    const root = container.querySelector('.zest-avatar') as HTMLElement;
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('data-shape', 'circle');
    expect(root).toHaveAttribute('data-accent', 'neutral');
    expect(root).toHaveAttribute('data-variant', 'soft');
  });

  it('prefers custom children over initials', () => {
    render(<Avatar name="Ada Lovelace">★</Avatar>);
    expect(screen.getByText('★')).toBeInTheDocument();
    expect(screen.queryByText('AL')).not.toBeInTheDocument();
  });

  it('falls back to a user icon without a name', () => {
    const { container } = render(<Avatar />);
    expect(container.querySelector('.zest-avatar__icon')).toBeInTheDocument();
  });
});

describe('AvatarGroup', () => {
  it('caps visible avatars at max, adds a "+N" avatar, and applies group size', () => {
    const { container } = render(
      <AvatarGroup max={2} size="sm">
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" size="xl" />
        <Avatar name="Alan Turing" />
        <Avatar name="Kai Zhang" />
      </AvatarGroup>
    );
    const avatars = container.querySelectorAll('.zest-avatar');
    expect(avatars).toHaveLength(3);
    for (const avatar of avatars) expect(avatar).toHaveAttribute('data-size', 'sm');
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.getByLabelText('2 more')).toBeInTheDocument();
    expect(screen.queryByText('AT')).not.toBeInTheDocument();
  });
});
