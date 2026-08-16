import * as React from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { CheckIcon, ChevronDownIcon } from '../../icons';
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
 *
 * For a long, filterable list use `Combobox` instead — it is this trigger
 * with a built-in search input.
 */
export function Select<T extends string = string>({
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

/** Advanced escape hatch: raw Base UI Select parts for full composition. */
export const SelectPrimitive = BaseSelect;
