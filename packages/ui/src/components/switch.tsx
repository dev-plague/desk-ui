import * as React from "react";

import { cn } from "../lib/utils";

export interface SwitchProps
  extends Omit<React.ComponentProps<"button">, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Interruptor retro: pista hundida y perilla elevada. Es un `<button>`
 * nativo con `role="switch"`, por lo que Space/Enter y el foco funcionan sin
 * código extra.
 */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const [internalChecked, setInternalChecked] =
      React.useState(defaultChecked);
    const isChecked = checked ?? internalChecked;

    function toggle() {
      if (disabled) {
        return;
      }

      const next = !isChecked;
      if (checked === undefined) {
        setInternalChecked(next);
      }
      onCheckedChange?.(next);
    }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        data-slot="switch"
        onClick={(event) => {
          toggle();
          onClick?.(event);
        }}
        className={cn(
          "group inline-flex cursor-default select-none items-center gap-2",
          "bg-transparent font-ui text-ui leading-[13px] text-ink",
          "focus-visible:focus-dotted focus-visible:outline-offset-2",
          "disabled:pointer-events-none disabled:text-engraved",
          "max-sm:min-h-6",
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "relative inline-flex h-[18px] w-[38px] shrink-0 items-center",
            "bg-surface p-[2px] bevel-sunken",
            disabled && "bg-surface",
          )}
        >
          <span
            className={cn(
              "h-3 w-4 shrink-0 bg-surface bevel-raised",
              "transition-none",
              isChecked ? "translate-x-[18px]" : "translate-x-0",
              disabled && "bg-surface",
            )}
          />
        </span>
        {children ? <span>{children}</span> : null}
      </button>
    );
  },
);

Switch.displayName = "Switch";
