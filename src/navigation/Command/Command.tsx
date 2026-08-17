import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { SearchIcon } from '../../icons';
import { cx } from '../../utils';
import '../../base.css';
import './Command.css';

export interface CommandItem {
  id: string;
  label: string;
  /** Optional group heading the item is rendered under. */
  group?: string;
  icon?: React.ReactNode;
  /** Keyboard shortcut hint, e.g. `"⌘+K"` — each `+`-separated part renders as a chip. */
  shortcut?: string;
  /** Extra terms the filter matches in addition to the label. */
  keywords?: string[];
  onSelect?: () => void;
}

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ReadonlyArray<CommandItem>;
  placeholder?: string;
  emptyMessage?: React.ReactNode;
}

interface CommandGroup {
  label: string | undefined;
  items: CommandItem[];
}

function groupItems(items: ReadonlyArray<CommandItem>): CommandGroup[] {
  const groups: CommandGroup[] = [];
  const byLabel = new Map<string | undefined, CommandGroup>();
  for (const item of items) {
    let group = byLabel.get(item.group);
    if (!group) {
      group = { label: item.group, items: [] };
      byLabel.set(item.group, group);
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}

/**
 * Command palette — a top-aligned dialog with a search input and a filtered,
 * keyboard-navigable command list.
 *
 * ```tsx
 * <Command
 *   open={open}
 *   onOpenChange={setOpen}
 *   items={[{ id: 'new-file', label: 'New file', shortcut: '⌘+N', onSelect: createFile }]}
 * />
 * ```
 */
export const Command = React.forwardRef<HTMLDivElement, CommandProps>(function Command(
  {
    open,
    onOpenChange,
    items,
    placeholder = 'Type a command…',
    emptyMessage = 'No results',
    className,
    'aria-label': ariaLabel = 'Command palette',
    ...popupProps
  },
  ref
) {
  const listboxId = React.useId();
  const [query, setQuery] = React.useState('');
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...items];
    return items.filter((item) => {
      const haystack = [item.label, ...(item.keywords ?? [])];
      return haystack.some((term) => term.toLowerCase().includes(q));
    });
  }, [items, query]);

  const groups = React.useMemo(() => groupItems(filtered), [filtered]);
  // Flat keyboard order mirrors the grouped display order.
  const flat = React.useMemo(() => groups.flatMap((group) => group.items), [groups]);

  const optionId = (item: CommandItem) => `${listboxId}-${item.id}`;
  const highlighted = flat[highlightedIndex];

  // Reset transient state whenever the palette closes.
  React.useEffect(() => {
    if (!open) {
      setQuery('');
      setHighlightedIndex(0);
    }
  }, [open]);

  React.useEffect(() => {
    if (!highlighted) return;
    document.getElementById(`${listboxId}-${highlighted.id}`)?.scrollIntoView({ block: 'nearest' });
  }, [highlighted, listboxId]);

  const selectItem = (item: CommandItem) => {
    item.onSelect?.();
    onOpenChange(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (flat.length === 0) return;
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      setHighlightedIndex((index) => (index + delta + flat.length) % flat.length);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      if (highlighted) selectItem(highlighted);
    }
  };

  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="zest-command__backdrop" />
        <BaseDialog.Popup
          ref={ref}
          aria-label={ariaLabel}
          className={cx('zest-command__popup', className)}
          {...popupProps}
        >
          <div className="zest-command__search">
            <SearchIcon className="zest-command__search-icon" />
            <input
              className="zest-command__input"
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listboxId}
              aria-activedescendant={highlighted ? optionId(highlighted) : undefined}
              aria-autocomplete="list"
              aria-label={placeholder}
              autoComplete="off"
              spellCheck={false}
              placeholder={placeholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div
            id={listboxId}
            role="listbox"
            aria-label="Commands"
            className="zest-command__list"
          >
            {flat.length === 0 ? (
              <div className="zest-command__empty">{emptyMessage}</div>
            ) : (
              groups.map((group, groupIndex) => (
                <div
                  key={group.label ?? `__ungrouped-${groupIndex}`}
                  role="group"
                  aria-label={group.label}
                  className="zest-command__group"
                >
                  {group.label ? (
                    <div aria-hidden className="zest-command__group-label">
                      {group.label}
                    </div>
                  ) : null}
                  {group.items.map((item) => {
                    const isHighlighted = highlighted?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        id={optionId(item)}
                        role="option"
                        aria-selected={isHighlighted}
                        data-highlighted={isHighlighted ? '' : undefined}
                        className="zest-command__item"
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseMove={() => {
                          const index = flat.indexOf(item);
                          if (index !== -1 && index !== highlightedIndex) {
                            setHighlightedIndex(index);
                          }
                        }}
                        onClick={() => selectItem(item)}
                      >
                        {item.icon ? (
                          <span className="zest-command__item-icon">{item.icon}</span>
                        ) : null}
                        <span className="zest-command__item-label">{item.label}</span>
                        {item.shortcut ? (
                          <span className="zest-command__shortcut">
                            {item.shortcut.split('+').map((key, keyIndex) => (
                              <kbd key={keyIndex} className="zest-command__kbd">
                                {key}
                              </kbd>
                            ))}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
});
