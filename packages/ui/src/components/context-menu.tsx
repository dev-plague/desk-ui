import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import * as React from "react";

import { cn } from "../lib/utils";

export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

export const ContextMenuContent = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      data-slot="context-menu-content"
      className={cn(
        "bevel-raised z-50 min-w-[180px] bg-surface p-[2px]",
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));

ContextMenuContent.displayName = "ContextMenuContent";

export const ContextMenuItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    data-slot="context-menu-item"
    className={cn(
      "group relative flex h-[24px] select-none items-center gap-2 px-2",
      "font-ui text-[11px] leading-[13px] text-ink outline-none",
      "data-[highlighted]:bg-accent data-[highlighted]:text-ink-inverse",
      "data-[disabled]:pointer-events-none data-[disabled]:text-engraved",
      className,
    )}
    {...props}
  />
));

ContextMenuItem.displayName = "ContextMenuItem";

export const ContextMenuLabel = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    data-slot="context-menu-label"
    className={cn("px-2 py-1 text-[10px] font-bold text-ink-muted", className)}
    {...props}
  />
));

ContextMenuLabel.displayName = "ContextMenuLabel";

export const ContextMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    data-slot="context-menu-separator"
    className={cn(
      "mx-1 my-1 h-[2px] border-t border-bevel-shadow border-b border-highlight",
      className,
    )}
    {...props}
  />
));

ContextMenuSeparator.displayName = "ContextMenuSeparator";

export function ContextMenuShortcut({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="ml-auto pl-3 text-[10px] leading-[13px] text-ink-muted group-data-[highlighted]:text-ink-inverse">
      {children}
    </span>
  );
}
