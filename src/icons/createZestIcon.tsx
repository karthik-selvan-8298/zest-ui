import * as React from 'react';

export interface ZestIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'children'> {
  /** Icon size — number of pixels or any CSS length. Defaults to `1.25em`. */
  size?: number | string;
  /** Accessible label. Without it the icon is decorative (aria-hidden). */
  title?: string;
}

/**
 * Factory for Zest icons: 24×24 viewBox, stroke-based, inherits `currentColor`.
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
