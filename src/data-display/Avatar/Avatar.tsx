import * as React from 'react';
import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { UserIcon } from '../../icons';
import { cx } from '../../utils';
import type { WithClassName, ZestColor } from '../../types';
import '../../base.css';
import './Avatar.css';

/*
 * Avatar on Base UI — image with graceful fallback to initials.
 *
 * <Avatar src="/kai.png" alt="Kai" name="Kai Zhang" />
 * <Avatar name="Ada Lovelace" color="secondary" size="lg" />
 * <AvatarGroup max={3}>…<Avatar/>s…</AvatarGroup>
 */

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'rounded';

export interface AvatarProps extends WithClassName<React.ComponentProps<typeof BaseAvatar.Root>> {
  /** Image source; falls back to initials/icon while loading or on error. */
  src?: string;
  /** Image alt text (defaults to `name`). */
  alt?: string;
  /** Person's name — the fallback shows up to 2 initials derived from it. */
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  /** Tonal color of the fallback. */
  color?: ZestColor;
  /** Fallback style: soft tint (default), solid accent, or brand gradient. */
  variant?: 'soft' | 'solid' | 'gradient';
  /** Custom fallback content; overrides initials. */
  children?: React.ReactNode;
}

/** Up to two initials: first letters of the first and last words. */
export function initialsFromName(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    src,
    alt,
    name,
    size = 'md',
    shape = 'circle',
    color = 'neutral',
    variant = 'soft',
    className,
    children,
    ...props
  },
  ref
) {
  const initials = name ? initialsFromName(name) : '';
  const fallback = children ?? (initials || <UserIcon className="zest-avatar__icon" />);

  return (
    <BaseAvatar.Root
      ref={ref}
      className={cx('zest-avatar', className)}
      data-size={size}
      data-shape={shape}
      data-accent={color}
      data-variant={variant}
      {...props}
    >
      {src ? (
        <BaseAvatar.Image className="zest-avatar__image" src={src} alt={alt ?? name} />
      ) : null}
      <BaseAvatar.Fallback className="zest-avatar__fallback">{fallback}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
});

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum avatars shown; the surplus collapses into a "+N" avatar. */
  max?: number;
  /** Size applied to every avatar in the group. */
  size?: AvatarSize;
  /** Shape applied to every avatar in the group. */
  shape?: AvatarShape;
  children?: React.ReactNode;
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { max, size, shape, className, children, ...props },
  ref
) {
  const items = React.Children.toArray(children);
  const visible = max !== undefined && max >= 0 && items.length > max ? items.slice(0, max) : items;
  const surplus = items.length - visible.length;

  return (
    <div ref={ref} className={cx('zest-avatar-group', className)} {...props}>
      {visible.map((child) =>
        React.isValidElement<AvatarProps>(child)
          ? React.cloneElement(child, {
              size: size ?? child.props.size,
              shape: shape ?? child.props.shape,
            })
          : child
      )}
      {surplus > 0 ? (
        <Avatar size={size} shape={shape} color="neutral" aria-label={`${surplus} more`}>
          +{surplus}
        </Avatar>
      ) : null}
    </div>
  );
});
