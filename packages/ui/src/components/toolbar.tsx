import * as React from "react";

import { Button, type ButtonProps } from "./button";
import { Separator } from "./separator";
import { cn } from "../lib/utils";

function focusableButtons(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [role="button"]:not([aria-disabled="true"])',
    ),
  );
}

export interface ToolbarProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical";
}

/**
 * Barra de herramientas clásica. Los botones se recorren con las flechas
 * (patrón ARIA de toolbar) además de Tab; Home/End saltan al primero/último.
 */
export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, orientation = "horizontal", onKeyDown, ...props }, ref) => {
    const vertical = orientation === "vertical";

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
      onKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }

      const keys = vertical
        ? ["ArrowUp", "ArrowDown"]
        : ["ArrowLeft", "ArrowRight"];
      if (![...keys, "Home", "End"].includes(event.key)) {
        return;
      }

      const buttons = focusableButtons(event.currentTarget);
      const current = buttons.indexOf(event.target as HTMLElement);
      if (current === -1) {
        return;
      }

      event.preventDefault();

      if (event.key === "Home") {
        buttons[0]?.focus();
        return;
      }

      if (event.key === "End") {
        buttons[buttons.length - 1]?.focus();
        return;
      }

      const step = event.key === keys[1] ? 1 : -1;
      const next = (current + step + buttons.length) % buttons.length;
      buttons[next]?.focus();
    }

    return (
      <div
        ref={ref}
        data-slot="toolbar"
        data-orientation={orientation}
        role="toolbar"
        aria-orientation={vertical ? "vertical" : undefined}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex gap-1 bg-surface",
          vertical
            ? "w-fit flex-col items-center py-1"
            : "flex-wrap items-center px-1 py-1",
          className,
        )}
        {...props}
      />
    );
  },
);

Toolbar.displayName = "Toolbar";

export interface ToolbarButtonProps extends ButtonProps {
  /** Conveniencia para botones de alternancia. */
  pressed?: boolean;
}

export const ToolbarButton = React.forwardRef<
  HTMLButtonElement,
  ToolbarButtonProps
>(({ className, pressed, size = "sm", ...props }, ref) => (
  <Button
    ref={ref}
    size={size}
    aria-pressed={pressed}
    className={cn("h-[22px] min-w-0 px-2 max-sm:h-6", className)}
    {...props}
  />
));

ToolbarButton.displayName = "Toolbar.Button";

export interface ToolbarGroupProps extends React.ComponentProps<"div"> {}

export const ToolbarGroup = React.forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="toolbar-group"
      role="group"
      className={cn("flex items-center gap-[2px]", className)}
      {...props}
    />
  ),
);

ToolbarGroup.displayName = "Toolbar.Group";

export interface ToolbarSeparatorProps
  extends React.ComponentProps<typeof Separator> {}

export const ToolbarSeparator = React.forwardRef<
  HTMLDivElement,
  ToolbarSeparatorProps
>(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    orientation="vertical"
    decorative
    className={cn("mx-[2px] h-[20px] self-center", className)}
    {...props}
  />
));

ToolbarSeparator.displayName = "Toolbar.Separator";
