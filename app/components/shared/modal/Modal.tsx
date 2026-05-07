'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  disableClose?: boolean;
  panelClass?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  disableClose = false,
  panelClass
}: ModalProps) => {

  useEffect(() => {
    if (!isOpen || disableClose) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, disableClose, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => {
        if (!disableClose) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className={cn(
          "relative z-10 w-full max-w-md max-h-[85vh] overflow-y-auto rounded-lg border border-stroke bg-panel p-6 text-foreground shadow-lg animate-fade-scale",
          panelClass
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between border-b border-stroke pb-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded px-2 py-1 text-subtle hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;