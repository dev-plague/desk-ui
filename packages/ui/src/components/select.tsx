import * as React from "react";

import { cn } from "../lib/utils";

function SelectArrow() {
  return (
    <svg
      viewBox="0 0 7 4"
      width={7}
      height={4}
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      fill="currentColor"
    >
      <path d="M0 0h7v1H6v1H5v1H2V2H1V1H0z" />
    </svg>
  );
}

/**
 * Select nativo estilizado como campo hundido con botón de flecha elevado.
 * Mantiene el comportamiento nativo de teclado, formularios y lectores de
 * pantalla; no pretende soportar `multiple`.
 */
export interface SelectProps extends React.ComponentProps<"select"> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span className="relative inline-flex w-full">
        <select
          ref={ref}
          data-slot="select"
          className={cn(
            "h-[21px] w-full appearance-none rounded-none bg-surface-sunken",
            "py-[3px] pl-1 pr-8 font-ui text-ui leading-[11px] text-ink",
            "bevel-field",
            "focus:bg-accent focus:text-ink-inverse",
            "focus-visible:focus-dotted focus-visible:outline-offset-[-3px]",
            "disabled:cursor-not-allowed disabled:bg-surface disabled:text-engraved",
            "max-sm:h-6",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-[2px] right-[2px] top-[2px] w-4",
            "grid place-items-center bg-surface text-ink bevel-raised",
          )}
        >
          <SelectArrow />
        </span>
      </span>
    );
  },
);

Select.displayName = "Select";
