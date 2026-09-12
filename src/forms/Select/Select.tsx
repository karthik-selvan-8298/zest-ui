import * as React from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { CheckIcon, ChevronDownIcon, CloseIcon, SearchIcon } from '../../icons';
import { cx } from '../../utils';
import '../../base.css';
import './Select.css';

export interface SelectOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
  /** Extra terms the in-popup search matches (useful when `label` is not a string). */
  keywords?: string[];
}

interface SelectBaseProps<T extends string = string> extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'defaultValue' | 'onChange' | 'size' | 'name'
> {
  options: ReadonlyArray<SelectOption<T>>;
  placeholder?: React.ReactNode;
  size?: 'sm' | 'md';
  error?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** Identifies the field when a form is submitted. */
  name?: string;
  /**
   * Show a clear button (a sibling of the trigger, at its trailing edge)
   * whenever something is selected. Resets to `null` / `[]`.
   */
  clearable?: boolean;
  /**
   * In-popup search field. `'auto'` (default) shows it only when there are
   * more than `searchThreshold` options; `true`/`false` force it on/off.
   */
  searchable?: boolean | 'auto';
  /** Option count above which `searchable='auto'` shows the search field. @default 8 */
  searchThreshold?: number;
  /** Placeholder of the search field. @default 'Search…' */
  searchPlaceholder?: string;
  /** Row shown when the search matches nothing. @default 'No matches' */
  noResultsText?: React.ReactNode;
}

export interface SelectSingleProps<T extends string = string> extends SelectBaseProps<T> {
  multiple?: false;
  value?: T | null;
  defaultValue?: T | null;
  onValueChange?: (value: T | null) => void;
  maxVisible?: never;
  renderValue?: never;
}

export interface SelectMultipleProps<T extends string = string> extends SelectBaseProps<T> {
  /** Toggle items on/off; the popup stays open between picks. */
  multiple: true;
  value?: T[];
  defaultValue?: T[];
  onValueChange?: (value: T[]) => void;
  /** How many selected chips to show before collapsing into a `+N` chip. @default 2 */
  maxVisible?: number;
  /** Replace the default chips with your own rendering of the selected options. */
  renderValue?: (selected: SelectOption<T>[]) => React.ReactNode;
}

export type SelectProps<T extends string = string> = SelectSingleProps<T> | SelectMultipleProps<T>;

