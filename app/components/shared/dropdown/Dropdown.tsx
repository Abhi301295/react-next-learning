'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DropdownProps {
  label: string;
  options: string[];
  onSelect?: (value: string) => void;
  className?: string;
}

const Dropdown = ({ label, options, onSelect, className }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    setIsOpen(false);
    onSelect?.(value);
  };

  return (
    <div className={cn('relative w-56', className)}>
      
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full border px-4 py-2 text-left rounded bg-white"
      >
        {selected || label}
      </button>

      {/* Menu */}
      {isOpen && (
        <ul className="absolute left-0 mt-2 w-full border rounded bg-white shadow-md z-10">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;