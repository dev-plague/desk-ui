import * as React from "react";

import { cn } from "../lib/utils";

export type IconName =
  | "window"
  | "folder"
  | "palette"
  | "info"
  | "warning"
  | "note"
  | "speaker";

const ICONS: Record<IconName, React.ReactNode> = {
  window: (
    <>
      <rect x="1" y="1" width="14" height="14" fill="#000000" />
      <rect x="2" y="2" width="12" height="12" fill="#c0c0c0" />
      <rect x="2" y="2" width="12" height="3" fill="#000080" />
      <rect x="3" y="3" width="10" height="1" fill="#1084d0" />
      <rect x="4" y="7" width="3" height="3" fill="#000080" />
      <rect x="9" y="7" width="3" height="3" fill="#000080" />
      <rect x="4" y="11" width="3" height="2" fill="#808080" />
      <rect x="9" y="11" width="3" height="2" fill="#808080" />
    </>
  ),
  folder: (
    <>
      <path fill="#000000" d="M1 4h5V3h4v1h5v10H1z" />
      <path fill="#808000" d="M2 5h4V4h4v1h4v8H2z" />
      <path fill="#ffff00" d="M2 6h12v6H2z" />
      <path fill="#ffffcc" d="M2 6h12v1H2z" />
    </>
  ),
  palette: (
    <>
      <rect x="1" y="1" width="14" height="14" fill="#000000" />
      <rect x="2" y="2" width="5" height="5" fill="#000080" />
      <rect x="9" y="2" width="5" height="5" fill="#008080" />
      <rect x="2" y="9" width="5" height="5" fill="#808000" />
      <rect x="9" y="9" width="5" height="5" fill="#800000" />
    </>
  ),
  info: (
    <>
      <path
        fill="#000000"
        d="M6 1h4v1h2v2h1v4h-1v2h-2v1H6v-1H4v-2H3V6h1V4h2V1z"
      />
      <path
        fill="#000080"
        d="M6 2h4v1h2v2h1v4h-1v2h-2v1H6v-1H4v-2H3V6h1V4h2V2z"
      />
      <rect x="7" y="4" width="2" height="2" fill="#ffffff" />
      <rect x="7" y="7" width="2" height="4" fill="#ffffff" />
    </>
  ),
  warning: (
    <>
      <path
        fill="#000000"
        d="M8 1h1v1h1v1h1v1h1v1h1v1h1v2h1v7H1V8h1V6h1V5h1V4h1V3h1V2h1V1z"
      />
      <path
        fill="#ffff00"
        d="M8 2h1v1h1v1h1v1h1v1h1v2h1v6H2V8h1V6h1V5h1V4h1V3h1V2z"
      />
      <rect x="7" y="5" width="2" height="4" fill="#000000" />
      <rect x="7" y="10" width="2" height="2" fill="#000000" />
    </>
  ),
  note: (
    <>
      <path fill="#000000" d="M2 1h8l4 4v10H2z" />
      <path fill="#ffffff" d="M3 2h6v4h3v8H3z" />
      <path fill="#808080" d="M10 2h1v3h3v1h-4z" />
      <rect x="4" y="7" width="6" height="1" fill="#808080" />
      <rect x="4" y="9" width="6" height="1" fill="#808080" />
      <rect x="4" y="11" width="4" height="1" fill="#808080" />
    </>
  ),
  speaker: (
    <>
      <path fill="#000000" d="M1 6h3l4-3v10l-4-3H1z" />
      <path fill="#c0c0c0" d="M2 7h2l2-1v4l-2-1H2z" />
      <rect x="10" y="5" width="1" height="1" fill="#000000" />
      <rect x="11" y="6" width="1" height="4" fill="#000000" />
      <rect x="10" y="10" width="1" height="1" fill="#000000" />
      <rect x="12" y="4" width="1" height="8" fill="#808080" />
    </>
  ),
};

export interface IconProps
  extends Omit<React.ComponentProps<"svg">, "name"> {
  name: IconName;
  /** Si se indica, el icono se anuncia como imagen con este nombre. */
  label?: string;
  size?: 16 | 32;
}

/** Set original de iconos pixel-art 16×16, escalable a 32×32. */
export function Icon({
  name,
  label,
  size = 16,
  className,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      focusable="false"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        size === 32 ? "h-8 w-8" : "h-4 w-4",
        "shrink-0",
        className,
      )}
      {...props}
    >
      {ICONS[name]}
    </svg>
  );
}
