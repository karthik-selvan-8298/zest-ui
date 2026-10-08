import * as React from 'react';
import { cx } from '../../utils';
import './Image.css';

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  /**
   * Alternative text — describe the image's content and function, or pass an
   * empty string (`alt=""`) to mark it decorative. Never omit it: the type
   * makes this required so screen readers can't be left without a name.
   */
  alt: string;
  /** object-fit behavior. Defaults to `cover`. */
  fit?: 'cover' | 'contain' | 'fill' | 'none';
  /** Corner radius token. Defaults to `control`. */
  radius?: 'none' | 'control' | 'surface' | 'full';
  /** Fixed aspect ratio (width / height), e.g. 16/9. Renders a sizing frame around the image. */
  ratio?: number;
  /** Shown when the image fails to load (any node; defaults to a neutral block). */
  fallback?: React.ReactNode;
  /** Class for the aspect-ratio frame (only rendered when `ratio` is set). */
  frameClassName?: string;
  /** Inline style for the aspect-ratio frame (only rendered when `ratio` is set). */
  frameStyle?: React.CSSProperties;
}

/**
 * Themed replacement for `<img>`: fit/radius/ratio props and a graceful
 * error fallback. Lazy-loads by default. `className`/`style` always target
 * the `<img>`; use `frameClassName`/`frameStyle` for the ratio frame.
 *
 * ```tsx
 * <Image src={url} alt="Team offsite" ratio={16 / 9} radius="surface" />
 * <Image src={avatarUrl} alt="" radius="full" fallback="KA" style={{ width: 40 }} />
 * ```
 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
    alt,
    fit = 'cover',
    radius = 'control',
    ratio,
    fallback,
    className,
    frameClassName,
    frameStyle,
    loading,
    onError,
    ...props
  },
  ref
) {
  const [failed, setFailed] = React.useState(false);

  // A new source deserves a fresh attempt: clear the error state when `src`
  // or `srcSet` changes. Derived reset during render — no effect round-trip.
  const source = `${props.src ?? ''}|${props.srcSet ?? ''}`;
  const [prevSource, setPrevSource] = React.useState(source);
  if (source !== prevSource) {
    setPrevSource(source);
    setFailed(false);
  }

  const content = failed ? (
    <span
      className={cx('zest-image__fallback', className)}
      data-radius={radius}
      // Keep the image's accessible name when the <img> is swapped out;
      // decorative images (alt="") stay out of the accessibility tree.
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      {fallback}
    </span>
  ) : (
    <img
      ref={ref}
      alt={alt}
      loading={loading ?? 'lazy'}
      className={cx('zest-image', className)}
      data-fit={fit}
      data-radius={radius}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
      {...props}
    />
  );

  if (ratio) {
    return (
      <span
        className={cx('zest-image__frame', frameClassName)}
        data-radius={radius}
        style={{ aspectRatio: String(ratio), ...frameStyle }}
      >
        {content}
      </span>
    );
  }
  return content;
});
