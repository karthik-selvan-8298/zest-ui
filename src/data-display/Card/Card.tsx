import * as React from 'react';
import { cx } from '../../utils';
import './Card.css';

/*
 * Sigma-style card: 16px radius, soft "card" elevation, composable sections.
 *
 * <Card>
 *   <Card.Header title="Team" subtitle="12 members" action={<IconButton …/>} />
 *   <Card.Content>…</Card.Content>
 *   <Card.Footer><Button>Save</Button></Card.Footer>
 * </Card>
 */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Outlined instead of elevated. */
  variant?: 'elevated' | 'outlined';
  children?: React.ReactNode;
}

const CardRoot = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'elevated', className, ...props },
  ref
) {
  return <div ref={ref} className={cx('zest-card', className)} data-variant={variant} {...props} />;
});

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Trailing element (menu button, action). */
  action?: React.ReactNode;
  /**
   * Heading element for `title`. Defaults to `h3` so cards slot under a page
   * `h1`/`h2`; pass `'h2'`/`'h4'` to match the surrounding outline.
   */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  children?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { title, subtitle, action, titleAs: TitleTag = 'h3', className, children, ...props },
  ref
) {
  return (
    <div ref={ref} className={cx('zest-card__header', className)} {...props}>
      <div className="zest-card__heading">
        {title ? <TitleTag className="zest-card__title">{title}</TitleTag> : null}
        {subtitle ? <div className="zest-card__subtitle">{subtitle}</div> : null}
        {children}
      </div>
      {action ? <div className="zest-card__action">{action}</div> : null}
    </div>
  );
});

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level. Defaults to `h3`. */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { as: Tag = 'h3', className, ...props },
  ref
) {
  return <Tag ref={ref} className={cx('zest-card__title', className)} {...props} />;
});

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cx('zest-card__content', className)} {...props} />;
  }
);

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cx('zest-card__footer', className)} {...props} />;
  }
);

/** Full-bleed media area (images, charts). */
const CardMedia = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardMedia({ className, ...props }, ref) {
    return <div ref={ref} className={cx('zest-card__media', className)} {...props} />;
  }
);

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Content: CardContent,
  Footer: CardFooter,
  Media: CardMedia,
});
