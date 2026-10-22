import * as React from "react";

import { cn } from "../lib/utils";

function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 7 7"
      width={7}
      height={7}
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      fill="currentColor"
      className={className}
    >
      <path d="M1 3h1v1H1zM2 4h1v1H2zM3 5h1v1H3zM4 4h1v1H4zM5 3h1v1H5zM6 2h1v1H6zM2 5h1v1H2zM3 4h1v1H3zM4 3h1v1H4zM5 2h1v1H5zM6 1h1v1H6z" />
    </svg>
  );
}

export interface CheckboxProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  /** Texto visible asociado al checkbox. */
  children?: React.ReactNode;
}

/**
 * Checkbox retro de 13×13 px con check pixelado. El `<input>` nativo sigue
 * siendo el control real: conserva teclado, formularios, `indeterminate` y
 * lectores de pantalla; la caja y el check son solo la representación visual.
 *
 * Añade un nombre accesible (`children` o `aria-label`) siempre.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, children, disabled, ...props }, ref) => {
    return (
      <label
        data-slot="checkbox-label"
        data-disabled={disabled || undefined}
        className={cn(
          "group inline-flex cursor-default select-none items-center gap-2",
          "font-ui text-ui leading-[13px] text-ink",
          "max-sm:min-h-6 max-sm:min-w-6",
          className,
        )}
      >
        <span className="relative inline-flex h-[13px] w-[13px] shrink-0">
          <input
            ref={ref}
            type="checkbox"
            data-slot="checkbox"
            disabled={disabled}
            className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-default appearance-none rounded-none opacity-0"
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 bg-surface-sunken bevel-field",
              "peer-focus-visible:focus-dotted peer-focus-visible:outline-offset-[-2px]",
              "peer-disabled:bg-surface",
            )}
          />
          <CheckGlyph
            className={cn(
              "pointer-events-none absolute inset-0 m-auto text-ink opacity-0",
              "peer-checked:opacity-100",
              "peer-disabled:text-ink-disabled",
            )}
          />
        </span>
        {children ? (
          <span className={cn(disabled && "text-engraved")}>{children}</span>
        ) : null}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
