import * as React from "react";

import { Window } from "./window";
import { cn } from "../lib/utils";

export interface WindowManagerPosition {
  x: number;
  y: number;
}

export interface WindowManagerSize {
  width: number;
  height: number;
}

export interface WindowManagerWindow {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  /** Posición inicial en píxeles dentro del manager. */
  defaultPosition?: Partial<WindowManagerPosition>;
  /** Tamaño inicial; se recorta al tamaño del manager. */
  defaultSize?: Partial<WindowManagerSize>;
  /** Tamaño mínimo al redimensionar. */
  minSize?: Partial<WindowManagerSize>;
  defaultOpen?: boolean;
  defaultMinimized?: boolean;
  bodyClassName?: string;
}

export interface WindowManagerSnapshot {
  id: string;
  title: string;
  icon?: React.ReactNode;
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  focused: boolean;
}

export interface WindowManagerHandle {
  focus: (id: string) => void;
  minimize: (id: string) => void;
  restore: (id: string) => void;
  close: (id: string) => void;
  open: (id: string) => void;
  toggleMaximize: (id: string) => void;
  getSnapshot: () => WindowManagerSnapshot[];
}

export interface WindowManagerProps extends React.ComponentProps<"div"> {
  windows: WindowManagerWindow[];
  /** Se llama cuando cambia foco, minimizado, maximizado, abierto o cerrado. */
  onStateChange?: (snapshot: WindowManagerSnapshot[]) => void;
  /** Se llama al cerrar una ventana desde su barra de título. */
  onWindowClose?: (id: string) => void;
}

type Direction = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

interface WindowState {
  position: WindowManagerPosition;
  size: WindowManagerSize;
  minimized: boolean;
  maximized: boolean;
  open: boolean;
  restorePosition?: WindowManagerPosition;
  restoreSize?: WindowManagerSize;
}

interface ManagerState {
  windows: Record<string, WindowState>;
  order: string[];
}

interface DragState {
  id: string;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  bounds: WindowManagerSize;
}

interface ResizeState {
  id: string;
  direction: Direction;
  startX: number;
  startY: number;
  origin: WindowManagerPosition & WindowManagerSize;
  bounds: WindowManagerSize;
}

const CASCADE_STEP = 24;
const DEFAULT_WIDTH = 420;
const DEFAULT_HEIGHT = 280;
const DEFAULT_MIN_WIDTH = 180;
const DEFAULT_MIN_HEIGHT = 120;
const KEYBOARD_STEP = 8;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function createWindowState(
  item: WindowManagerWindow,
  index: number,
): WindowState {
  const offset = (index % 6) * CASCADE_STEP;

  return {
    position: {
      x: item.defaultPosition?.x ?? 16 + offset,
      y: item.defaultPosition?.y ?? 16 + offset,
    },
    size: {
      width: item.defaultSize?.width ?? DEFAULT_WIDTH,
      height: item.defaultSize?.height ?? DEFAULT_HEIGHT,
    },
    minimized: item.defaultMinimized ?? false,
    maximized: false,
    open: item.defaultOpen ?? true,
  };
}

function createInitialState(windows: WindowManagerWindow[]): ManagerState {
  const state: ManagerState = { windows: {}, order: [] };

  windows.forEach((item, index) => {
    state.windows[item.id] = createWindowState(item, index);
    state.order.push(item.id);
  });

  return state;
}

function topVisibleId(state: ManagerState) {
  for (let index = state.order.length - 1; index >= 0; index -= 1) {
    const id = state.order[index];
    const windowState = id ? state.windows[id] : undefined;
    if (windowState?.open && !windowState.minimized) {
      return id ?? null;
    }
  }

  return null;
}

function fitToBounds(
  windowState: WindowState,
  bounds: WindowManagerSize,
): WindowState {
  if (windowState.maximized || bounds.width <= 0 || bounds.height <= 0) {
    return windowState;
  }

  const width = clamp(windowState.size.width, 0, bounds.width);
  const height = clamp(windowState.size.height, 0, bounds.height);
  const x = clamp(windowState.position.x, 0, bounds.width - width);
  const y = clamp(windowState.position.y, 0, bounds.height - height);

  if (
    width === windowState.size.width &&
    height === windowState.size.height &&
    x === windowState.position.x &&
    y === windowState.position.y
  ) {
    return windowState;
  }

  return {
    ...windowState,
    position: { x, y },
    size: { width, height },
  };
}

