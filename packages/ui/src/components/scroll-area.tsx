import * as React from "react";

import { useDeskUILocale } from "../lib/i18n";
import { cn } from "../lib/utils";

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

export interface ScrollAreaProps extends React.ComponentProps<"div"> {
  orientation?: ScrollAreaOrientation;
  viewportClassName?: string;
}

type ScrollAxis = "vertical" | "horizontal";
type ArrowDirection = "up" | "down" | "left" | "right";

/** Grosor clásico de la barra y de los botones de flecha. */
const SCROLLBAR_SIZE = 16;
/** El thumb nunca se encoge hasta desaparecer. */
const MIN_THUMB_SIZE = 16;
/** Una línea de texto por pulsación, como en la interfaz clásica. */
const ARROW_STEP = 16;

function scrollViewport(
  viewport: HTMLDivElement,
  axis: ScrollAxis,
  amount: number,
) {
  if (axis === "vertical") {
    viewport.scrollTop += amount;
  } else {
    viewport.scrollLeft += amount;
  }
}

interface ArrowButtonProps {
  direction: ArrowDirection;
  label: string;
  disabled: boolean;
  onPress: () => void;
  onRelease: () => void;
}

function ArrowButton({
  direction,
  label,
  disabled,
  onPress,
  onRelease,
}: ArrowButtonProps) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={label}
      disabled={disabled}
      data-direction={direction}
      className="w95-scrollbar-arrow"
      onPointerDown={(event) => {
        if (event.button !== 0) {
          return;
        }
        event.preventDefault();
        onPress();
      }}
      onPointerUp={onRelease}
      onPointerLeave={onRelease}
      onPointerCancel={onRelease}
      onContextMenu={(event) => event.preventDefault()}
    />
  );
}

interface ScrollBarProps {
  axis: ScrollAxis;
  viewportRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Barra clásica dibujada con DOM: dos flechas elevadas, pista tramada y thumb
 * cuadrado. El scroll real sigue ocurriendo en el viewport nativo.
 */
function ScrollBar({ axis, viewportRef }: ScrollBarProps) {
  const { messages } = useDeskUILocale();
  const labels = messages.scrollArea;
  const vertical = axis === "vertical";
  const trackRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<{
    start: number;
    scroll: number;
    maxScroll: number;
    maxOffset: number;
  } | null>(null);
  const [scrollable, setScrollable] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  const measure = React.useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!viewport || !track || !thumb) {
      return;
    }

    const client = vertical ? viewport.clientHeight : viewport.clientWidth;
    const total = vertical ? viewport.scrollHeight : viewport.scrollWidth;
    const position = vertical ? viewport.scrollTop : viewport.scrollLeft;
    const trackSize = vertical ? track.clientHeight : track.clientWidth;
    const overflowing = total > client + 1;

    setScrollable((current) =>
      current === overflowing ? current : overflowing,
    );

    if (!overflowing || trackSize <= 0 || total <= 0) {
      thumb.style.removeProperty(vertical ? "height" : "width");
      thumb.style.removeProperty(vertical ? "top" : "left");
      return;
    }

    const size = Math.max(MIN_THUMB_SIZE, (trackSize * client) / total);
    const maxOffset = Math.max(0, trackSize - size);
    const maxScroll = Math.max(1, total - client);
    const offset = Math.min(
      maxOffset,
      Math.max(0, (position / maxScroll) * maxOffset),
    );

