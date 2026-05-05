'use client';

import Input from '@/components/ui/Input';

type TableSearchProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
};

export default function TableSearch({
  value,
  onChange,
  label = 'Search',
  placeholder = 'Search...',
}: TableSearchProps) {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      label={label}
    />
  );
}
