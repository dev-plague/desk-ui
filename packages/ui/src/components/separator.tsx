import * as React from "react";

import { cn } from "../lib/utils";

export interface SeparatorProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical";
  /**
   * Un separador decorativo no se anuncia a lectores de pantalla. Úsalo
   * cuando la separación ya se entiende por el contenido.
   */
  decorative?: boolean;
}

/**
 * Línea de separación con la ranura clásica: sombra arriba/izquierda y luz
 * abajo/derecha. Horizontal por defecto; vertical para barras y toolbars.
 */
export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = false,
      ...props
    },
    ref,
  ) => {
    const vertical = orientation === "vertical";

    return (
      <div
        ref={ref}
        data-slot="separator"
        data-orientation={orientation}
        role={decorative ? "none" : "separator"}
        aria-hidden={decorative || undefined}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(
          "shrink-0 border-0",
          vertical
            ? "h-full min-h-[8px] w-[2px] self-stretch border-l border-bevel-shadow border-r border-highlight"
            : "h-[2px] w-full border-t border-bevel-shadow border-b border-highlight",
          className,
        )}
        {...props}
      />
    );
  },
);

Separator.displayName = "Separator";
