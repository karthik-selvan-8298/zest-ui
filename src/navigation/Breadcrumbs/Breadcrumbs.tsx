import * as React from 'react';
import { ChevronRightIcon } from '../../icons';
import { cx } from '../../utils';
import '../../base.css';
import './Breadcrumbs.css';

/*
 * Breadcrumbs — plain semantic markup, no primitive needed.
 *
 * <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Reports' }]} />
 *
 * or composed:
 *
 * <Breadcrumbs>
 *   <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
 *   <Breadcrumbs.Item>Reports</Breadcrumbs.Item>
 * </Breadcrumbs>
 */

export interface BreadcrumbsItemProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** Link target. Omit for non-link crumbs (e.g. the current page). */
  href?: string;
  /**
   * Marks the crumb as the current page (`aria-current="page"`, no link).
   * Set automatically on the last child by the Breadcrumbs root.
   */
  current?: boolean;
  children?: React.ReactNode;
}

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
        className={cx('zest-breadcrumbs__item', 'zest-breadcrumbs__link', 'zest-focusable', className)}
        {...props}
      >
        {children}
      </a>
    );
  }
);

export interface BreadcrumbItem {
  label: React.ReactNode;
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

const ELLIPSIS = Symbol('zest-breadcrumbs-ellipsis');

const BreadcrumbsRoot = React.forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, separator = <ChevronRightIcon />, maxItems, className, children, ...props },
  ref
) {
  const crumbs: React.ReactNode[] = items
    ? items.map((item, index) => (
        <BreadcrumbsItem key={index} href={item.href}>
          {item.label}
        </BreadcrumbsItem>
      ))
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

export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Item: BreadcrumbsItem,
});
