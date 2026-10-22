import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as React from "react";

import { cn } from "../lib/utils";

export const StartMenu = DropdownMenuPrimitive.Root;
export const StartMenuTrigger = DropdownMenuPrimitive.Trigger;
export const StartMenuSub = DropdownMenuPrimitive.Sub;

export const StartMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, side = "top", align = "start", sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      side={side}
      align={align}
      sideOffset={sideOffset}
      data-slot="start-menu-content"
      className={cn(
        "bevel-raised z-50 bg-surface p-[2px] font-ui text-ui",
        "max-h-[min(80dvh,520px)] overflow-y-auto",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));

StartMenuContent.displayName = "StartMenu.Content";

export const StartMenuSidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { label?: string }
>(({ className, label = "DeskUI", children, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    data-slot="start-menu-sidebar"
    className={cn(
      "flex w-6 shrink-0 items-end justify-center bg-accent pb-2",
      className,
    )}
    {...props}
  >
    <span className="rotate-180 text-[13px] font-bold leading-none tracking-[0.5px] text-ink-inverse [writing-mode:vertical-rl]">
      {children ?? label}
    </span>
  </div>
));

StartMenuSidebar.displayName = "StartMenu.Sidebar";

export const StartMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    data-slot="start-menu-item"
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

StartMenuItem.displayName = "StartMenu.Item";

export const StartMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    data-slot="start-menu-sub-trigger"
    className={cn(
      "group relative flex h-[24px] select-none items-center gap-2 px-2",
      "font-ui text-[11px] leading-[13px] text-ink outline-none",
      "data-[highlighted]:bg-accent data-[highlighted]:text-ink-inverse",
      "data-[state=open]:bg-accent data-[state=open]:text-ink-inverse",
      "data-[disabled]:pointer-events-none data-[disabled]:text-engraved",
      className,
    )}
    {...props}
  >
    {children}
    <span aria-hidden="true" className="ml-auto pl-3 text-[10px]">
      ▸
    </span>
  </DropdownMenuPrimitive.SubTrigger>
));

StartMenuSubTrigger.displayName = "StartMenu.SubTrigger";

export const StartMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, sideOffset = 0, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      sideOffset={sideOffset}
      data-slot="start-menu-sub-content"
      className={cn(
        "bevel-raised z-50 min-w-[180px] bg-surface p-[2px]",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));

StartMenuSubContent.displayName = "StartMenu.SubContent";

export const StartMenuGroup = DropdownMenuPrimitive.Group;

export const StartMenuLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    data-slot="start-menu-label"
    className={cn("px-2 py-1 text-[10px] font-bold text-ink-muted", className)}
    {...props}
  />
));

StartMenuLabel.displayName = "StartMenu.Label";

export const StartMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    data-slot="start-menu-separator"
    className={cn(
      "mx-1 my-1 h-[2px] border-t border-bevel-shadow border-b border-highlight",
      className,
    )}
    {...props}
  />
));

StartMenuSeparator.displayName = "StartMenu.Separator";

export function StartMenuShortcut({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-auto pl-3 text-[10px] leading-[13px] text-ink-muted group-data-[highlighted]:text-ink-inverse">
      {children}
    </span>
  );
}
