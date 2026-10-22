import * as React from "react";

import { cn } from "../lib/utils";

export interface ListBoxProps extends React.ComponentProps<"select"> {
  /** Número de filas visibles. Con 4 o más se comporta como list box. */
  size?: number;
}

/**
 * List box nativa: un `<select size>` con el bisel hundido clásico. Mantiene
 * Ctrl/Shift para selección múltiple y todo el comportamiento de teclado y
 * formularios del navegador.
 */
export const ListBox = React.forwardRef<HTMLSelectElement, ListBoxProps>(
  ({ className, size = 4, ...props }, ref) => (
    <select
      ref={ref}
      size={size}
      data-slot="list-box"
      className={cn(
        "w95-scrollbar bevel-field block w-full bg-surface-sunken p-[2px]",
        "font-ui text-[11px] leading-[15px] text-ink",
        "outline-none focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
        "disabled:cursor-not-allowed disabled:bg-surface disabled:text-engraved",
        className,
      )}
      {...props}
    />
  ),
);

ListBox.displayName = "ListBox";
