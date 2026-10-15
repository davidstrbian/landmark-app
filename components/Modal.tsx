"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  className?: string; // colours of the panel
  closeButtonClassName?: string; // colours of the close button
  children: ReactNode;
};

// Native <dialog> opened with showModal(): the browser handles the focus trap,
// Esc to close, and returning focus to the element that opened it.
export function Modal({
  open,
  onClose,
  labelledBy,
  className,
  closeButtonClassName,
  children,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      // A click whose target is the <dialog> itself landed on the backdrop.
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className={`m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-3xl p-0 shadow-lift ${className ?? ""}`}
    >
      {open && (
        <div className="relative flex max-h-[calc(100dvh-2rem)] flex-col overflow-y-auto">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className={`absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full shadow-soft backdrop-blur transition focus-visible:outline-2 focus-visible:outline-offset-2 ${closeButtonClassName ?? ""}`}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          {children}
        </div>
      )}
    </dialog>
  );
}
