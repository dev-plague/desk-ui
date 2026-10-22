import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Slider nativo (`input[type=range]`) con pista hundida de 4 px y thumb
 * rectangular de 11×21 px. La receta de los pseudo-elementos vive en
 * `tokens.css` para poder compartirla entre WebKit y Firefox.
 */
export interface SliderProps extends React.ComponentProps<"input"> {}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, type = "range", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="slider"
        className={cn("w95-slider block w-full max-sm:h-6", className)}
        {...props}
      />
    );
  },
);

Slider.displayName = "Slider";
