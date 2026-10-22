import * as React from "react";

import { cn } from "../lib/utils";
import { Window } from "./window";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  showClose?: boolean;
  /** Cierra al hacer clic en el fondo. Por defecto es false, como en la interfaz clásica. */
  dismissOnBackdrop?: boolean;
}

/**
 * Diálogo modal basado en `<dialog>` nativo: foco atrapado, Escape, backdrop
 * y restauración del foco sin dependencias externas. El marco visual es la
 * misma `Window` de la librería.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  icon,
  children,
  footer,
  className,
  showClose = true,
  dismissOnBackdrop = false,
}: DialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    function handleClose() {
      onOpenChange(false);
    }

    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, [onOpenChange]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    function focusableElements(dialog: HTMLDialogElement) {
      return Array.from(
        dialog.querySelectorAll<HTMLElement>(
          [
            "a[href]",
            "button:not([disabled])",
            "input:not([disabled])",
            "select:not([disabled])",
            "textarea:not([disabled])",
            '[tabindex]:not([tabindex="-1"])',
          ].join(","),
        ),
      ).filter(
        (element) =>
          element.getAttribute("aria-hidden") !== "true" &&
          element.tabIndex >= 0,
      );
    }

    function handleTab(event: KeyboardEvent) {
      if (event.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;
      if (!dialog) {
        return;
      }

      const focusables = focusableElements(dialog);
      if (focusables.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) {
        return;
      }
      const active = document.activeElement;

      if (!dialog.contains(active)) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleTab, true);
    return () => document.removeEventListener("keydown", handleTab, true);
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      data-slot="dialog"
      className={cn(
        "m-auto w-[calc(100vw-1rem)] max-w-lg border-0 bg-transparent p-0 text-ink",
        "backdrop:bg-black/30",
        className,
      )}
      onClick={(event) => {
        if (dismissOnBackdrop && event.target === dialogRef.current) {
          onOpenChange(false);
        }
      }}
    >
      <Window className="flex max-h-[calc(100dvh-2rem)] w-full flex-col">
        <Window.TitleBar
          className="shrink-0"
          title={<span id={titleId}>{title}</span>}
          icon={icon}
          showMinimize={false}
          showMaximize={false}
          showClose={showClose}
          onClose={() => onOpenChange(false)}
        />
        <Window.Body className="w95-scrollbar min-h-0 flex-1 overflow-y-auto">
          {children}
        </Window.Body>
        {footer ? (
          <div className="mx-2 mb-2 flex shrink-0 justify-end gap-2">
            {footer}
          </div>
        ) : null}
      </Window>
    </dialog>
  );
}

Dialog.displayName = "Dialog";