function resizeFromPointer(
  state: WindowState,
  direction: Direction,
  dx: number,
  dy: number,
  bounds: WindowManagerSize,
  minSize: WindowManagerSize,
): WindowState {
  const left = state.position.x;
  const top = state.position.y;
  const right = left + state.size.width;
  const bottom = top + state.size.height;
  const maxWidth = Math.max(0, bounds.width);
  const maxHeight = Math.max(0, bounds.height);
  const minWidth = Math.min(minSize.width, maxWidth);
  const minHeight = Math.min(minSize.height, maxHeight);

  let nextLeft = left;
  let nextTop = top;
  let nextRight = right;
  let nextBottom = bottom;

  if (direction.includes("e")) {
    nextRight = clamp(right + dx, nextLeft + minWidth, maxWidth);
  }
  if (direction.includes("w")) {
    nextLeft = clamp(left + dx, 0, nextRight - minWidth);
  }
  if (direction.includes("s")) {
    nextBottom = clamp(bottom + dy, nextTop + minHeight, maxHeight);
  }
  if (direction.includes("n")) {
    nextTop = clamp(top + dy, 0, nextBottom - minHeight);
  }

  return {
    ...state,
    position: { x: nextLeft, y: nextTop },
    size: {
      width: Math.max(0, nextRight - nextLeft),
      height: Math.max(0, nextBottom - nextTop),
    },
  };
}

/**
 * Gestor de ventanas presentacional con estado interno: arrastre, resize,
 * foco, z-index, minimizar, maximizar/restaurar y cerrar. Expone un ref
 * imperativo para que una taskbar u otro control maneje las ventanas.
 */
export const WindowManager = React.forwardRef<
  WindowManagerHandle,
  WindowManagerProps
