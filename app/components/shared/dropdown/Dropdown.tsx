'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { DropdownOptionProps } from './DropdownOption';

interface DropdownProps {
    children: React.ReactNode;
    placeholder?: string;
    onChange?: (value: string | string[]) => void;
    className?: string;
    multiple?: boolean;
}

const Dropdown = ({
    children,
    placeholder = 'Select option',
    onChange,
    className,
    multiple = false
}: DropdownProps) => {

    const [isOpen, setIsOpen] = useState(false);

    const [selected, setSelected] = useState<string[]>([]);

    const ref = useRef<HTMLDivElement>(null);

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

    const handleSelect = (value: string) => {
        if (multiple) {
            let updated: string[];

            if (selected.includes(value)) {
                updated = selected.filter(v => v !== value);
            } else {
                updated = [...selected, value];
            }

            setSelected(updated);
            onChange?.(updated);
        } else {
            setSelected([value]);
            setIsOpen(false);
            onChange?.(value);
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
        <div ref={ref} className={cn('relative w-64', className)}>

            <button
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
                        const value = option.props.value;
                        const isSelected = selected.includes(value);

                        return (
                            <li
                                key={value}
                                onClick={() => handleSelect(value)}
                                className={cn(
                                    'px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between',
                                    isSelected && 'bg-gray-100 font-medium'
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

export default Dropdown;