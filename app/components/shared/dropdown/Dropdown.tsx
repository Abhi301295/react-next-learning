'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { DropdownOptionProps } from './DropdownOption';

interface DropdownProps {
  children: React.ReactNode;
  value?: string | string[];
  placeholder?: string;
  onChange?: (value: string | string[]) => void;
  className?: string;
  multiple?: boolean;
}

const Dropdown = ({
  children,
  value,
  placeholder = 'Select option',
  onChange,
  className,
  multiple = false,
}: DropdownProps) => {

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // ✅ derive selected from value (controlled)
  const selected = Array.isArray(value)
    ? value
    : value
    ? [value]
    : [];

  // ✅ close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = React.Children.toArray(children)
    .filter(Boolean)
    .map(child => child as React.ReactElement<DropdownOptionProps>);

  const handleSelect = (val: string) => {
    if (multiple) {
      let updated: string[];

      if (selected.includes(val)) {
        updated = selected.filter(v => v !== val);
      } else {
        updated = [...selected, val];
      }

      onChange?.(updated);
    } else {
      onChange?.(val);
      setIsOpen(false);
    }
  };

  const selectedLabels = options
    .filter(opt => selected.includes(opt.props.value))
    .map(opt => opt.props.children);

  const displayText =
    selectedLabels.length > 0
      ? selectedLabels.join(', ')
      : placeholder;

  return (
    <div ref={ref} className={cn('relative w-full', className)}>

      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center justify-between w-full border rounded-md px-4 py-2 bg-white shadow-sm"
      >
        <span className={cn(selected.length === 0 && 'text-gray-400')}>
          {displayText}
        </span>

        <span className={cn('transition', isOpen && 'rotate-180')}>
          ▼
        </span>
      </button>

      {isOpen && (
        <ul className="absolute left-0 mt-2 w-full border rounded-md bg-white shadow-lg z-20">

          {options.map((option) => {
            const val = option.props.value;
            const isSelected = selected.includes(val);

            return (
              <li
                key={val}
                onClick={() => handleSelect(val)}
                className={cn(
                  'px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between',
                  isSelected && 'bg-gray-100 font-medium'
                )}
              >
                <div className="flex items-center gap-2">

                  {multiple && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                    />
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

export default Dropdown;