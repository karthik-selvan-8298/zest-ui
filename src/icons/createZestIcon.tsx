import * as React from 'react';

export interface ZestIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'children'> {
  /** Icon size — number of pixels or any CSS length. Defaults to `1.25em`. */
  size?: number | string;
  /** Accessible label. Without it the icon is decorative (aria-hidden). */
  title?: string;
}

/**
 * Factory for Zest icons: 24×24 viewBox, stroke-based, inherits `currentColor`.
 * Use it to add product icons that match the built-in set.
 *
 * ```tsx
 * export const BellIcon = createZestIcon(
 *   'BellIcon',
 *   <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
 * );
 * ```
 */
export function createZestIcon(name: string, path: React.ReactNode) {
  const Icon = React.forwardRef<SVGSVGElement, ZestIconProps>(function Icon(
    { size = '1.25em', title, ...props },
    ref
  ) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={title ? undefined : true}
        role={title ? 'img' : undefined}
        {...props}
      >
        {title ? <title>{title}</title> : null}
        {path}
      </svg>
    );
  });
  Icon.displayName = name;
  return Icon;
}