>(
  (
    {
      windows,
      onStateChange,
      onWindowClose,
      className,
      ...props
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const windowRefs = React.useRef(new Map<string, HTMLElement>());
    const boundsRef = React.useRef<WindowManagerSize>({ width: 0, height: 0 });
    const itemsRef = React.useRef(new Map<string, WindowManagerWindow>());
    const dragRef = React.useRef<DragState | null>(null);
    const resizeRef = React.useRef<ResizeState | null>(null);
    const lastSnapshot = React.useRef("");
    const snapshotRef = React.useRef<WindowManagerSnapshot[]>([]);

    itemsRef.current = new Map(windows.map((item) => [item.id, item]));

    const [state, setState] = React.useState<ManagerState>(() =>
      createInitialState(windows),
    );

    const focusedId = topVisibleId(state);

    const ids = windows.map((item) => item.id).join("|");

    React.useEffect(() => {
      setState((previous) => {
        const nextWindows = { ...previous.windows };
        const nextOrder = previous.order.filter((id) =>
          windows.some((item) => item.id === id),
        );
        let changed = nextOrder.length !== previous.order.length;

        windows.forEach((item, index) => {
          if (!nextWindows[item.id]) {
            nextWindows[item.id] = createWindowState(item, index);
            changed = true;
          }
          if (!nextOrder.includes(item.id)) {
            nextOrder.push(item.id);
            changed = true;
          }
        });

        return changed
          ? { windows: nextWindows, order: nextOrder }
          : previous;
      });
      // `ids` resume la identidad y el orden; los defaults solo se aplican al
      // crear una ventana nueva.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ids]);

    React.useEffect(() => {
      const element = containerRef.current;
      if (!element) {
        return;
      }
      const container = element;

      function fit() {
        const rect = container.getBoundingClientRect();
        boundsRef.current = { width: rect.width, height: rect.height };
        setState((previous) => {
          let changed = false;
          const nextWindows: Record<string, WindowState> = {};

          for (const id of previous.order) {
            const windowState = previous.windows[id];
            if (!windowState) {
              continue;
            }
            const fitted = fitToBounds(windowState, boundsRef.current);
            nextWindows[id] = fitted;
            changed ||= fitted !== windowState;
          }

          return changed ? { ...previous, windows: nextWindows } : previous;
        });
      }

      fit();
      const observer =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(fit);
      observer?.observe(element);
      window.addEventListener("resize", fit);

      return () => {
        observer?.disconnect();
        window.removeEventListener("resize", fit);
      };    }, []);

    React.useEffect(() => {
      function onPointerMove(event: PointerEvent) {
        const drag = dragRef.current;
        if (drag) {
          setState((previous) => {
            const windowState = previous.windows[drag.id];
            if (!windowState || windowState.maximized) {
              return previous;
            }

            const x = clamp(
              drag.originX + event.clientX - drag.startX,
              0,
              drag.bounds.width - windowState.size.width,
            );
            const y = clamp(
              drag.originY + event.clientY - drag.startY,
              0,
              drag.bounds.height - windowState.size.height,
            );

            return {
              ...previous,
              windows: {
                ...previous.windows,
                [drag.id]: { ...windowState, position: { x, y } },
              },
            };
          });
          return;
        }

        const resize = resizeRef.current;
        if (!resize) {
          return;
        }

        setState((previous) => {
          const windowState = previous.windows[resize.id];
          if (!windowState || windowState.maximized) {
            return previous;
          }

          const item = itemsRef.current.get(resize.id);
          const minSize = {
            width: item?.minSize?.width ?? DEFAULT_MIN_WIDTH,
            height: item?.minSize?.height ?? DEFAULT_MIN_HEIGHT,
          };
          const next = resizeFromPointer(
            windowState,
            resize.direction,
            event.clientX - resize.startX,
            event.clientY - resize.startY,
            resize.bounds,
            minSize,
          );

          return {
            ...previous,
            windows: { ...previous.windows, [resize.id]: next },
          };
        });
      }

      function onPointerUp() {
        dragRef.current = null;
        resizeRef.current = null;
      }

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);

      return () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
      };
    }, []);

    const raise = React.useCallback((id: string) => {
      setState((previous) => {
        const windowState = previous.windows[id];
        if (!windowState?.open) {
          return previous;
        }
        if (previous.order[previous.order.length - 1] === id) {
          return previous;
        }
        return {
          ...previous,
          order: [...previous.order.filter((item) => item !== id), id],
        };
      });
    }, []);

    const focus = React.useCallback(
      (id: string) => {
        raise(id);
        setState((previous) => {
          const windowState = previous.windows[id];
          if (!windowState?.open || !windowState.minimized) {
            return previous;
          }
          return {
            ...previous,
            windows: {
              ...previous.windows,
              [id]: { ...windowState, minimized: false },
            },
          };
        });
        window.setTimeout(() => {
          windowRefs.current.get(id)?.focus({ preventScroll: true });
        }, 0);
      },
      [raise],
    );

    const minimize = React.useCallback((id: string) => {
      setState((previous) => {
        const windowState = previous.windows[id];
        if (!windowState?.open) {
          return previous;
        }
        return {
          ...previous,
          windows: {
            ...previous.windows,
            [id]: { ...windowState, minimized: true },
          },
        };
      });
    }, []);

    const restore = React.useCallback(
      (id: string) => {
        setState((previous) => {
          const windowState = previous.windows[id];
          if (!windowState) {
            return previous;
          }
          return {
            ...previous,
            windows: {
              ...previous.windows,
              [id]: { ...windowState, open: true, minimized: false },
            },
            order: [...previous.order.filter((item) => item !== id), id],
          };
        });
        window.setTimeout(() => {
          windowRefs.current.get(id)?.focus({ preventScroll: true });
        }, 0);
      },
      [],
    );

    const close = React.useCallback(
      (id: string) => {
        setState((previous) => {
          const windowState = previous.windows[id];
          if (!windowState?.open) {
            return previous;
          }
          return {
            ...previous,
            windows: {
              ...previous.windows,
              [id]: {
                ...windowState,
                open: false,
                minimized: false,
                maximized: false,
              },
            },
          };
        });
        onWindowClose?.(id);
      },
      [onWindowClose],
    );

    const open = React.useCallback((id: string) => restore(id), [restore]);

    const toggleMaximize = React.useCallback((id: string) => {
      setState((previous) => {
        const windowState = previous.windows[id];
        if (!windowState?.open) {
          return previous;
        }

        if (windowState.maximized) {
          return {
            ...previous,
            windows: {
              ...previous.windows,
              [id]: {
                ...windowState,
                maximized: false,
                position:
                  windowState.restorePosition ?? windowState.position,
                size: windowState.restoreSize ?? windowState.size,
              },
            },
          };
        }

        return {
          ...previous,
          windows: {
            ...previous.windows,
            [id]: {
              ...windowState,
              minimized: false,
              maximized: true,
              restorePosition: windowState.position,
              restoreSize: windowState.size,
            },
          },
        };
      });
    }, []);

    const snapshot = React.useMemo<WindowManagerSnapshot[]>(() => {
      const result: WindowManagerSnapshot[] = [];

      windows.forEach((item) => {
        const windowState = state.windows[item.id];
        if (!windowState) {
          return;
        }

        result.push({
          id: item.id,
          title: item.title,
          icon: item.icon,
          open: windowState.open,
          minimized: windowState.minimized,
          maximized: windowState.maximized,
          focused: focusedId === item.id,
        });
      });

      return result;
    }, [windows, state.windows, focusedId]);

    snapshotRef.current = snapshot;

    const signature = snapshot
      .map(
        (item) =>
          `${item.id}:${item.open ? 1 : 0}${item.minimized ? 1 : 0}${
            item.maximized ? 1 : 0
          }${item.focused ? 1 : 0}`,
      )
      .join("|");

    React.useEffect(() => {
      if (lastSnapshot.current === signature) {
        return;
      }
      lastSnapshot.current = signature;
      onStateChange?.(snapshotRef.current);
    }, [signature, onStateChange]);

    React.useImperativeHandle(
      ref,
      () => ({
        focus,
        minimize,
        restore,
        close,
        open,
        toggleMaximize,
        getSnapshot: () => snapshotRef.current,
      }),
      [focus, minimize, restore, close, open, toggleMaximize],
    );

    function beginDrag(
      event: React.PointerEvent<HTMLDivElement>,
      id: string,
    ) {
      if (event.button !== 0) {
        return;
      }
      const target = event.target as HTMLElement;
      if (target.closest("button, a, input, select, textarea")) {
        return;
      }

      const windowState = state.windows[id];
      if (!windowState || windowState.maximized) {
        return;
      }

      event.preventDefault();
      const bounds = boundsRef.current;
      if (bounds.width <= 0 || bounds.height <= 0) {
        return;
      }

      dragRef.current = {
        id,
        startX: event.clientX,
        startY: event.clientY,
        originX: windowState.position.x,
        originY: windowState.position.y,
        bounds,
      };
      event.currentTarget.setPointerCapture?.(event.pointerId);
      raise(id);
    }

    function beginResize(
      event: React.PointerEvent<HTMLDivElement>,
      id: string,
      direction: Direction,
    ) {
      if (event.button !== 0) {
        return;
      }

      const windowState = state.windows[id];
      if (!windowState || windowState.maximized) {
        return;
      }

      const bounds = boundsRef.current;
      if (bounds.width <= 0 || bounds.height <= 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      resizeRef.current = {
        id,
        direction,
        startX: event.clientX,
        startY: event.clientY,
        origin: {
          x: windowState.position.x,
          y: windowState.position.y,
          width: windowState.size.width,
          height: windowState.size.height,
        },
        bounds,
      };
      event.currentTarget.setPointerCapture?.(event.pointerId);
      raise(id);
    }

    function handleTitleKeyDown(
      event: React.KeyboardEvent<HTMLDivElement>,
      id: string,
    ) {
      if ((event.target as HTMLElement).closest("button")) {
        return;
      }

      const windowState = state.windows[id];
      if (!windowState || !windowState.open || windowState.maximized) {
        return;
      }

      const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (!keys.includes(event.key)) {
        return;
      }

      const bounds = boundsRef.current;
      if (bounds.width <= 0 || bounds.height <= 0) {
        return;
      }

      event.preventDefault();
      const item = itemsRef.current.get(id);
      const minSize = {
        width: item?.minSize?.width ?? DEFAULT_MIN_WIDTH,
        height: item?.minSize?.height ?? DEFAULT_MIN_HEIGHT,
      };

      setState((previous) => {
        const current = previous.windows[id];
        if (!current) {
          return previous;
        }

        if (event.shiftKey) {
          const next = { ...current };
          if (event.key === "ArrowRight") {
            next.size = {
              ...next.size,
              width: clamp(
                next.size.width + KEYBOARD_STEP,
                minSize.width,
                bounds.width - next.position.x,
              ),
            };
          }
          if (event.key === "ArrowLeft") {
            next.size = {
              ...next.size,
              width: clamp(
                next.size.width - KEYBOARD_STEP,
                minSize.width,
                bounds.width - next.position.x,
              ),
            };
          }
          if (event.key === "ArrowDown") {
            next.size = {
              ...next.size,
              height: clamp(
                next.size.height + KEYBOARD_STEP,
                minSize.height,
                bounds.height - next.position.y,
              ),
            };
          }
          if (event.key === "ArrowUp") {
            next.size = {
              ...next.size,
              height: clamp(
                next.size.height - KEYBOARD_STEP,
                minSize.height,
                bounds.height - next.position.y,
              ),
            };
          }
          return {
            ...previous,
            windows: { ...previous.windows, [id]: next },
          };
        }

        const nextPosition = {
          x: current.position.x,
          y: current.position.y,
        };
        if (event.key === "ArrowLeft") nextPosition.x -= KEYBOARD_STEP;
        if (event.key === "ArrowRight") nextPosition.x += KEYBOARD_STEP;
        if (event.key === "ArrowUp") nextPosition.y -= KEYBOARD_STEP;
        if (event.key === "ArrowDown") nextPosition.y += KEYBOARD_STEP;

        return {
          ...previous,
          windows: {
            ...previous.windows,
            [id]: {
              ...current,
              position: {
                x: clamp(
                  nextPosition.x,
                  0,
                  bounds.width - current.size.width,
                ),
                y: clamp(
                  nextPosition.y,
                  0,
                  bounds.height - current.size.height,
                ),
              },
            },
          },
        };
      });
    }

    return (
      <div
        ref={containerRef}
        role="group"
        data-slot="window-manager"
        className={cn(
          "relative isolate min-h-64 overflow-hidden bg-desktop",
          className,
        )}
        {...props}
      >
        {windows.map((item) => {
          const windowState = state.windows[item.id];
          if (!windowState?.open) {
            return null;
          }

          const orderIndex = state.order.indexOf(item.id);
          const focused = focusedId === item.id;
          const maximized = windowState.maximized;

          return (
            <Window
              key={item.id}
              ref={(node) => {
                if (node) {
                  windowRefs.current.set(item.id, node);
                } else {
                  windowRefs.current.delete(item.id);
                }
              }}
              active={focused}
              aria-label={item.title}
              tabIndex={-1}
              data-window-id={item.id}
              hidden={windowState.minimized || undefined}
              onPointerDown={() => raise(item.id)}
              className={cn(
                "absolute flex flex-col outline-none",
                windowState.minimized && "hidden",
              )}
              style={{
                left: maximized ? 0 : windowState.position.x,
                top: maximized ? 0 : windowState.position.y,
                width: maximized ? "100%" : windowState.size.width,
                height: maximized ? "100%" : windowState.size.height,
                zIndex: 10 + orderIndex,
              }}
            >
              <div
                role="group"
                aria-label={`Mover ventana ${item.title}`}
                tabIndex={0}
                className={cn(
                  "shrink-0 touch-none",
                  "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
                  !maximized && "cursor-default",
                )}
                onPointerDown={(event) => beginDrag(event, item.id)}
                onDoubleClick={(event) => {
                  if ((event.target as HTMLElement).closest("button")) {
                    return;
                  }
                  toggleMaximize(item.id);
                }}
                onKeyDown={(event) => handleTitleKeyDown(event, item.id)}
              >
                <Window.TitleBar
                  title={item.title}
                  icon={item.icon}
                  maximized={maximized}
                  onMinimize={() => minimize(item.id)}
                  onMaximize={() => toggleMaximize(item.id)}
                  onClose={() => close(item.id)}
                />
              </div>

              <Window.Body
                padded={false}
                className={cn(
                  "w95-scrollbar min-h-0 flex-1 overflow-auto",
                  item.bodyClassName,
                )}
              >
                {item.content}
              </Window.Body>

              {!maximized ? (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                >
                  {(
                    [
                      ["n", "left-2 right-2 top-0 h-1 cursor-ns-resize"],
                      ["s", "bottom-0 left-2 right-2 h-1 cursor-ns-resize"],
                      ["e", "bottom-2 right-0 top-2 w-1 cursor-ew-resize"],
                      ["w", "bottom-2 left-0 top-2 w-1 cursor-ew-resize"],
                      ["ne", "right-0 top-0 h-2 w-2 cursor-nesw-resize"],
                      ["nw", "left-0 top-0 h-2 w-2 cursor-nwse-resize"],
                      ["se", "bottom-0 right-0 h-2 w-2 cursor-nwse-resize"],
                      ["sw", "bottom-0 left-0 h-2 w-2 cursor-nesw-resize"],
                    ] as const
                  ).map(([direction, directionClass]) => (
                    <div
                      key={direction}
                      data-resize-direction={direction}
                      className={cn(
                        "pointer-events-auto absolute",
                        directionClass,
                      )}
                      onPointerDown={(event) =>
                        beginResize(event, item.id, direction)
                      }
                    />
                  ))}
                </div>
              ) : null}
            </Window>
          );
        })}
      </div>
    );
  },
);

WindowManager.displayName = "WindowManager";
