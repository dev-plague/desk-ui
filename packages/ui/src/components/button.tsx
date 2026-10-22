import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Classic push button.
 *
 * - `default`: standard 2px raised bevel.
 * - `primary`: the "default button" treatment with the thicker black ring.
 * - `icon`: square toolbar button; pass an accessible label.
 *
 * A button with `aria-pressed` automatically renders in the sunken,
 * toggled-on state.
 */
const buttonVariants = cva(
  [
    "relative inline-flex select-none items-center justify-center gap-1",
    "whitespace-nowrap rounded-none bg-surface font-ui text-ui text-ink",
    "bevel-raised transition-none",
    "active:translate-x-[1px] active:translate-y-[1px] active:bevel-sunken",
    "aria-pressed:translate-x-[1px] aria-pressed:translate-y-[1px]",
    "aria-pressed:bevel-sunken aria-pressed:bg-surface-pressed",
    "focus-visible:focus-dotted focus-visible:outline-offset-[-4px]",
    "disabled:pointer-events-none disabled:text-engraved",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        primary:
          "bevel-default font-bold active:bevel-default-sunken aria-pressed:bevel-default-sunken",
        icon: "min-w-0 p-0",
      },
      size: {
        sm: "h-[21px] min-w-[60px] px-2 max-sm:h-6",
        md: "h-[23px] min-w-[75px] px-3 max-sm:h-6",
        lg: "h-[27px] min-w-[90px] px-4",
        icon: "h-[23px] w-[23px] min-w-0 p-0 max-sm:h-6 max-sm:w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  /** Render the child element instead of a `<button>` (Radix Slot). */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, type, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="button"
        type={asChild ? undefined : (type ?? "button")}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { buttonVariants };
