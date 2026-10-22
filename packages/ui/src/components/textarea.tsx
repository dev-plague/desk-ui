import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Área de texto hundida. Mantiene el mismo bisel y foco que `Input`, pero
 * permite varias líneas y redimensionado vertical.
 */
export interface TextareaProps extends React.ComponentProps<"textarea"> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          "flex min-h-[60px] w-full resize-y rounded-none bg-surface-sunken px-1 py-1",
          "font-ui text-ui leading-[15px] text-ink",
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

Textarea.displayName = "Textarea";
