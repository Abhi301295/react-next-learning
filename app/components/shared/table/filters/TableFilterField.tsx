'use client';

import Dropdown from '@/components/shared/dropdown/Dropdown';
import DropdownOption from '@/components/shared/dropdown/DropdownOption';

type FilterOption = {
  label: string;
  value: string;
};

type TableFilterFieldProps = {
  label?: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function TableFilterField({
  label = 'Filter',
  value,
  options,
  onChange,
  placeholder = 'Select option',
  className,
}: TableFilterFieldProps) {
  return (
    <div className="space-y-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <Dropdown
        value={value}
        onChange={(nextValue) => onChange(nextValue as string)}
        placeholder={placeholder}
        className={className}
      >
        {options.map((option) => (
          <DropdownOption key={option.value} value={option.value}>
            {option.label}
          </DropdownOption>
        ))}
      </Dropdown>
    </div>
  );
}
