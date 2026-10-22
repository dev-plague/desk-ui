import * as React from "react";

import { Button } from "./button";
import { useDeskUILocale } from "../lib/i18n";
import { cn } from "../lib/utils";

export interface BlueScreenProps extends React.ComponentProps<"div"> {
  title?: string;
  message?: React.ReactNode;
  code?: string;
  hint?: string;
  onRestart?: () => void;
  restartLabel?: string;
}

/**
 * Pantalla azul de error. Usa los tokens de acento e inverso para mantener el
 * contraste en todos los temas, incluido alto contraste.
 */
export const BlueScreen = React.forwardRef<HTMLDivElement, BlueScreenProps>(
  (
    {
      className,
      title,
      message,
      code = "ERROR 0E : 016F : BFF9B3D4",
      hint,
      onRestart,
      restartLabel,
      ...props
    },
    ref,
  ) => {
    const { messages } = useDeskUILocale();
    const labels = messages.blueScreen;
    return (
      <div
        ref={ref}
        role="alert"
        data-slot="blue-screen"
        className={cn(
          "flex min-h-64 flex-col items-center justify-center gap-4",
          "bg-accent p-6 font-mono text-[12px] leading-[18px] text-ink-inverse",
          className,
        )}
        {...props}
      >
        <div className="w-full max-w-xl">
          <p className="bg-surface px-2 py-1 text-center font-ui text-[12px] font-bold text-ink">
            {title ?? labels.title}
          </p>
          <div className="mt-3 grid gap-3">
            <p className="m-0">{message ?? labels.message}</p>
            {code ? (
              <p className="m-0 border border-current px-2 py-1 text-center">
                {code}
              </p>
            ) : null}
            <p className="m-0 text-center">{hint ?? labels.hint}</p>
            {onRestart ? (
              <div className="flex justify-center">
                <Button size="sm" onClick={onRestart}>
                  {restartLabel ?? labels.restart}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);

BlueScreen.displayName = "BlueScreen";
