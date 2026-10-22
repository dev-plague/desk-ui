import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Contenedor genérico con los biseles clásicos. Sirve como bloque de
 * composición para agrupar contenido sin imponer estructura semántica.
 */
const panelVariants = cva("min-w-0 rounded-none bg-surface text-ink", {
  variants: {
    variant: {
      raised: "bevel-raised",
      sunken: "bevel-sunken",
      window: "bevel-window p-[3px]",
      flat: "border border-bevel-shadow",
    },
    padding: {
      none: "",
      sm: "p-1",
      md: "p-2",
      lg: "p-3",
    },
  },
  defaultVariants: {
    variant: "raised",
    padding: "md",
  },
});

export interface PanelProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof panelVariants> {}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="panel"
      data-variant={variant ?? "raised"}
      className={cn(panelVariants({ variant, padding }), className)}
      {...props}
    />
  ),
);

Panel.displayName = "Panel";

export interface PanelHeaderProps extends React.ComponentProps<"div"> {}

export const PanelHeader = React.forwardRef<HTMLDivElement, PanelHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="panel-header"
      className={cn(
        "mb-2 flex flex-wrap items-center justify-between gap-2",
        "border-b border-bevel-shadow pb-1",
        className,
      )}
      {...props}
    />
  ),
);

PanelHeader.displayName = "Panel.Header";

export interface PanelTitleProps extends React.ComponentProps<"h2"> {}

export const PanelTitle = React.forwardRef<HTMLHeadingElement, PanelTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      data-slot="panel-title"
      className={cn("text-[12px] font-bold leading-[15px]", className)}
      {...props}
    />
  ),
);

PanelTitle.displayName = "Panel.Title";

export interface PanelBodyProps extends React.ComponentProps<"div"> {}

export const PanelBody = React.forwardRef<HTMLDivElement, PanelBodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="panel-body"
      className={cn("min-w-0", className)}
      {...props}
    />
  ),
);

PanelBody.displayName = "Panel.Body";

export interface PanelFooterProps extends React.ComponentProps<"div"> {}

export const PanelFooter = React.forwardRef<HTMLDivElement, PanelFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="panel-footer"
      className={cn(
        "mt-2 flex flex-wrap items-center justify-end gap-2",
        "border-t border-bevel-light pt-2",
        className,
      )}
      {...props}
    />
  ),
);

PanelFooter.displayName = "Panel.Footer";

export { panelVariants };
