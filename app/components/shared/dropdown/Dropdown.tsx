'use client';

import React, { useState, useRef, useEffect, useId, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import DropdownOption, { DropdownOptionProps } from './DropdownOption';

const PORTAL_Z = 220;

interface DropdownProps {
  children: React.ReactNode;
  placeholder?: string;
  onChange?: (value: string | string[]) => void;
  className?: string;
  multiple?: boolean;
  value?: string | string[];
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  noResultsText?: string;
}

const Dropdown = ({
  children,
  placeholder = 'Select option',
  onChange,
  className,
  multiple = false,
  value,
  size = 'md',
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  ariaInvalid = false,
  searchable = false,
  searchPlaceholder = 'Search options...',
  noResultsText = 'No options found',
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [panelBox, setPanelBox] = useState({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 240,
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const listboxId = `${id}-listbox`;

  const selected =
    value === undefined ? internalSelected : Array.isArray(value) ? value : [value];

  const computePanel = React.useCallback(() => {
    const el = triggerRef.current;
    if (!el || typeof window === 'undefined') return;
    const r = el.getBoundingClientRect();
    const gutter = 8;
    const spaceBelow = window.innerHeight - r.bottom - gutter - 24;
    const maxList = Math.max(104, Math.min(240, spaceBelow));
    setPanelBox({
      top: r.bottom + gutter,
      left: r.left,
      width: Math.max(r.width, 160),
      maxHeight: maxList,
    });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    computePanel();

    const onWin = () => computePanel();

    window.addEventListener('resize', onWin);
    window.addEventListener('scroll', onWin, true);
    return () => {
      window.removeEventListener('resize', onWin);
      window.removeEventListener('scroll', onWin, true);
    };
  }, [isOpen, computePanel]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (portalRef.current?.contains(t)) return;
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDropdownOption = (
    child: React.ReactNode
  ): child is React.ReactElement<DropdownOptionProps> => {
    if (!React.isValidElement(child)) return false;

    const props = child.props as Partial<DropdownOptionProps>;

    return typeof props.value === 'string';
  };

  const options = React.Children.toArray(children).filter(isDropdownOption);
  const filteredOptions = options.filter((option) =>
    String(option.props.children).toLowerCase().includes(searchQuery.trim().toLowerCase())
  );
  const safeActiveIndex =
    filteredOptions.length === 0 ? 0 : Math.min(activeIndex, filteredOptions.length - 1);

  const handleSelect = (val: string) => {
    if (multiple) {
      let updated: string[];

      if (selected.includes(val)) {
        updated = selected.filter((v) => v !== val);
      } else {
        updated = [...selected, val];
      }

      if (value === undefined) {
        setInternalSelected(updated);
      }
      onChange?.(updated);
    } else {
      if (value === undefined) {
        setInternalSelected([val]);
      }
      setIsOpen(false);
      onChange?.(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setActiveIndex(0);
      setIsOpen(true);
      return;
    }

    if (!isOpen || filteredOptions.length === 0) return;

    switch (e.key) {
      case 'Tab':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filteredOptions.length);
        break;

      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(
          (prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length
        );
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        handleSelect(filteredOptions[safeActiveIndex].props.value);
        break;

      case 'Escape':
        setIsOpen(false);
        break;

      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;

      case 'End':
        e.preventDefault();
        setActiveIndex(filteredOptions.length - 1);
        break;

      default:
        break;
    }
  };

  const selectedLabels = options
    .filter((opt) => selected.includes(opt.props.value))
    .map((opt) => opt.props.children);

  const displayText =
    selectedLabels.length > 0
      ? selectedLabels.map((label) => String(label)).join(', ')
      : placeholder;
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-4 text-base',
  };

  const panel =
    isOpen && typeof document !== 'undefined' ? (
      <div
        ref={portalRef}
        style={{
          position: 'fixed',
          top: panelBox.top,
          left: panelBox.left,
          width: panelBox.width,
          zIndex: PORTAL_Z,
        }}
        className="rounded-md border border-stroke bg-panel text-foreground shadow-lg outline-none ring-1 ring-black/5 dark:ring-white/10"
      >
          {searchable && (
            <div className="border-b border-stroke p-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={(event) => event.stopPropagation()}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="h-8 w-full rounded border border-stroke bg-background px-2 text-sm text-foreground placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}
          <ul
            id={listboxId}
            role="listbox"
            aria-multiselectable={multiple || undefined}
            tabIndex={-1}
            className={cn(
              'overflow-y-auto overscroll-contain py-1',
              '[scrollbar-width:thin] [scrollbar-color:var(--color-stroke)_transparent]'
            )}
            style={{ maxHeight: panelBox.maxHeight }}
          >
            {filteredOptions.map((option, index) => {
            const val = option.props.value;
            const isSel = selected.includes(val);
            const isActiveOpt = index === safeActiveIndex;

            return (
              <li
                id={`${id}-option-${index}`}
                key={val}
                role="option"
                aria-selected={isSel}
                tabIndex={-1}
                onClick={() => handleSelect(val)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  'flex cursor-pointer items-center justify-between px-3 py-2 text-sm text-foreground',
                  isSel && 'font-medium',
                  isActiveOpt && 'bg-brand-500/15',
                  'hover:bg-background'
                )}
              >
                <div className="flex items-center gap-2">
                  {multiple && (
                    <input type="checkbox" checked={isSel} readOnly tabIndex={-1} aria-hidden />
                  )}
                  {option.props.children}
                </div>

                {!multiple && isSel && <span aria-hidden>✓</span>}
              </li>
            );
            })}
            {filteredOptions.length === 0 && (
              <li className="px-3 py-2 text-sm text-subtle">{noResultsText}</li>
            )}
          </ul>
        </div>
    ) : null;

  return (
    <div ref={rootRef} className={cn('relative w-full', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() =>
          setIsOpen((prev) => {
            const next = !prev;
            if (next) {
              setSearchQuery('');
              setActiveIndex(0);
              requestAnimationFrame(() => computePanel());
            }
            return next;
          })
        }
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-activedescendant={isOpen ? `${id}-option-${safeActiveIndex}` : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid || undefined}
        className={cn(
          'flex w-full items-center justify-between rounded-md border border-stroke bg-panel text-foreground shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-brand-500'
        , sizeClasses[size])}
      >
        <span
          suppressHydrationWarning
          className={cn('min-w-0 truncate text-left', selected.length === 0 && 'text-subtle')}
        >
          {displayText}
        </span>

        <span className={cn('shrink-0 pl-2 transition', isOpen && 'rotate-180')} aria-hidden>
          ▼
        </span>
      </button>

      {panel && createPortal(panel, document.body)}
    </div>
  );
};

type DropdownComponent = typeof Dropdown & {
  Option: typeof DropdownOption;
};

(Dropdown as DropdownComponent).Option = DropdownOption;

export default Dropdown as DropdownComponent;
