import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Group box clásico: la leyenda se apoya sobre el borde superior y su fondo
 * enmascara la línea, creando la muesca tradicional.
 */
export interface GroupBoxProps
  extends Omit<React.ComponentProps<"fieldset">, "children"> {
  legend: React.ReactNode;
  children?: React.ReactNode;
}

export const GroupBox = React.forwardRef<HTMLFieldSetElement, GroupBoxProps>(
  ({ className, legend, children, ...props }, ref) => {
    return (
      <fieldset
        ref={ref}
        data-slot="group-box"
        className={cn(
          "bevel-group relative m-0 min-w-0 px-2 pb-3 pt-2",
          className,
        )}
        {...props}
      >
        <legend className="ml-0 bg-surface pl-0 pr-2 text-[11px] font-bold leading-[13px]">
          {legend}
        </legend>
        {children}
      </fieldset>
    );
  },
);

GroupBox.displayName = "GroupBox";
