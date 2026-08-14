import * as React from 'react';
import { cx } from '../../utils';
import { SearchInput, type SearchInputProps } from '../../forms/SearchInput/SearchInput';
import './SearchToolbar.css';

export interface SearchToolbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Search value (controlled) */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchProps?: Partial<SearchInputProps>;
  /** Filter controls rendered next to the search input. */
  filters?: React.ReactNode;
  /** Primary actions aligned to the end (buttons, menus). */
  actions?: React.ReactNode;
}

/**
 * List/table toolbar: search + optional filters + end-aligned actions.
 *
 * ```tsx
 * <SearchToolbar placeholder="Search members…" onValueChange={setQuery}
 *   filters={<Select … />} actions={<Button>Invite</Button>} />
 * ```
 */
export const SearchToolbar = React.forwardRef<HTMLDivElement, SearchToolbarProps>(
  function SearchToolbar(
    { value, defaultValue, onValueChange, placeholder, searchProps, filters, actions, className, ...props },
    ref
  ) {
    return (
      <div ref={ref} className={cx('zest-search-toolbar', className)} {...props}>
        <SearchInput
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          placeholder={placeholder}
          className="zest-search-toolbar__input"
          {...searchProps}
        />
        {filters ? <div className="zest-search-toolbar__filters">{filters}</div> : null}
        {actions ? <div className="zest-search-toolbar__actions">{actions}</div> : null}
      </div>
    );
  }
);
