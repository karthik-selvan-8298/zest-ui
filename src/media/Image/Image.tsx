import * as React from 'react';
import { cx } from '../../utils';
import './Image.css';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** object-fit behavior. Defaults to `cover`. */
  fit?: 'cover' | 'contain' | 'fill' | 'none';
  radius?: 'none' | 'control' | 'surface' | 'full';
  /** Fixed aspect ratio (width / height), e.g. 16/9. */
  ratio?: number;
  /** Shown when the image fails to load (any node; defaults to a neutral block). */
  fallback?: React.ReactNode;
}

/**
 * Themed replacement for `<img>`: fit/radius/ratio props and a graceful
 * error fallback. Lazy-loads by default.
 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(function Image(
  { fit = 'cover', radius = 'control', ratio, fallback, className, loading, onError, ...props },
  ref
) {
  const [failed, setFailed] = React.useState(false);

  const content = failed ? (
    <span className="zest-image__fallback" data-radius={radius}>
      {fallback}
    </span>
  ) : (
    <img
      ref={ref}
      loading={loading ?? 'lazy'}
      className={cx('zest-image', !ratio && className)}
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
        className={cx('zest-image__frame', className)}
        data-radius={radius}
        style={{ aspectRatio: String(ratio) }}
      >
        {content}
      </span>
    );
  }
  return content;
});
