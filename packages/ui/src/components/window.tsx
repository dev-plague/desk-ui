import * as React from "react";

import { cn } from "../lib/utils";
import {
  StatusBar,
  StatusBarField,
  type StatusBarFieldProps,
  type StatusBarProps,
} from "./status-bar";
import { TitleBar, type TitleBarProps } from "./title-bar";

type WindowContextValue = {
  active: boolean;
};

const WindowContext = React.createContext<WindowContextValue>({
  active: true,
});

export interface WindowProps extends React.ComponentProps<"section"> {
  /** Inactive windows use the grey title bar treatment. */
  active?: boolean;
}

const WindowRoot = React.forwardRef<HTMLElement, WindowProps>(
  ({ className, active = true, ...props }, ref) => {
    return (
      <WindowContext.Provider value={{ active }}>
        <section
          ref={ref}
          data-slot="window"
          data-active={active}
          className={cn(
            "bevel-window relative box-border bg-surface p-[3px]",
            "font-ui text-ui text-ink",
            className,
          )}
          {...props}
        />
      </WindowContext.Provider>
    );
  },
);

WindowRoot.displayName = "Window";

export type WindowTitleBarProps = TitleBarProps;

export const WindowTitleBar = React.forwardRef<
  HTMLDivElement,
  WindowTitleBarProps
>(({ active, ...props }, ref) => {
  const context = React.useContext(WindowContext);

  return (
    <TitleBar
      ref={ref}
      active={active ?? context.active}
      data-slot="window-titlebar"
      {...props}
    />
  );
});

WindowTitleBar.displayName = "Window.TitleBar";

export interface WindowBodyProps extends React.ComponentProps<"div"> {
  /** Apply the classic 8px window-body margin. Defaults to true. */
  padded?: boolean;
}

export const WindowBody = React.forwardRef<HTMLDivElement, WindowBodyProps>(
  ({ className, padded = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="window-body"
        className={cn("min-w-0", padded && "m-2", className)}
        {...props}
      />
    );
  },
);

WindowBody.displayName = "Window.Body";

export type WindowStatusBarProps = StatusBarProps;

export const WindowStatusBar = React.forwardRef<
  HTMLDivElement,
  WindowStatusBarProps
>(({ className, ...props }, ref) => (
  <StatusBar
    ref={ref}
    data-slot="window-statusbar"
    className={cn("mx-[1px] mt-[3px]", className)}
    {...props}
  />
));

WindowStatusBar.displayName = "Window.StatusBar";

export type WindowStatusFieldProps = StatusBarFieldProps;

export const WindowStatusField = React.forwardRef<
  HTMLDivElement,
  WindowStatusFieldProps
>(({ className, ...props }, ref) => (
  <StatusBarField
    ref={ref}
    data-slot="window-status-field"
    className={className}
    {...props}
  />
));

WindowStatusField.displayName = "Window.StatusField";

type WindowComponent = typeof WindowRoot & {
  TitleBar: typeof WindowTitleBar;
  Body: typeof WindowBody;
  StatusBar: typeof WindowStatusBar;
  StatusField: typeof WindowStatusField;
};

/**
 * Composable window shell:
 *
 * ```tsx
 * <Window active>
 *   <Window.TitleBar title="Documento" onClose={close} />
 *   <Window.Body>...</Window.Body>
 *   <Window.StatusBar>
 *     <Window.StatusField>Listo</Window.StatusField>
 *   </Window.StatusBar>
 * </Window>
 * ```
 */
export const Window = Object.assign(WindowRoot, {
  TitleBar: WindowTitleBar,
  Body: WindowBody,
  StatusBar: WindowStatusBar,
  StatusField: WindowStatusField,
}) as WindowComponent;

export { WindowRoot };
