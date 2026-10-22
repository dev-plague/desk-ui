import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Sunken classic text field.
 *
 * The 2px field bevel uses the inverted bevel recipe: dark edge on the
 * top/left, highlight on the bottom/right. Focus is shown with the classic
 * dotted rectangle, not a modern ring.
 */
export interface InputProps extends React.ComponentProps<"input"> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          "flex h-[21px] w-full min-w-0 max-sm:h-6 rounded-none bg-surface-sunken px-1 py-[3px]",
          "font-ui text-ui leading-[11px] text-ink",
          "bevel-field",
          "placeholder:text-ink-muted",
          "selection:bg-selection selection:text-selection-ink",
          "focus-visible:focus-dotted focus-visible:outline-offset-[-3px]",
          "read-only:bg-surface",
          "disabled:cursor-not-allowed disabled:bg-surface disabled:text-engraved",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
