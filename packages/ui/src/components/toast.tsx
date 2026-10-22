import * as React from "react";

import { useDeskUILocale } from "../lib/i18n";
import { cn } from "../lib/utils";

export interface ToastOptions {
  title: string;
  description?: string;
  /** Milisegundos antes de cerrarse. 0 lo mantiene abierto. */
  duration?: number;
}

interface ToastRecord extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function CloseGlyph() {
  return (
    <svg
      viewBox="0 0 9 9"
      width={9}
      height={9}
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      fill="currentColor"
    >
      <path d="M1 1h2v1H1zM2 2h2v1H2zM3 3h2v1H3zM4 4h2v1H4zM5 5h2v1H5zM6 6h2v1H6zM6 1h2v1H6zM5 2h2v1H5zM4 3h2v1H4zM3 4h2v1H3zM2 5h2v1H2zM1 6h2v1H1z" />
    </svg>
  );
}

export interface ToastProps extends Omit<React.ComponentProps<"div">, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
}

/** Notificación individual, con el aspecto de un pequeño panel de bandeja. */
export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, title, description, onClose, ...props }, ref) => {
    const { messages } = useDeskUILocale();
    return (
      <div
        ref={ref}
        role="status"
        data-slot="toast"
        className={cn(
          "bevel-window w-full bg-surface p-2 text-ink",
          "pointer-events-auto",
          className,
        )}
        {...props}
      >
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-bold leading-[15px]">{title}</p>
            {description ? (
              <p className="mt-1 text-[11px] leading-[15px]">{description}</p>
            ) : null}
          </div>
          {onClose ? (
            <button
              type="button"
              aria-label={messages.toast.closeLabel}
              onClick={onClose}
              className={cn(
                "relative grid h-[14px] w-[16px] shrink-0 place-items-center max-sm:h-6 max-sm:w-6",
                "bg-surface text-ink bevel-raised active:bevel-sunken",
                "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
              )}
            >
              <CloseGlyph />
            </button>
          ) : null}
        </div>
      </div>
    );
  },
);

Toast.displayName = "Toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { messages } = useDeskUILocale();
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const timers = React.useRef(new Map<string, number>());

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = React.useCallback(
    (options: ToastOptions) => {
      const id = createId();
      setToasts((current) => [...current, { ...options, id }]);

      const duration = options.duration ?? 5000;
      if (duration > 0) {
        const timer = window.setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }

      return id;
    },
    [dismiss],
  );

  React.useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      for (const timer of activeTimers.values()) {
        window.clearTimeout(timer);
      }
      activeTimers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        role="region"
        aria-label={messages.toast.regionLabel}
        aria-live="polite"
        aria-relevant="additions"
        className="pointer-events-none fixed bottom-10 right-2 z-[60] flex w-[min(320px,calc(100vw-1rem))] flex-col gap-2"
      >
        {toasts.map((item) => (
          <Toast
            key={item.id}
            title={item.title}
            description={item.description}
            onClose={() => dismiss(item.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast debe usarse dentro de ToastProvider.");
  }

  return context;
}
