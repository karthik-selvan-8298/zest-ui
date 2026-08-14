import * as React from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { CheckIcon, ChevronDownIcon, SearchIcon } from '../../icons';
import { cx } from '../../utils';
import '../../base.css';
import './Select.css';

export interface SelectOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string> {
  options: ReadonlyArray<SelectOption<T>>;
  value?: T | null;
  defaultValue?: T | null;
  onValueChange?: (value: T | null) => void;
  placeholder?: React.ReactNode;
  size?: 'sm' | 'md';
  error?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
  /**
   * Adds a search box at the top of the popup that filters the options —
   * use when the list is long.
   */
  searchable?: boolean;
  /** Placeholder of the popup search box. */
  searchPlaceholder?: string;
}

/**
 * Select on Base UI — full keyboard navigation, typeahead, and accessible
 * listbox semantics.
 *
 * ```tsx
 * <Select
 *   placeholder="Choose role"
 *   options={[{ value: 'admin', label: 'Admin' }, { value: 'viewer', label: 'Viewer' }]}
 * />
 * ```
 */
export function Select<T extends string = string>(props: SelectProps<T>) {
  if (props.searchable) return <SearchableSelect {...props} />;
  return <PlainSelect {...props} />;
}

function PlainSelect<T extends string = string>({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select…',
  size = 'md',
  error,
  fullWidth,
  disabled,
  required,
  name,
  id,
  className,
  'aria-label': ariaLabel,
}: SelectProps<T>) {
  return (
    <BaseSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange as (value: unknown) => void}
      disabled={disabled}
      required={required}
      name={name}
    >
      <BaseSelect.Trigger
        id={id}
        aria-label={ariaLabel}
        className={cx('zest-select__trigger', 'zest-focusable', className)}
        data-size={size}
        data-error={error ? '' : undefined}
        data-full-width={fullWidth ? '' : undefined}
      >
        <BaseSelect.Value className="zest-select__value">
          {(value: T | null) => {
            const selected = options.find((option) => option.value === value);
            return selected ? (
              selected.label
            ) : (
              <span className="zest-select__placeholder">{placeholder}</span>
            );
          }}
        </BaseSelect.Value>
        <BaseSelect.Icon className="zest-select__icon">
          <ChevronDownIcon />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          className="zest-select__positioner"
          side="bottom"
          align="start"
          sideOffset={4}
          alignItemWithTrigger={false}
        >
          <BaseSelect.Popup className="zest-select__popup">
            <BaseSelect.List className="zest-select__list">
              {options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="zest-select__item"
                >
                  <BaseSelect.ItemIndicator className="zest-select__item-indicator" keepMounted>
                    <CheckIcon />
                  </BaseSelect.ItemIndicator>
                  <BaseSelect.ItemText className="zest-select__item-text">
                    {option.label}
                  </BaseSelect.ItemText>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}

interface SearchableItem {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  /** Plain text used for filtering. */
  text: string;
}

/** Select with a filter box in the popup — built on Base UI Combobox. */
function SearchableSelect<T extends string = string>({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select…',
  size = 'md',
  error,
  fullWidth,
  disabled,
  required,
  name,
  id,
  className,
  'aria-label': ariaLabel,
  searchPlaceholder = 'Search…',
}: SelectProps<T>) {
  const items: SearchableItem[] = React.useMemo(
    () =>
      options.map((option) => ({
        ...option,
        text: typeof option.label === 'string' ? option.label : option.value,
      })),
    [options]
  );
  const toItem = (next: T | null | undefined) =>
    next == null ? null : (items.find((item) => item.value === next) ?? null);

  return (
    <BaseCombobox.Root
      items={items}
      value={value === undefined ? undefined : toItem(value)}
      defaultValue={defaultValue === undefined ? undefined : toItem(defaultValue)}
      onValueChange={(item: SearchableItem | null) => {
        onValueChange?.((item ? item.value : null) as T | null);
      }}
      itemToStringLabel={(item: SearchableItem) => item.text}
      itemToStringValue={(item: SearchableItem) => item.value}
      isItemEqualToValue={(a: SearchableItem, b: SearchableItem) => a.value === b.value}
      disabled={disabled}
      required={required}
      name={name}
    >
      <BaseCombobox.Trigger
        id={id}
        aria-label={ariaLabel}
        className={cx('zest-select__trigger', 'zest-focusable', className)}
        data-size={size}
        data-error={error ? '' : undefined}
        data-full-width={fullWidth ? '' : undefined}
      >
        <span className="zest-select__value">
          <BaseCombobox.Value>
            {(item: SearchableItem | null) =>
              item ? item.label : <span className="zest-select__placeholder">{placeholder}</span>
            }
          </BaseCombobox.Value>
        </span>
        <BaseCombobox.Icon className="zest-select__icon">
          <ChevronDownIcon />
        </BaseCombobox.Icon>
      </BaseCombobox.Trigger>
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner
          className="zest-select__positioner"
          side="bottom"
          align="start"
          sideOffset={4}
        >
          <BaseCombobox.Popup className="zest-select__popup" data-searchable="">
            <div className="zest-select__search">
              <SearchIcon size={16} />
              <BaseCombobox.Input
                placeholder={searchPlaceholder}
                className="zest-select__search-input"
              />
            </div>
            <BaseCombobox.Empty className="zest-select__empty">No results</BaseCombobox.Empty>
            <BaseCombobox.List className="zest-select__list">
              {(item: SearchableItem) => (
                <BaseCombobox.Item
                  key={item.value}
                  value={item}
                  disabled={item.disabled}
                  className="zest-select__item"
                >
                  <BaseCombobox.ItemIndicator className="zest-select__item-indicator" keepMounted>
                    <CheckIcon />
                  </BaseCombobox.ItemIndicator>
                  <span className="zest-select__item-text">{item.label}</span>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  );
}

/** Advanced escape hatch: raw Base UI Select parts for full composition. */
export const SelectPrimitive = BaseSelect;
