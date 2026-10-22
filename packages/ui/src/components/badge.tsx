import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/utils";

const badgeVariants = cva(
  [
    "inline-flex h-[17px] items-center gap-1 rounded-none px-1.5",
    "font-ui text-[10px] leading-[13px] text-ink",
    "bevel-raised bg-surface",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        info: "",
        success: "",
        warning: "",
        danger: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const dotVariants: Record<string, string> = {
  default: "",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const dot = dotVariants[variant ?? "default"];

  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {dot ? <span aria-hidden="true" className={cn("h-1.5 w-1.5", dot)} /> : null}
      {children}
    </span>
  );
}

export { badgeVariants };
