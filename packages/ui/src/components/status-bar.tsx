import * as React from "react";

import { cn } from "../lib/utils";

export interface StatusBarProps extends React.ComponentProps<"div"> {}

export const StatusBar = React.forwardRef<HTMLDivElement, StatusBarProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="status-bar"
      className={cn("flex gap-[1px] bg-surface", className)}
      {...props}
    />
  ),
);

StatusBar.displayName = "StatusBar";

export interface StatusBarFieldProps extends React.ComponentProps<"div"> {}

export const StatusBarField = React.forwardRef<
  HTMLDivElement,
  StatusBarFieldProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="status-bar-field"
    className={cn(
      "bevel-status min-w-0 flex-1 truncate px-[3px] py-[2px]",
      "text-[11px] leading-[13px]",
      className,
    )}
    {...props}
  />
));

StatusBarField.displayName = "StatusBarField";
