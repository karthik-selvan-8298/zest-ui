import * as React from 'react';
import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { cx } from '../../utils';
import '../../base.css';
import './Autocomplete.css';

export interface AutocompleteSuggestion {
  value: string;
  /** Plain-text label shown in the list and filled into the input. */
  label: string;
}

export interface AutocompleteProps {
  /** Suggestions shown under the input, filtered by what the user typed. */
  suggestions: ReadonlyArray<string | AutocompleteSuggestion>;
  /** The input text. Use when controlled. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md';
  error?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  /** Message shown when no suggestion matches. Defaults to “No results”. */
  emptyMessage?: React.ReactNode;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

/**
 * Free-text input with suggestions on Base UI Autocomplete — the value is
 * always the input text; picking a suggestion just fills it in.
 *
 * ```tsx
 * <Autocomplete placeholder="Search docs" suggestions={['Alert', 'Avatar', 'Badge']} />
 * ```
 */
export const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  function Autocomplete(
    {
      suggestions,
      value,
      defaultValue,
      onValueChange,
      placeholder,
      size = 'md',
      error,
      fullWidth,
      disabled,
      emptyMessage = 'No results',
      id,
      className,
      'aria-label': ariaLabel,
    },
    ref
  ) {
    const groupRef = React.useRef<HTMLDivElement | null>(null);

    const items = React.useMemo<AutocompleteSuggestion[]>(
      () =>
        suggestions.map((suggestion) =>
          typeof suggestion === 'string'
            ? { value: suggestion, label: suggestion }
            : suggestion
        ),
      [suggestions]
    );

    return (
      <BaseAutocomplete.Root
        items={items}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next: string) => onValueChange?.(next)}
        itemToStringValue={(item: AutocompleteSuggestion) => item.label}
        disabled={disabled}
      >
        <BaseAutocomplete.InputGroup
          ref={groupRef}
          className={cx('zest-autocomplete', className)}
          data-size={size}
          data-error={error ? '' : undefined}
          data-full-width={fullWidth ? '' : undefined}
        >
          <BaseAutocomplete.Input
            ref={ref}
            id={id}
            aria-label={ariaLabel}
            placeholder={placeholder}
            className="zest-autocomplete__input"
          />
        </BaseAutocomplete.InputGroup>
        <BaseAutocomplete.Portal>
          <BaseAutocomplete.Positioner
            className="zest-autocomplete__positioner"
            side="bottom"
            align="start"
            sideOffset={4}
            anchor={groupRef}
          >
            <BaseAutocomplete.Popup className="zest-autocomplete__popup">
              <BaseAutocomplete.Empty className="zest-autocomplete__empty">
                {emptyMessage}
              </BaseAutocomplete.Empty>
              <BaseAutocomplete.List className="zest-autocomplete__list">
                {(item: AutocompleteSuggestion) => (
                  <BaseAutocomplete.Item
                    key={item.value}
                    value={item}
                    className="zest-autocomplete__item"
                  >
                    {item.label}
                  </BaseAutocomplete.Item>
                )}
              </BaseAutocomplete.List>
            </BaseAutocomplete.Popup>
          </BaseAutocomplete.Positioner>
        </BaseAutocomplete.Portal>
      </BaseAutocomplete.Root>
    );
  }
);

/** Advanced escape hatch: raw Base UI Autocomplete parts for full composition. */
export const AutocompletePrimitive = BaseAutocomplete;
