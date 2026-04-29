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
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={() => {
        if (!disableClose) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className={cn(
          "relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10 animate-fade-scale",
          panelClass
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            {showCloseButton && (
              <button onClick={onClose}>✕</button>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;