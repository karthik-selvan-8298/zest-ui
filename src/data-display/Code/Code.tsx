import * as React from 'react';
import { cx } from '../../utils';
import type { ZestColor } from '../../types';
import '../../base.css';
import './Code.css';

/*
 * Code — inline monospace chip for identifiers that appear in running text:
 * route paths, env var names, IDs, shell flags.
 *
 * Run <Code>npm run build</Code> from the root.
 * <Code copyable>sk_live_••••••••••••••••4242</Code>
 * <Code color="primary" variant="outlined">GET /v1/users</Code>
 */

export type CodeVariant = 'soft' | 'outlined';
export type CodeSize = 'sm' | 'md';

export interface CodeProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color' | 'children'> {
  /** The code text. Plain strings copy best; nested nodes are flattened to text. */
  children: React.ReactNode;
  /** Tone. Defaults to `neutral` (the plain grey chip). */
  color?: ZestColor | 'neutral';
  /** `soft` tinted fill (default) or `outlined` hairline ring. */
  variant?: CodeVariant;
  /** Horizontal padding step. Defaults to `md`. */
  size?: CodeSize;
  /** Clamp to the container width and ellipsize overflow. */
  truncate?: boolean;
  /**
   * Renders a `<button>` that copies the text to the clipboard on click and
   * shows a "Copied" title for 1.5s. Without it the chip is a plain `<code>`.
   */
  copyable?: boolean;
}

const COPIED_RESET_MS = 1500;

/** Flattens a ReactNode tree to its text content for the clipboard. */
function nodeToText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join('');
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return nodeToText(node.props.children);
  }
  return '';
}

/**
 * Inline monospace code chip. Sized relative to the surrounding text
 * (`font-size: 0.875em`) so it sits naturally in prose, table cells and
 * list items. Pass `copyable` for tokens and IDs users need to grab.
 *
 * ```tsx
 * <Typography>
 *   Set <Code>ZEST_API_KEY</Code> in your <Code color="primary">.env</Code>.
 * </Typography>
 * <Code copyable truncate>usr_01J8K2M3N4P5Q6R7S8T9V0W1X2</Code>
 * ```
 */
export const Code = React.forwardRef<HTMLElement, CodeProps>(function Code(
  {
    children,
    color = 'neutral',
    variant = 'soft',
    size = 'md',
    truncate = false,
    copyable = false,
    className,
    onClick,
    ...props
  },
  ref
) {
  const [copied, setCopied] = React.useState(false);
  const resetTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  React.useEffect(() => () => clearTimeout(resetTimer.current), []);

  const sharedProps = {
    className: cx('zest-code', copyable && 'zest-focusable', className),
    'data-variant': variant,
    'data-accent': color,
    'data-size': size,
    'data-truncate': truncate ? '' : undefined,
  };

  if (!copyable) {
    return (
      <code ref={ref} {...sharedProps} {...props}>
        {children}
      </code>
    );
  }

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    try {
      await navigator.clipboard.writeText(nodeToText(children));
      setCopied(true);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      title={copied ? 'Copied' : 'Copy to clipboard'}
      data-copyable=""
      data-copied={copied ? '' : undefined}
      onClick={handleClick}
      {...sharedProps}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <code className="zest-code__text">{children}</code>
    </button>
  );
});
