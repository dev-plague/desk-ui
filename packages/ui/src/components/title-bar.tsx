import * as React from "react";

import { useDeskUILocale } from "../lib/i18n";
import { cn } from "../lib/utils";

export interface TitleBarProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  /** La barra activa usa azul; la inactiva, gris. */
  active?: boolean;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  showControls?: boolean;
  showMinimize?: boolean;
  showMaximize?: boolean;
  showClose?: boolean;
  /** Swaps the maximise glyph for the restore glyph. */
  maximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

type GlyphKind = "minimize" | "maximize" | "restore" | "close";

function ControlGlyph({ kind }: { kind: GlyphKind }) {
  const common = {
    width: 9,
    height: 9,
    viewBox: "0 0 9 9",
    "aria-hidden": true,
    focusable: false,
    shapeRendering: "crispEdges" as const,
    fill: "currentColor",
  };

  switch (kind) {
    case "minimize":
      return (
        <svg {...common}>
          <path d="M2 6h5v1H2z" />
        </svg>
      );
    case "maximize":
      return (
        <svg {...common}>
          <path d="M1 1h7v2H1zM1 1h1v7H1zM7 2h1v6H7zM1 7h7v1H1z" />
        </svg>
      );
    case "restore":
      return (
        <svg {...common}>
          <path d="M3 1h5v1H3zM3 1h1v5H3zM7 2h1v4H7zM3 5h5v1H3z" />
          <path d="M1 3h5v1H1zM1 3h1v5H1zM5 4h1v4H5zM1 7h5v1H1z" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M1 1h2v1H1zM2 2h2v1H2zM3 3h2v1H3zM4 4h2v1H4zM5 5h2v1H5zM6 6h2v1H6zM6 1h2v1H6zM5 2h2v1H5zM4 3h2v1H4zM3 4h2v1H3zM2 5h2v1H2zM1 6h2v1H1z" />
        </svg>
      );
  }
}

function TitleBarControl({
  label,
  kind,
  onClick,
}: {
  label: string;
  kind: GlyphKind;
  onClick?: () => void;
}) {
  const className = cn(
    "relative grid h-[14px] w-[16px] shrink-0 place-items-center",
    "rounded-none bg-surface text-ink bevel-raised",
    "cursor-default active:bevel-sunken active:[&>svg]:translate-y-[1px]",
    "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
    "max-sm:h-6 max-sm:w-6",
  );

  if (!onClick) {
    return (
      <span aria-hidden="true" className={className}>
        <ControlGlyph kind={kind} />
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={className}
    >
      <ControlGlyph kind={kind} />
    </button>
  );
}

/**
 * Barra de título clásica, reutilizable fuera de `Window`. Los controles sin
 * manejador se renderizan inertes para no prometer interacción inexistente.
 */
export const TitleBar = React.forwardRef<HTMLDivElement, TitleBarProps>(
  (
    {
      className,
      active = true,
      title,
      icon,
      showControls = true,
      showMinimize = true,
      showMaximize = true,
      showClose = true,
      maximized = false,
      onMinimize,
      onMaximize,
      onClose,
      children,
      ...props
    },
    ref,
  ) => {
    const { messages } = useDeskUILocale();
    return (
      <div
        ref={ref}
        data-slot="title-bar"
        data-active={active}
        className={cn(
          "flex select-none items-center gap-[2px] px-[2px] py-[1px]",
          "h-[18px] max-sm:h-7",
          active ? "titlebar-surface" : "titlebar-surface-inactive",
          className,
        )}
        {...props}
      >
        {icon ? (
          <span className="ml-[1px] flex h-4 w-4 shrink-0 items-center justify-center">
            {icon}
          </span>
        ) : null}

        <div className="min-w-0 flex-1 truncate pl-[1px] text-[11px] font-bold leading-[13px] tracking-[0.2px]">
          {children ?? title}
        </div>

        {showControls ? (
          <div className="flex shrink-0 items-center gap-[2px]">
            {showMinimize ? (
              <TitleBarControl
                label={messages.common.minimize}
                kind="minimize"
                onClick={onMinimize}
              />
            ) : null}
            {showMaximize ? (
              <TitleBarControl
                label={maximized ? messages.common.restore : messages.common.maximize}
                kind={maximized ? "restore" : "maximize"}
                onClick={onMaximize}
              />
            ) : null}
            {showClose ? (
              <TitleBarControl
                label={messages.common.close}
                kind="close"
                onClick={onClose}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);

TitleBar.displayName = "TitleBar";
