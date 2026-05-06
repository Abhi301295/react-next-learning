'use client';

import Modal from '@/components/shared/modal/Modal';
import { Button } from '@/components/ui/Button';
import { ReactNode, useState } from 'react';

type TableFilterProps = {
  title?: string;
  triggerLabel?: string;
  activeCount?: number;
  onApply: () => void;
  onClear?: () => void;
  onOpen?: () => void;
  children: ReactNode;
};

export default function TableFilter({
  title = 'Filter',
  triggerLabel = 'Filters',
  activeCount = 0,
  onApply,
  onClear,
  onOpen,
  children,
}: TableFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openPanel = () => {
    onOpen?.();
    setIsOpen(true);
  };

  return (
    <>
      <div className="relative inline-flex">
        <Button
          type="button"
          variant="outline"
          iconOnly
          icon="⚙"
          aria-label={triggerLabel}
          onClick={openPanel}
        />
        {activeCount > 0 && (
          <span className="absolute -right-2 -top-2 rounded-full bg-blue-600 px-1.5 py-0.5 text-xs text-white">
            {activeCount}
          </span>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title} panelClass="max-w-lg">
        <div className="space-y-4">
          {children}
          <div className="flex justify-end gap-2">
            {onClear && (
              <Button type="button" variant="outline" onClick={onClear}>
                Clear
              </Button>
            )}
            <Button
              type="button"
              onClick={() => {
                onApply();
                setIsOpen(false);
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
