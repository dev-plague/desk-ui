import * as React from "react";

import { cn } from "../lib/utils";

type RadioGroupContextValue = {
  name: string;
  value?: string;
  setValue: (value: string) => void;
  disabled: boolean;
  required: boolean;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
);

export interface RadioGroupProps
  extends Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      name,
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      required = false,
      children,
      ...props
    },
    ref,
  ) => {
    const generatedName = React.useId();
    const groupName = name ?? generatedName;
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const currentValue = value ?? internalValue;

    function setValue(next: string) {
      if (value === undefined) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    }

    return (
      <RadioGroupContext.Provider
        value={{
          name: groupName,
          value: currentValue,
          setValue,
          disabled,
          required,
        }}
      >
        <div
          ref={ref}
          role="radiogroup"
          aria-required={required || undefined}
          aria-disabled={disabled || undefined}
          data-slot="radio-group"
          className={cn("grid gap-2", className)}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);

RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps
  extends Omit<React.ComponentProps<"input">, "type" | "value"> {
  value: string;
  children?: React.ReactNode;
}

export const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  RadioGroupItemProps
>(({ className, value, children, disabled, onChange, ...props }, ref) => {
  const context = React.useContext(RadioGroupContext);

  if (!context) {
    throw new Error("RadioGroupItem debe usarse dentro de RadioGroup.");
  }

  const isDisabled = disabled || context.disabled;
  const checked = context.value === value;

  return (
    <label
      data-slot="radio-group-item"
      data-disabled={isDisabled || undefined}
      className={cn(
        "group inline-flex cursor-default select-none items-center gap-2",
        "font-ui text-ui leading-[13px] text-ink",
        "max-sm:min-h-6 max-sm:min-w-6",
        className,
      )}
    >
      <span className="relative inline-flex h-3 w-3 shrink-0">
        <input
          ref={ref}
          type="radio"
          name={context.name}
          value={value}
          checked={checked}
          required={context.required}
          disabled={isDisabled}
          onChange={(event) => {
            context.setValue(value);
            onChange?.(event);
          }}
          className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-default appearance-none rounded-full opacity-0"
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full bg-surface-sunken bevel-field",
            "peer-focus-visible:focus-dotted peer-focus-visible:outline-offset-[-2px]",
            "peer-disabled:bg-surface",
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink opacity-0",
            "peer-checked:opacity-100",
            "peer-disabled:bg-ink-disabled",
          )}
        />
      </span>
      {children ? (
        <span className={cn(isDisabled && "text-engraved")}>{children}</span>
      ) : null}
    </label>
  );
});

RadioGroupItem.displayName = "RadioGroupItem";
