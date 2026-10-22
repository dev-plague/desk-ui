import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "../lib/utils";

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    data-slot="tabs-list"
    className={cn("flex items-end gap-[2px] px-1", className)}
    {...props}
  />
));

TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    data-slot="tabs-trigger"
    className={cn(
      "w95-tab-trigger relative bg-surface px-3 py-[3px]",
      "font-ui text-[11px] leading-[13px] text-ink max-sm:min-h-6",
      "data-[state=active]:z-10 data-[state=active]:-mb-[2px]",
      "data-[state=active]:pb-[5px]",
      "focus-visible:focus-dotted focus-visible:outline-offset-[-3px]",
      "disabled:pointer-events-none",
      className,
    )}
    {...props}
  />
));

TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-slot="tabs-content"
    className={cn(
      "bevel-window min-h-[60px] bg-surface p-3",
      "focus-visible:focus-dotted focus-visible:outline-offset-[-3px]",
      className,
    )}
    {...props}
  />
));

TabsContent.displayName = "TabsContent";
