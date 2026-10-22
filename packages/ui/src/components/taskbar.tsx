import * as React from "react";

import { Button, type ButtonProps } from "./button";
import { cn } from "../lib/utils";

export interface TaskbarProps extends React.ComponentProps<"footer"> {}

export const Taskbar = React.forwardRef<HTMLElement, TaskbarProps>(
  ({ className, ...props }, ref) => (
    <footer
      ref={ref}
      data-slot="taskbar"
      className={cn(
        "flex h-[28px] items-center gap-[3px] border-t border-highlight",
        "bg-surface px-[2px] font-ui text-ui max-sm:h-8",
        className,
      )}
      {...props}
    />
  ),
);

Taskbar.displayName = "Taskbar";

export interface TaskbarButtonProps extends ButtonProps {
  icon?: React.ReactNode;
}

export const TaskbarStart = React.forwardRef<
  HTMLButtonElement,
  TaskbarButtonProps
>(({ className, icon, children, ...props }, ref) => (
  <Button
    ref={ref}
    size="sm"
    className={cn(
      "h-[22px] min-w-0 gap-1 px-1.5 font-bold max-sm:h-[26px]",
      className,
    )}
    {...props}
  >
    {icon}
    {children}
  </Button>
));

TaskbarStart.displayName = "TaskbarStart";

export interface TaskbarItemProps
  extends Omit<TaskbarButtonProps, "aria-pressed"> {
  active?: boolean;
}

export const TaskbarItem = React.forwardRef<
  HTMLButtonElement,
  TaskbarItemProps
>(({ className, icon, children, active = false, ...props }, ref) => (
  <Button
    ref={ref}
    size="sm"
    aria-pressed={active}
    className={cn(
      "h-[22px] min-w-0 max-w-[48vw] justify-start gap-1 px-1.5 font-normal",
      "max-sm:h-[26px] sm:max-w-[340px]",
      className,
    )}
    {...props}
  >
    {icon}
    <span className="truncate">{children}</span>
  </Button>
));

TaskbarItem.displayName = "TaskbarItem";

export const TaskbarDivider = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    data-slot="taskbar-divider"
    className={cn(
      "mx-[1px] h-[22px] w-[2px] border-l border-bevel-shadow border-r border-highlight",
      className,
    )}
    {...props}
  />
));

TaskbarDivider.displayName = "TaskbarDivider";

export const TaskbarTray = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="taskbar-tray"
    className={cn(
      "bevel-status ml-auto flex h-[22px] shrink-0 items-center gap-2 px-2",
      "max-sm:h-[26px]",
      className,
    )}
    {...props}
  />
));

TaskbarTray.displayName = "TaskbarTray";
