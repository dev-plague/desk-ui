import * as React from "react";

import { useDeskUILocale } from "../lib/i18n";
import { cn } from "../lib/utils";

type Position = { x: number; y: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

export interface DesktopProps extends React.ComponentProps<"div"> {}

/**
 * Lienzo de escritorio clásico. Es presentacional: coloca iconos y ventanas
 * dentro y deja que el consumidor decida qué está abierto o seleccionado.
 */
export const Desktop = React.forwardRef<HTMLDivElement, DesktopProps>(
  ({ className, ...props }, ref) => {
    const { messages } = useDeskUILocale();
    return (
      <div
        ref={ref}
        role="region"
        aria-label={props["aria-label"] ?? messages.desktop.label}
        data-slot="desktop"
        className={cn(
          "relative isolate min-h-64 overflow-hidden bg-desktop text-ink",
          className,
        )}
        {...props}
      />
    );
  },
);

Desktop.displayName = "Desktop";

export interface DesktopIconsProps extends React.ComponentProps<"div"> {}

/**
 * Capa de iconos. Los iconos estáticos se colocan en columna; los que tienen
 * `draggable` o `defaultPosition` se posicionan de forma absoluta.
 */
export const DesktopIcons = React.forwardRef<HTMLDivElement, DesktopIconsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="desktop-icons"
      className={cn(
        "pointer-events-none absolute inset-0 flex flex-col flex-wrap content-start items-start gap-1 p-2",
        className,
      )}
      {...props}
    />
  ),
);

DesktopIcons.displayName = "Desktop.Icons";

export interface DesktopIconProps
  extends Omit<React.ComponentProps<"button">, "onSelect"> {
  label: string;
  icon: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  onOpen?: () => void;
  draggable?: boolean;
  defaultPosition?: Position;
  position?: Position;
  onPositionChange?: (position: Position) => void;
}

const DRAG_THRESHOLD = 4;
const KEYBOARD_STEP = 8;

/**
 * Icono de escritorio seleccionable. Un doble clic o Enter abre el elemento.
 * Con `draggable` o `defaultPosition` se puede arrastrar con el puntero y
 * mover con Ctrl+flechas.
 */
export const DesktopIcon = React.forwardRef<HTMLButtonElement, DesktopIconProps>(
  (
    {
      className,
      label,
      icon,
      selected = false,
      onSelect,
      onOpen,
      draggable = false,
      defaultPosition,
      position: controlledPosition,
      onPositionChange,
      onClick,
      onDoubleClick,
      onKeyDown,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      style,
      ...props
    },
    ref,
  ) => {
    const isPositioned = draggable || defaultPosition !== undefined;
    const elementRef = React.useRef<HTMLButtonElement>(null);

    const setRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        elementRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
            node;
        }
      },
      [ref],
    );

    const [internalPosition, setInternalPosition] = React.useState<Position>(
      () => defaultPosition ?? { x: 8, y: 8 },
    );
    const position = controlledPosition ?? internalPosition;
    const drag = React.useRef<{
      startX: number;
      startY: number;
      originX: number;
      originY: number;
      moved: boolean;
    } | null>(null);
    const suppressClick = React.useRef(false);

    function updatePosition(next: Position, bounds: DOMRect) {
      const width = elementRef.current?.offsetWidth || 72;
      const height = elementRef.current?.offsetHeight || 64;
      const clamped = {
        x: clamp(next.x, 0, bounds.width - width),
        y: clamp(next.y, 0, bounds.height - height),
      };

      if (controlledPosition === undefined) {
        setInternalPosition(clamped);
      }
      onPositionChange?.(clamped);
    }

    function desktopBounds() {
      const element = elementRef.current;
      const desktop = element?.closest<HTMLElement>('[data-slot="desktop"]');
      return desktop?.getBoundingClientRect() ?? element?.getBoundingClientRect();
    }

    function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
      onPointerDown?.(event);
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

      if (!isPositioned) {
        return;
      }

      drag.current = {
        startX: event.clientX,
        startY: event.clientY,
        originX: position.x,
        originY: position.y,
        moved: false,
      };
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }

    function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
      onPointerMove?.(event);
      const current = drag.current;
      const bounds = desktopBounds();
      if (!current || !bounds || event.defaultPrevented) {
        return;
      }

      const dx = event.clientX - current.startX;
      const dy = event.clientY - current.startY;
      if (!current.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) {
        return;
      }

      current.moved = true;
      updatePosition(
        { x: current.originX + dx, y: current.originY + dy },
        bounds,
      );
    }

    function handlePointerUp(event: React.PointerEvent<HTMLButtonElement>) {
      onPointerUp?.(event);
      if (drag.current?.moved) {
        suppressClick.current = true;
        window.setTimeout(() => {
          suppressClick.current = false;
        }, 0);
      }
      drag.current = null;
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
      onKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        onOpen?.();
        return;
      }

      if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        onSelect?.();
        return;
      }

      if (
        isPositioned &&
        event.ctrlKey &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        const bounds = desktopBounds();
        if (!bounds) {
          return;
        }

        event.preventDefault();
        const delta = { x: 0, y: 0 };
        if (event.key === "ArrowUp") delta.y = -KEYBOARD_STEP;
        if (event.key === "ArrowDown") delta.y = KEYBOARD_STEP;
        if (event.key === "ArrowLeft") delta.x = -KEYBOARD_STEP;
        if (event.key === "ArrowRight") delta.x = KEYBOARD_STEP;
        updatePosition(
          { x: position.x + delta.x, y: position.y + delta.y },
          bounds,
        );
      }
    }

    return (
      <button
        ref={setRef}
        type="button"
        data-slot="desktop-icon"
        data-selected={selected || undefined}
        aria-current={selected ? "true" : undefined}
        aria-label={label}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) {
            return;
          }
          if (suppressClick.current) {
            event.preventDefault();
            return;
          }
          onSelect?.();
        }}
        onDoubleClick={(event) => {
          onDoubleClick?.(event);
          if (!event.defaultPrevented) {
            onOpen?.();
          }
        }}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={
          isPositioned
            ? { position: "absolute", left: position.x, top: position.y, ...style }
            : style
        }
        className={cn(
          "pointer-events-auto flex w-[72px] select-none flex-col items-center gap-1",
          "border-0 bg-transparent p-0 text-center text-[11px] leading-[13px] text-ink-inverse",
          "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
          "[text-shadow:1px_1px_0_#000]",
          "[&>span]:max-w-full [&>span]:px-1 [&>span]:break-words",
          selected &&
            "[&>span]:bg-accent [&>span]:text-ink-inverse [&>span]:[text-shadow:none]",
          draggable && "cursor-default touch-none",
          className,
        )}
        {...props}
      >
        <span aria-hidden="true" className="grid h-8 w-8 place-items-center">
          {icon}
        </span>
        <span>{label}</span>
      </button>
    );
  },
);

DesktopIcon.displayName = "Desktop.Icon";
