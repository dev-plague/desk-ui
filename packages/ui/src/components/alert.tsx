import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/utils";

const alertVariants = cva(
  "bevel-window flex items-start gap-2 bg-surface p-2 text-ink",
  {
    variants: {
      variant: {
        info: "border-l-[3px] border-l-info",
        success: "border-l-[3px] border-l-success",
        warning: "border-l-[3px] border-l-warning",
        danger: "border-l-[3px] border-l-danger",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

export interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  ),
);

Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="alert-title"
    className={cn("font-bold leading-[15px]", className)}
    {...props}
  />
));

AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="alert-description"
    className={cn("text-[11px] leading-[15px] text-ink", className)}
    {...props}
  />
));

AlertDescription.displayName = "AlertDescription";
