import * as React from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { CheckIcon, ChevronDownIcon } from '../../icons';
import { cx } from '../../utils';
import '../../base.css';
import './Combobox.css';

export interface ComboboxOption {
  value: string;
  /** Plain-text label — also what the filter matches against. */
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ReadonlyArray<ComboboxOption>;
  /** Selected value. Use when controlled. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  size?: 'sm' | 'md';
  error?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** Identifies the field when a form is submitted. */
  name?: string;
  /** Message shown when the filter matches no options. Defaults to “No results”. */
  emptyMessage?: React.ReactNode;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

/**
 * Filterable single-select on Base UI Combobox — an input trigger that
 * narrows the option list as the user types.
 *
 * ```tsx
 * <Combobox
 *   placeholder="Choose fruit"
 *   options={[{ value: 'apple', label: 'Apple' }, { value: 'banana', label: 'Banana' }]}
 * />
 * ```
 */
export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    options,
    value,
    defaultValue,
    onValueChange,
    placeholder = 'Search…',
    size = 'md',
    error,
    fullWidth,
    disabled,
    required,
    name,
    emptyMessage = 'No results',
    id,
    className,
    'aria-label': ariaLabel,
  },
  ref
) {
  const groupRef = React.useRef<HTMLDivElement | null>(null);

  const toOption = (next: string | null | undefined) =>
    next == null ? null : (options.find((option) => option.value === next) ?? null);

  return (
    <BaseCombobox.Root
      items={options}
      value={value === undefined ? undefined : toOption(value)}
      defaultValue={defaultValue === undefined ? undefined : toOption(defaultValue)}
      onValueChange={(option: ComboboxOption | null) => {
        onValueChange?.(option ? option.value : null);
      }}
      itemToStringLabel={(option: ComboboxOption) => option.label}
      itemToStringValue={(option: ComboboxOption) => option.value}
      isItemEqualToValue={(a: ComboboxOption, b: ComboboxOption) => a.value === b.value}
      disabled={disabled}
      required={required}
      name={name}
    >
      <BaseCombobox.InputGroup
        ref={groupRef}
        className={cx('zest-combobox', className)}
        data-size={size}
        data-error={error ? '' : undefined}
        data-full-width={fullWidth ? '' : undefined}
      >
        <BaseCombobox.Input
          ref={ref}
          id={id}
          aria-label={ariaLabel}
          placeholder={placeholder}
          className="zest-combobox__input"
        />
        <BaseCombobox.Trigger
          className="zest-combobox__trigger zest-focusable"
          aria-label="Open options"
          tabIndex={-1}
        >
          <BaseCombobox.Icon className="zest-combobox__icon">
            <ChevronDownIcon />
          </BaseCombobox.Icon>
        </BaseCombobox.Trigger>
      </BaseCombobox.InputGroup>
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner
          className="zest-combobox__positioner"
          side="bottom"
          align="start"
          sideOffset={4}
          anchor={groupRef}
        >
          <BaseCombobox.Popup className="zest-combobox__popup">
            <BaseCombobox.Empty className="zest-combobox__empty">
              {emptyMessage}
            </BaseCombobox.Empty>
            <BaseCombobox.List className="zest-combobox__list">
              {(option: ComboboxOption) => (
                <BaseCombobox.Item
                  key={option.value}
                  value={option}
                  disabled={option.disabled}
                  className="zest-combobox__item"
                >
                  <span className="zest-combobox__item-text">{option.label}</span>
                  <BaseCombobox.ItemIndicator className="zest-combobox__item-indicator">
                    <CheckIcon />
                  </BaseCombobox.ItemIndicator>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  );
});

/** Advanced escape hatch: raw Base UI Combobox parts for full composition. */
export const ComboboxPrimitive = BaseCombobox;
