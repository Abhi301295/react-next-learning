'use client';

import { cn } from '@/lib/utils';
import { useEffect, useId, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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

  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, disableClose, onClose]);

  useEffect(() => {
    if (!isOpen) {
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const focusFirst = () => {
      const root = panelRef.current;
      if (!root) return;
      const first = root.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      first?.focus();
    };

    requestAnimationFrame(focusFirst);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || disableClose) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const root = panelRef.current;
      if (!root) return;

      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => !el.hasAttribute('disabled'));

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  const labelledBy = title ? titleId : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onClick={() => {
        if (!disableClose) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50" aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={title ? undefined : 'Dialog'}
        className={cn(
          'relative z-10 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg border border-stroke bg-panel p-6 text-foreground shadow-lg animate-fade-scale',
          panelClass
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between border-b border-stroke pb-3">
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>
            {showCloseButton && (
              <button
                type="button"
                aria-label="Close dialog"
                onClick={onClose}
                className="rounded px-2 py-1 text-subtle hover:bg-background"
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
