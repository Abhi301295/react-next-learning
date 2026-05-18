import { useId } from 'react';
import Dropdown from '@/components/shared/dropdown/Dropdown';
import DropdownOption from '@/components/shared/dropdown/DropdownOption';
import Input from '@/components/ui/Input';
import { FilterValue } from '@/lib/hooks/useTableControls';

type FilterOption = {
  label: string;
  value: string;
};

type FieldType =
  | 'select'
  | 'multi-select'
  | 'date'
  | 'checkbox'
  | 'checkbox-group'
  | 'radio-group';

type TableFilterFieldProps = {
  label?: string;
  type?: FieldType;
  value: FilterValue;
  options?: FilterOption[];
  onChange: (value: FilterValue) => void;
  placeholder?: string;
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  noResultsText?: string;
};

export default function TableFilterField({
  label = 'Filter',
  type = 'select',
  value,
  options = [],
  onChange,
  placeholder = 'Select option',
  className,
  searchable = false,
  searchPlaceholder = 'Search options...',
  noResultsText = 'No options found',
}: TableFilterFieldProps) {
  const labelId = useId();

  if (type === 'date') {
    return (
      <Input
        type="date"
        label={label}
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => onChange(event.target.value)}
        inputSize="sm"
      />
    );
  }

  if (type === 'checkbox') {
    return (
      <Input
        type="checkbox"
        label={label}
        checked={Boolean(value)}
        onChange={(event) => onChange(event.target.checked)}
        className="shrink-0"
      />
    );
  }

  if (type === 'checkbox-group') {
    const selectedValues = Array.isArray(value) ? value : [];

    return (
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">{label}</legend>
        <div className="grid gap-2 rounded-md border border-stroke bg-panel p-3 sm:grid-cols-2">
          {options.map((option) => {
            const checked = selectedValues.includes(option.value);
            return (
              <div key={option.value} className="min-w-0">
                <Input
                  type="checkbox"
                  label={option.label}
                  checked={checked}
                  onChange={(event) => {
                    if (event.target.checked) {
                      onChange([...selectedValues, option.value]);
                      return;
                    }
                    onChange(selectedValues.filter((selected) => selected !== option.value));
                  }}
                  className="shrink-0"
                />
              </div>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (type === 'radio-group') {
    const selectedValue = typeof value === 'string' ? value : '';
    const groupName = `${labelId}-radio-group`;

    return (
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">{label}</legend>
        <div className="grid gap-2 rounded-md border border-stroke bg-panel p-3 sm:grid-cols-2">
          {options.map((option) => (
            <div key={option.value} className="min-w-0">
              <Input
                type="radio"
                name={groupName}
                value={option.value}
                label={option.label}
                checked={selectedValue === option.value}
                onChange={() => onChange(option.value)}
                className="shrink-0"
              />
            </div>
          ))}
        </div>
      </fieldset>
    );
  }

  return (
    <div className="space-y-1.5">
      <span id={labelId} className="text-sm font-medium text-foreground">
        {label}
      </span>
      <Dropdown
        value={Array.isArray(value) ? value : String(value)}
        multiple={type === 'multi-select'}
        size="sm"
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        noResultsText={noResultsText}
        ariaLabelledBy={labelId}
        onChange={(nextValue) => onChange(nextValue)}
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