/* Loosened view of the union used only inside the implementation. */
interface SelectInnerProps<T extends string> extends SelectBaseProps<T> {
  multiple?: boolean;
  value?: T | null | T[];
  defaultValue?: T | null | T[];
  onValueChange?: (value: T | null | T[], eventDetails?: unknown) => void;
  maxVisible?: number;
  renderValue?: (selected: SelectOption<T>[]) => React.ReactNode;
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
 * <Select multiple options={tags} value={selected} onValueChange={setSelected} />
 * ```
 *
 * For a long, filterable list use `Combobox` instead — it is this trigger
 * with a built-in search input.
 */
function SelectInner<T extends string = string>(
  props: SelectProps<T>,
  ref: React.Ref<HTMLButtonElement>
) {
  const {
    options,
    multiple = false,
    value,
    defaultValue,
    onValueChange,
    maxVisible = 2,
    renderValue,
    placeholder = 'Select…',
    size = 'md',
    error,
    fullWidth,
    disabled,
    required,
    name,
    clearable,
    searchable = 'auto',
    searchThreshold = 8,
    searchPlaceholder = 'Search…',
    noResultsText = 'No matches',
    className,
    ...triggerProps
  } = props as SelectInnerProps<T>;

  // ── In-popup search ────────────────────────────────────────────────────
  const showSearch =
    searchable === true || (searchable === 'auto' && options.length > searchThreshold);
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const normalized = query.trim().toLowerCase();
  const visibleOptions = React.useMemo(() => {
    if (!showSearch || !normalized) return options;
    return options.filter((option) => {
      const haystack = [
        typeof option.label === 'string' || typeof option.label === 'number'
          ? String(option.label)
          : '',
        option.value,
        ...(option.keywords ?? []),
      ];
      return haystack.some((term) => term.toLowerCase().includes(normalized));
    });
  }, [options, normalized, showSearch]);

  const selectOption = (option: SelectOption<T>) => {
    if (multiple) {
      const list = Array.isArray(current) ? (current as T[]) : [];
      handleValueChange(
        list.includes(option.value)
          ? list.filter((v) => v !== option.value)
          : [...list, option.value]
      );
    } else {
      handleValueChange(option.value);
      setOpen(false);
    }
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Escape / Tab bubble to Base UI (close, focus management).
    if (event.key === 'Escape' || event.key === 'Tab') return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      const items = listRef.current?.querySelectorAll<HTMLElement>(
        '[role="option"]:not([aria-disabled="true"])'
      );
      const target =
        items && items.length ? items[event.key === 'ArrowDown' ? 0 : items.length - 1] : null;
      target?.focus();
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      const enabled = visibleOptions.filter((o) => !o.disabled);
      if (enabled.length === 1) selectOption(enabled[0]!);
      return;
    }
    // Everything else stays in the input — keep Base UI's list typeahead from stealing keystrokes.
    event.stopPropagation();
  };

  // Value is mirrored locally so the clear button can read and reset it.
  // Base UI is always driven controlled from here (no controlled/uncontrolled
  // flip warnings); uncontrolled consumers keep their `defaultValue` semantics.
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<T | null | T[]>(
    () => defaultValue ?? (multiple ? [] : null)
  );
  const current = isControlled ? value : internal;

  const handleValueChange = (next: T | null | T[], eventDetails?: unknown) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next, eventDetails);
  };

  const hasValue = multiple ? Array.isArray(current) && current.length > 0 : current != null;
  const showClear = Boolean(clearable && hasValue && !disabled);

  const renderTriggerValue = (raw: unknown) => {
    if (multiple) {
      const values = Array.isArray(raw) ? (raw as T[]) : [];
      const selected = values
        .map((v) => options.find((option) => option.value === v))
        .filter((option): option is SelectOption<T> => option !== undefined);
      if (selected.length === 0) {
        return <span className="zest-select__placeholder">{placeholder}</span>;
      }
      if (renderValue) return renderValue(selected);
      const visible = selected.slice(0, Math.max(0, maxVisible));
      const overflow = selected.length - visible.length;
      return (
        <span className="zest-select__chips">
          {visible.map((option) => (
            <span key={option.value} className="zest-select__chip" data-accent="neutral">
              <span className="zest-select__chip-label">{option.label}</span>
            </span>
          ))}
          {overflow > 0 ? (
            <span className="zest-select__chip zest-select__chip--overflow" data-accent="neutral">
              <span className="zest-select__chip-label">+{overflow}</span>
            </span>
          ) : null}
        </span>
      );
    }
    const selected = options.find((option) => option.value === raw);
    return selected ? (
      selected.label
    ) : (
      <span className="zest-select__placeholder">{placeholder}</span>
    );
  };

  const trigger = (
    <BaseSelect.Trigger
      ref={ref}
      className={cx('zest-select__trigger', 'zest-focusable', className)}
      data-size={size}
      data-error={error ? '' : undefined}
      data-full-width={fullWidth ? '' : undefined}
      data-multiple={multiple ? '' : undefined}
      data-clearable={clearable ? '' : undefined}
      {...triggerProps}
    >
      <BaseSelect.Value className="zest-select__value">{renderTriggerValue}</BaseSelect.Value>
      <BaseSelect.Icon className="zest-select__icon">
        <ChevronDownIcon />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );

  return (
    <BaseSelect.Root
      multiple={multiple}
      value={current}
      onValueChange={handleValueChange as (value: unknown) => void}
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery('');
      }}
      onOpenChangeComplete={(open) => {
        if (open && showSearch) searchRef.current?.focus();
      }}
      disabled={disabled}
      required={required}
      name={name}
    >
      {clearable ? (
        // A <button> cannot nest another button, so the clear control sits
        // beside the trigger in a positioned shell (same recipe as DatePicker).
        <span className="zest-select" data-full-width={fullWidth ? '' : undefined}>
          {trigger}
          {showClear ? (
            <button
              type="button"
              className="zest-select__clear zest-focusable"
              aria-label="Clear"
              onClick={() => handleValueChange(multiple ? [] : null)}
            >
              <CloseIcon />
            </button>
          ) : null}
        </span>
      ) : (
        trigger
      )}
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          className="zest-select__positioner"
          side="bottom"
          align="start"
          sideOffset={4}
          alignItemWithTrigger={false}
        >
          <BaseSelect.Popup
            className="zest-select__popup"
            data-searchable={showSearch ? '' : undefined}
          >
            {showSearch ? (
              <div className="zest-select__search">
                <SearchIcon className="zest-select__search-icon" />
                <input
                  ref={searchRef}
                  type="text"
                  role="searchbox"
                  aria-label={searchPlaceholder}
                  className="zest-select__search-input"
                  placeholder={searchPlaceholder}
                  autoComplete="off"
                  spellCheck={false}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
            ) : null}
            <BaseSelect.List ref={listRef} className="zest-select__list">
              {showSearch && visibleOptions.length === 0 ? (
                <div className="zest-select__empty" role="presentation">
                  {noResultsText}
                </div>
              ) : null}
              {visibleOptions.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="zest-select__item"
                >
                  {/* Kept mounted so unselected rows stay aligned — matters most
                      in multiple mode where several checks toggle at once. */}
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

/** Wrapper preserves the `<T>` generic while still exposing a forwardable ref. */
export const Select = React.forwardRef(SelectInner) as <T extends string = string>(
  props: SelectProps<T> & { ref?: React.Ref<HTMLButtonElement> }
) => React.ReactElement;

/** Advanced escape hatch: raw Base UI Select parts for full composition. */
export const SelectPrimitive = BaseSelect;
