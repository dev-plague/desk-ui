import * as MenubarPrimitive from "@radix-ui/react-menubar";
import * as React from "react";

import { cn } from "../lib/utils";

export const MenuBar = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    data-slot="menu-bar"
    className={cn(
      "flex h-[20px] items-center px-1 font-ui text-ui max-sm:h-[26px]",
      className,
    )}
    {...props}
  />
));

MenuBar.displayName = "MenuBar";

export function MenuBarMenu({
  label,
  children,
  className,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <MenubarPrimitive.Menu>
      <MenubarPrimitive.Trigger
        data-slot="menu-bar-trigger"
        className={cn(
          "h-[18px] px-2 text-[11px] leading-[13px] text-ink max-sm:h-6",
          "hover:bg-accent hover:text-ink-inverse",
          "data-[state=open]:bg-accent data-[state=open]:text-ink-inverse",
          "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
          className,
        )}
      >
        {label}
      </MenubarPrimitive.Trigger>
      <MenubarPrimitive.Portal>
        <MenubarPrimitive.Content
          sideOffset={1}
          align="start"
          data-slot="menu-bar-content"
          className="bevel-raised z-50 min-w-[180px] bg-surface p-[2px]"
        >
          {children}
        </MenubarPrimitive.Content>
      </MenubarPrimitive.Portal>
    </MenubarPrimitive.Menu>
  );
}

export const MenuBarItem = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    data-slot="menu-bar-item"
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

MenuBarItem.displayName = "MenuBarItem";

export const MenuBarSeparator = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    data-slot="menu-bar-separator"
    className={cn(
      "mx-1 my-1 h-[2px] border-t border-bevel-shadow border-b border-highlight",
      className,
    )}
    {...props}
  />
));

MenuBarSeparator.displayName = "MenuBarSeparator";

export const MenuBarLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="menu-bar-label"
    className={cn("px-2 py-1 text-[10px] font-bold text-ink-muted", className)}
    {...props}
  />
));

MenuBarLabel.displayName = "MenuBarLabel";

export function MenuBarShortcut({
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
