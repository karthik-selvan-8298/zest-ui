import * as React from 'react';
import { CheckIcon, CopyIcon } from '../../icons';
import { cx } from '../../utils';
import '../../base.css';
import './CodeBlock.css';

/** How long the copy button shows "Copied" after a successful copy. */
const COPIED_RESET_MS = 2000;

export interface CodeBlockProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'title' | 'onCopy'
> {
  /** The code to display, as a plain string. */
  code: string;
  /** Label shown in the header bar (e.g. "bash", "tsx", "json"). */
  language?: string;
  /** Header title overriding the language label (e.g. a filename). */
  title?: React.ReactNode;
  /** Hide the copy button. */
  hideCopy?: boolean;
  /**
   * Inner scroll height limit — content beyond it scrolls inside the panel.
   * Number of pixels or any CSS length. Defaults to 400px.
   */
  maxHeight?: number | string | 'none';
  /** Wrap long lines instead of horizontal scrolling. */
  wrap?: boolean;
  /** Called after a successful copy. */
  onCopy?: (code: string) => void;
}

/**
 * Dark code panel with a language header, copy button, and inner scrolling —
 * the Sigma/QA "curl example" style.
 *
 * ```tsx
 * <CodeBlock language="bash" code={`curl -X POST https://…`} maxHeight={320} />
 * ```
 */
export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
  {
    code,
    language,
    title,
    hideCopy = false,
    maxHeight = 400,
    wrap = false,
    onCopy,
    className,
    ...props
  },
  ref
) {
  const [copied, setCopied] = React.useState(false);
  const resetTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Drop a pending "Copied" reset on unmount.
  React.useEffect(() => () => clearTimeout(resetTimer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopy?.(code);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      /* clipboard unavailable */
    }
  };

  const label = title ?? (language ? language.toUpperCase() : null);

  return (
    <div ref={ref} className={cx('zest-code-block', className)} {...props}>
      {label || !hideCopy ? (
        <div className="zest-code-block__header">
          <span className="zest-code-block__language">{label}</span>
          {!hideCopy ? (
            <button
              type="button"
              className="zest-code-block__copy zest-focusable"
              onClick={handleCopy}
              aria-label={copied ? 'Copied' : 'Copy code'}
            >
              {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          ) : null}
        </div>
      ) : null}
      <pre
        className="zest-code-block__pre"
        data-wrap={wrap ? '' : undefined}
        style={maxHeight === 'none' ? undefined : { maxHeight }}
        // A height-capped <pre> scrolls, so it must be keyboard-reachable
        // (axe: scrollable-region-focusable).
        tabIndex={maxHeight === 'none' ? undefined : 0}
      >
        <code className="zest-code-block__code">{code}</code>
      </pre>
    </div>
  );
});