    if (vertical) {
      thumb.style.height = `${size}px`;
      thumb.style.top = `${offset}px`;
    } else {
      thumb.style.width = `${size}px`;
      thumb.style.left = `${offset}px`;
    }
  }, [vertical, viewportRef]);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    measure();
    viewport.addEventListener("scroll", measure, { passive: true });

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => measure());
      observer.observe(viewport);
      const content = viewport.firstElementChild;
      if (content) {
        observer.observe(content);
      }
    }

    window.addEventListener("resize", measure);
    return () => {
      viewport.removeEventListener("scroll", measure);
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, viewportRef]);

  const scrollStep = React.useCallback(
    (direction: number) => {
      const viewport = viewportRef.current;
      if (viewport) {
        scrollViewport(viewport, axis, direction * ARROW_STEP);
      }
    },
    [axis, viewportRef],
  );

  const pageStep = React.useCallback(
    (direction: number) => {
      const viewport = viewportRef.current;
      if (!viewport) {
        return;
      }
      const client = vertical ? viewport.clientHeight : viewport.clientWidth;
      scrollViewport(
        viewport,
        axis,
        direction * Math.max(ARROW_STEP, client - ARROW_STEP),
      );
    },
    [axis, vertical, viewportRef],
  );

  const repeatTimer = React.useRef<number | undefined>(undefined);
  const repeatInterval = React.useRef<number | undefined>(undefined);

  const stopRepeat = React.useCallback(() => {
    if (repeatTimer.current !== undefined) {
      window.clearTimeout(repeatTimer.current);
      repeatTimer.current = undefined;
    }
    if (repeatInterval.current !== undefined) {
      window.clearInterval(repeatInterval.current);
      repeatInterval.current = undefined;
    }
  }, []);

  React.useEffect(() => stopRepeat, [stopRepeat]);

  const startRepeat = React.useCallback(
    (direction: number) => {
      stopRepeat();
      scrollStep(direction);
      repeatTimer.current = window.setTimeout(() => {
        repeatInterval.current = window.setInterval(
          () => scrollStep(direction),
          50,
        );
      }, 350);
    },
    [scrollStep, stopRepeat],
  );

  function handleTrackPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !scrollable) {
      return;
    }
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) {
      return;
    }

    event.preventDefault();
    const rect = track.getBoundingClientRect();
    const pointer = vertical
      ? event.clientY - rect.top
      : event.clientX - rect.left;
    const thumbStart = vertical ? thumb.offsetTop : thumb.offsetLeft;
    const thumbEnd =
      thumbStart + (vertical ? thumb.offsetHeight : thumb.offsetWidth);

    if (pointer < thumbStart) {
      pageStep(-1);
    } else if (pointer > thumbEnd) {
      pageStep(1);
    }
  }

  function handleThumbPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !scrollable) {
      return;
    }
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!viewport || !track || !thumb) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const client = vertical ? viewport.clientHeight : viewport.clientWidth;
    const total = vertical ? viewport.scrollHeight : viewport.scrollWidth;
    const trackSize = vertical ? track.clientHeight : track.clientWidth;
    const thumbSize = vertical ? thumb.offsetHeight : thumb.offsetWidth;

    dragRef.current = {
      start: vertical ? event.clientY : event.clientX,
      scroll: vertical ? viewport.scrollTop : viewport.scrollLeft,
      maxScroll: Math.max(1, total - client),
      maxOffset: Math.max(1, trackSize - thumbSize),
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }

  function handleThumbPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const viewport = viewportRef.current;
    if (!drag || !viewport) {
      return;
    }

    const delta = (vertical ? event.clientY : event.clientX) - drag.start;
    const next = drag.scroll + (delta / drag.maxOffset) * drag.maxScroll;
    if (vertical) {
      viewport.scrollTop = next;
    } else {
      viewport.scrollLeft = next;
    }
  }

  function handleThumbPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) {
      return;
    }
    dragRef.current = null;
    setDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div
      data-slot="scroll-area-scrollbar"
      data-orientation={axis}
      className={cn(
        "flex bg-surface",
        vertical
          ? "col-start-2 row-start-1 h-full w-4 flex-col"
          : "col-start-1 row-start-2 h-4 w-full flex-row",
      )}
    >
      <ArrowButton
        direction={vertical ? "up" : "left"}
        label={vertical ? labels.scrollUp : labels.scrollLeft}
        disabled={!scrollable}
        onPress={() => startRepeat(-1)}
        onRelease={stopRepeat}
      />

      <div
        ref={trackRef}
        data-slot="scroll-area-track"
        onPointerDown={handleTrackPointerDown}
        className={cn(
          "w95-scrollbar-dither relative flex-1",
          vertical ? "min-h-0 w-full" : "min-w-0 h-full",
        )}
      >
        <div
          ref={thumbRef}
          data-slot="scroll-area-thumb"
          data-dragging={dragging || undefined}
          aria-hidden="true"
          onPointerDown={handleThumbPointerDown}
          onPointerMove={handleThumbPointerMove}
          onPointerUp={handleThumbPointerUp}
          onPointerCancel={handleThumbPointerUp}
          className={cn(
            "w95-scrollbar-thumb absolute touch-none",
            vertical ? "inset-x-0 top-0 h-full" : "inset-y-0 left-0 w-full",
            scrollable
              ? vertical
                ? "cursor-ns-resize"
                : "cursor-ew-resize"
              : "cursor-default",
          )}
        />
      </div>

      <ArrowButton
        direction={vertical ? "down" : "right"}
        label={vertical ? labels.scrollDown : labels.scrollRight}
        disabled={!scrollable}
        onPress={() => startRepeat(1)}
        onRelease={stopRepeat}
      />
    </div>
  );
}

/**
 * Contenedor con scroll nativo y barra clásica de 16 px: flechas elevadas,
 * pista tramada y thumb cuadrado. El viewport es focusable para que el teclado
 * pueda desplazar el contenido.
 */
export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      className,
      viewportClassName,
      orientation = "vertical",
      children,
      "aria-label": ariaLabel,
      style,
      ...props
    },
    ref,
  ) => {
    const viewportRef = React.useRef<HTMLDivElement>(null);
    const hasVertical = orientation !== "horizontal";
    const hasHorizontal = orientation !== "vertical";

    return (
      <div
        ref={ref}
        data-slot="scroll-area"
        className={cn("relative grid", className)}
        style={{
          gridTemplateColumns: hasVertical
            ? `minmax(0, 1fr) ${SCROLLBAR_SIZE}px`
            : "minmax(0, 1fr)",
          gridTemplateRows: hasHorizontal
            ? `minmax(0, 1fr) ${SCROLLBAR_SIZE}px`
            : "minmax(0, 1fr)",
          ...style,
        }}
        {...props}
      >
        <div
          ref={viewportRef}
          data-slot="scroll-area-viewport"
          role="region"
          aria-label={ariaLabel}
          tabIndex={0}
          className={cn(
            "w95-scrollbar-hidden col-start-1 row-start-1 h-full w-full",
            "min-h-0 min-w-0",
            "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
            orientation === "vertical" && "overflow-y-auto overflow-x-hidden",
            orientation === "horizontal" &&
              "overflow-x-auto overflow-y-hidden",
            orientation === "both" && "overflow-auto",
            viewportClassName,
          )}
        >
          {children}
        </div>

        {hasVertical ? (
          <ScrollBar axis="vertical" viewportRef={viewportRef} />
        ) : null}
        {hasHorizontal ? (
          <ScrollBar axis="horizontal" viewportRef={viewportRef} />
        ) : null}
        {hasVertical && hasHorizontal ? (
          <div
            data-slot="scroll-area-corner"
            aria-hidden="true"
            className="col-start-2 row-start-2 bg-surface"
          />
        ) : null}
      </div>
    );
  },
);

ScrollArea.displayName = "ScrollArea";
