import * as React from "react";

import { useDeskUILocale } from "../lib/i18n";
import { cn } from "../lib/utils";

export interface ScreensaverProps extends React.ComponentProps<"div"> {
  title?: string;
  hint?: string;
  starCount?: number;
  onDismiss?: () => void;
}

const STARS = Array.from({ length: 48 }, (_, index) => {
  const seed = (index * 73 + 19) % 360;
  return {
    left: `${(seed * 1.618) % 100}%`,
    top: `${(seed * 2.414) % 100}%`,
    duration: 10 + (index % 7) * 2,
    delay: (index * 0.7) % 12,
    size: index % 9 === 0 ? 3 : 2,
  };
});

/**
 * Salvapantallas decorativo con campo de estrellas. Se cierra al hacer clic o
 * con Escape/Enter. Respeta `prefers-reduced-motion`.
 */
export const Screensaver = React.forwardRef<HTMLDivElement, ScreensaverProps>(
  (
    {
      className,
      title = "DeskUI",
      hint,
      starCount = STARS.length,
      onDismiss,
      ...props
    },
    ref,
  ) => {
    const { messages } = useDeskUILocale();
    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
      if (["Escape", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        onDismiss?.();
      }
    }

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        data-slot="screensaver"
        onClick={onDismiss}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative flex min-h-64 cursor-default select-none items-center justify-center",
          "overflow-hidden bg-ink font-ui text-ink-inverse",
          "focus-visible:focus-dotted focus-visible:outline-offset-[-4px]",
          className,
        )}
        {...props}
      >
        <div aria-hidden="true" className="absolute inset-[-48px]">
          {STARS.slice(0, starCount).map((star, index) => (
            <span
              key={index}
              className="w95-screensaver-star absolute bg-current"
              style={{
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                animationDuration: `${star.duration}s`,
                animationDelay: `-${star.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 grid justify-items-center gap-2 border-2 border-current px-6 py-4">
          <p className="m-0 text-[22px] font-bold leading-[26px]">{title}</p>
          <p className="m-0 text-[11px] leading-[14px]">
            {hint ?? messages.screensaver.hint}
          </p>
        </div>
      </div>
    );
  },
);

Screensaver.displayName = "Screensaver";
