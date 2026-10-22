import * as React from "react";

import { cn } from "../lib/utils";

export interface ProgressBarProps extends React.ComponentProps<"div"> {
  value?: number;
  max?: number;
  segmented?: boolean;
}

/**
 * Barra de progreso clásica: marco hundido y bloques azules separados por un
 * píxel. El tamaño del bloque se controla desde tokens.css.
 */
export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    { className, value = 0, max = 100, segmented = true, ...props },
    ref,
  ) => {
    const safeMax = max > 0 ? max : 100;
    const clamped = Math.min(Math.max(value, 0), safeMax);
    const percent = (clamped / safeMax) * 100;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clamped}
        data-slot="progress-bar"
        className={cn(
          "bevel-sunken h-6 w-full overflow-hidden bg-surface p-1",
          className,
        )}
        {...props}
      >
        <div
          data-slot="progress-bar-indicator"
          className={cn(
            "h-full",
            segmented ? "w95-progress-segmented bg-transparent" : "bg-accent",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    );
  },
);

ProgressBar.displayName = "ProgressBar";
