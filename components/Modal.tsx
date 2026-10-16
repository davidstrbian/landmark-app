"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  className?: string; // colours of the panel
  closeButtonClassName?: string; // colours of the close button
  children: ReactNode;
};

const MARGIN = 32; // space kept around the dialog, in px (matches 2rem)

// The tallest dialog's full height on wider screens (a fell marked
// conquered, with its 3:1 picture). Every dialog is scaled as if it were
// this tall, so fell, wilderness and park dialogs always share one width and
// text size; a dialog that is taller still gets scaled further to fit.
const DESIGN_HEIGHT = 930;

// Native <dialog> opened with showModal(): the browser handles the focus trap,
// Esc to close, and returning focus to the element that opened it.
//
// On wider screens dialogs are scaled down as a whole (CSS zoom) when the
// window is shorter than DESIGN_HEIGHT, so their layout and pictures keep
// their proportions, nothing needs scrolling, and all of them stay the same
// size. Phones use the dialogs' own compact layout instead.
export function Modal({
  open,
  onClose,
  labelledBy,
  className,
  closeButtonClassName,
  children,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useLayoutEffect(() => {
    const dialog = ref.current;
    const scroller = scrollRef.current;
    const content = contentRef.current;
    if (!open || !dialog || !scroller || !content) return;
    const wide = window.matchMedia("(min-width: 640px)");

    const fit = () => {
      // Measure at full size, then zoom out just enough to fit the window.
      dialog.style.zoom = "";
      scroller.style.maxHeight = "";
      scroller.style.overflowY = "";
      dialog.style.maxHeight = "";
      if (!wide.matches) return;
      const natural = Math.max(content.offsetHeight, DESIGN_HEIGHT);
      // Rounded down, so rounding never leaves the panel a pixel too tall.
      const zoom =
        Math.floor(((window.innerHeight - MARGIN) / natural) * 1000) / 1000;
      if (zoom >= 1) return;
      dialog.style.zoom = String(zoom);
      // Heights inside a zoomed element are scaled too, so the window-height
      // caps are divided by the zoom to keep their on-screen size.
      const cap = `calc((100dvh - ${MARGIN}px) / ${zoom})`;
      dialog.style.maxHeight = cap;
      scroller.style.maxHeight = cap;
      // The scaled panel fits by construction; no stray scrollbar.
      scroller.style.overflowY = "hidden";
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(content);
    window.addEventListener("resize", fit);
    wide.addEventListener("change", fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
      wide.removeEventListener("change", fit);
    };
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
      className={`m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[40rem] overflow-hidden rounded-3xl p-0 shadow-lift ${className ?? ""}`}
    >
      {open && (
        <div
          ref={scrollRef}
          className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto"
        >
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className={`absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full shadow-soft backdrop-blur transition focus-visible:outline-2 focus-visible:outline-offset-2 ${closeButtonClassName ?? ""}`}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          <div ref={contentRef} className="flex flex-col">
            {children}
          </div>
        </div>
      )}
    </dialog>
  );
}
