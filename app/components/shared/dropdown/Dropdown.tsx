'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { cn } from '@/lib/utils';
import DropdownOption, { DropdownOptionProps } from './DropdownOption';

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
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const listboxId = `${id}-listbox`;

  const selected =
    value === undefined ? internalSelected : Array.isArray(value) ? value : [value];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
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

    if (!isOpen || options.length === 0) return;

    switch (e.key) {
      case 'Tab':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % options.length);
        break;

      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(
          (prev) => (prev - 1 + options.length) % options.length
        );
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        handleSelect(options[activeIndex].props.value);
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
        setActiveIndex(options.length - 1);
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

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      <button
        type="button"
        onClick={() =>
          setIsOpen((prev) => {
            const next = !prev;
            if (next) {
              setActiveIndex(0);
            }
            return next;
          })
        }
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-activedescendant={isOpen ? `${id}-option-${activeIndex}` : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn(
          'flex items-center justify-between w-full rounded-md border bg-white shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          sizeClasses[size]
        )}
      >
        <span className={cn(selected.length === 0 && 'text-gray-400')}>
          {displayText}
        </span>

        <span className={cn('transition', isOpen && 'rotate-180')}>
          ▼
        </span>
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          ref={listRef}
          role="listbox"
          aria-multiselectable={multiple || undefined}
          tabIndex={-1}
          className="absolute left-0 mt-2 w-full border rounded-md bg-white shadow-lg z-20"
        >
          {options.map((option, index) => {
            const val = option.props.value;
            const isSelected = selected.includes(val);
            const isActive = index === activeIndex;

            return (
              <li
                id={`${id}-option-${index}`}
                key={val}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                onClick={() => handleSelect(val)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  'px-4 py-2 cursor-pointer flex items-center justify-between',
                  isSelected && 'font-medium',
                  isActive && 'bg-blue-100',
                  'hover:bg-gray-100'
                )}
              >
                <div className="flex items-center gap-2">
                  {multiple && (
                    <input type="checkbox" checked={isSelected} readOnly />
                  )}
                  {option.props.children}
                </div>

                {!multiple && isSelected && <span>✓</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

type DropdownComponent = typeof Dropdown & {
  Option: typeof DropdownOption;
};

(Dropdown as DropdownComponent).Option = DropdownOption;

export default Dropdown as DropdownComponent;