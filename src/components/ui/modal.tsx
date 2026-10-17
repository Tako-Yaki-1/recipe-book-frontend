import { useEffect, useId, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

// A side sheet: full screen on phones, a panel from the right edge on larger screens.
export function Modal({ open, onClose, title, children }: ModalProps) {
  const titleId = useId();

  // Let people close the sheet with the Escape key.
  useEffect(function listenForEscape() {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);

    function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return cleanup;
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/50" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-sheet flex h-full w-full flex-col bg-plate text-ink motion-reduce:animate-none sm:max-w-xl sm:border-l-2 sm:border-ink"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-ink/15 px-6 py-4">
          <h2 id={titleId} className="text-2xl font-bold tracking-tight">{title}</h2>
          <Button variant="tertiary" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
