import * as React from 'react';
import { ChevronRightIcon } from '../../icons';
import { cx } from '../../utils';
import '../../base.css';
import './Breadcrumbs.css';

interface BreadcrumbsItemBaseProps {
  /**
   * Marks the crumb as the current page (`aria-current="page"`, no link).
   * Set automatically on the last child by the Breadcrumbs root.
   */
  current?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/** A crumb with `href` renders `<a>` and accepts anchor attributes. */
export type BreadcrumbsItemLinkProps = BreadcrumbsItemBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'> & {
    /** Link target. */
    href: string;
  };

/** A crumb without `href` (e.g. the current page) renders `<span>`. */
export type BreadcrumbsItemTextProps = BreadcrumbsItemBaseProps &
  Omit<React.HTMLAttributes<HTMLSpanElement>, 'className' | 'children'> & {
    href?: undefined;
  };

/**
 * Discriminated on `href`: anchor-only attributes (`target`, `rel`,
 * `download`) are accepted only when the crumb is actually a link.
 */
export type BreadcrumbsItemProps = BreadcrumbsItemLinkProps | BreadcrumbsItemTextProps;

/** One crumb: a link when it has `href` and isn't current, otherwise plain text. */
const BreadcrumbsItem = React.forwardRef<HTMLAnchorElement | HTMLSpanElement, BreadcrumbsItemProps>(
  function BreadcrumbsItem({ href, current = false, className, children, ...props }, ref) {
    if (current || href === undefined) {
      return (
        <span
          ref={ref as React.Ref<HTMLSpanElement>}
          className={cx('zest-breadcrumbs__item', className)}
          aria-current={current ? 'page' : undefined}
          data-current={current ? '' : undefined}
          {...(props as React.HTMLAttributes<HTMLSpanElement>)}
        >
          {children}
        </span>
      );
    }
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cx(
          'zest-breadcrumbs__item',
          'zest-breadcrumbs__link',
          'zest-focusable',
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);

/** A crumb in the data-driven `items` API. */
export interface BreadcrumbItem {
  label: React.ReactNode;
  /** Omit for a non-link crumb (the last crumb is always rendered as text). */
  href?: string;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  /** Crumbs as data. Alternative to composing `Breadcrumbs.Item` children. */
  items?: ReadonlyArray<BreadcrumbItem>;
  /** Node rendered between crumbs. Defaults to a chevron. */
  separator?: React.ReactNode;
  /**
   * Maximum crumbs to show. When exceeded, the middle collapses to an
   * ellipsis, keeping the first crumb and the trailing `maxItems - 1`.
   */
  maxItems?: number;
  /** `Breadcrumbs.Item` elements. Ignored when `items` is provided. */
  children?: React.ReactNode;
}

/** Placeholder for the collapsed middle — a Symbol can't collide with a real crumb. */
const ELLIPSIS = Symbol('zest-breadcrumbs-ellipsis');

const BreadcrumbsRoot = React.forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, separator = <ChevronRightIcon />, maxItems, className, children, ...props },
  ref
) {
  const crumbs: React.ReactNode[] = items
    ? items.map((item, index) =>
        item.href ? (
          <BreadcrumbsItem key={index} href={item.href}>
            {item.label}
          </BreadcrumbsItem>
        ) : (
          <BreadcrumbsItem key={index}>{item.label}</BreadcrumbsItem>
        )
      )
    : React.Children.toArray(children);

  let visible: Array<React.ReactNode | typeof ELLIPSIS> = crumbs;
  if (maxItems !== undefined && maxItems >= 2 && crumbs.length > maxItems) {
    visible = [...crumbs.slice(0, 1), ELLIPSIS, ...crumbs.slice(crumbs.length - (maxItems - 1))];
  }

  const lastIndex = visible.length - 1;

  return (
    <nav ref={ref} aria-label="Breadcrumb" className={cx('zest-breadcrumbs', className)} {...props}>
      <ol className="zest-breadcrumbs__list">
        {visible.map((crumb, index) => {
          const isLast = index === lastIndex;
          let content: React.ReactNode;
          if (crumb === ELLIPSIS) {
            content = (
              <span className="zest-breadcrumbs__ellipsis" aria-hidden>
                …
              </span>
            );
          } else if (isLast && React.isValidElement<BreadcrumbsItemProps>(crumb)) {
            content = React.cloneElement(crumb, { current: true });
          } else {
            content = crumb;
          }
          return (
            <li key={index} className="zest-breadcrumbs__list-item">
              {content}
              {!isLast ? (
                <span className="zest-breadcrumbs__separator" aria-hidden>
                  {separator}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

/**
 * Breadcrumb trail — plain semantic `<nav>` + `<ol>`, no primitive needed.
 * The last crumb is marked `aria-current="page"` automatically.
 *
 * ```tsx
 * <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Reports' }]} />
 *
 * <Breadcrumbs maxItems={3}>
 *   <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
 *   <Breadcrumbs.Item>Reports</Breadcrumbs.Item>
 * </Breadcrumbs>
 * ```
 */
export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Item: BreadcrumbsItem,
});
