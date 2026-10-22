import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "../lib/utils";
import { Label } from "./label";

const Form = FormProvider;

type FormFieldContextValue = {
  name: string;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null,
);

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

/**
 * Campo conectado a React Hook Form. El render prop recibe `field` y puede
 * componer `FormItem`, `FormLabel`, `FormControl`, `FormDescription` y
 * `FormMessage`.
 */
export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

export function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField debe usarse dentro de FormField.");
  }

  if (!itemContext) {
    throw new Error("useFormField debe usarse dentro de FormItem.");
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

export interface FormItemProps extends React.ComponentProps<"div"> {}

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div
          ref={ref}
          data-slot="form-item"
          className={cn("grid gap-1", className)}
          {...props}
        />
      </FormItemContext.Provider>
    );
  },
);

FormItem.displayName = "FormItem";

export interface FormLabelProps
  extends React.ComponentProps<typeof Label> {}

export const FormLabel = React.forwardRef<
  HTMLLabelElement,
  FormLabelProps
>(({ className, ...props }, ref) => {
  const { formItemId, error } = useFormField();

  return (
    <Label
      ref={ref}
      htmlFor={formItemId}
      data-slot="form-label"
      className={cn(error && "text-danger", className)}
      {...props}
    />
  );
});

FormLabel.displayName = "FormLabel";

export interface FormControlProps extends React.ComponentProps<typeof Slot> {}

export const FormControl = React.forwardRef<
  React.ComponentRef<typeof Slot>,
  FormControlProps
>(({ ...props }, ref) => {
  const { formItemId, formDescriptionId, formMessageId, error } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={`${formDescriptionId} ${formMessageId}`}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  );
});

FormControl.displayName = "FormControl";

export interface FormDescriptionProps extends React.ComponentProps<"p"> {}

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      data-slot="form-description"
      className={cn(
        "text-[10px] leading-[13px] text-ink-muted",
        className,
      )}
      {...props}
    />
  );
});

FormDescription.displayName = "FormDescription";

export interface FormMessageProps extends React.ComponentProps<"p"> {}

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  FormMessageProps
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error?.message
    ? String(error.message)
    : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      data-slot="form-message"
      role={error ? "alert" : undefined}
      className={cn(
        "text-[10px] leading-[13px] text-danger",
        className,
      )}
      {...props}
    >
      {body}
    </p>
  );
});

FormMessage.displayName = "FormMessage";

export {
  Form,
  FormFieldContext,
  FormItemContext,
};
