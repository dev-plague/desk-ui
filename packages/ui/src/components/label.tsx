import * as React from "react";

import { cn } from "../lib/utils";

export interface LabelProps extends React.ComponentProps<"label"> {}

/**
 * Etiqueta de formulario con la tipografía y densidad clásicas. Se asocia al
 * control con `htmlFor`/`id`; no envuelve al input salvo que el consumidor lo
 * decida.
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        data-slot="label"
        className={cn(
          "inline-flex select-none items-center gap-2 font-ui text-ui leading-[13px] text-ink",
          className,
        )}
        {...props}
      />
    );
  },
);

Label.displayName = "Label";
