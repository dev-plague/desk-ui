import type * as React from "react";

import { Icon } from "@deskui/ui";

type IconProps = Omit<React.ComponentProps<"svg">, "name">;

/** Envoltorios de los iconos del set de la librería para la demo. */
export function BrandMark(props: IconProps) {
  return <Icon name="window" {...props} />;
}

export function FolderIcon(props: IconProps) {
  return <Icon name="folder" {...props} />;
}

export function PaletteIcon(props: IconProps) {
  return <Icon name="palette" {...props} />;
}

export function InfoIcon(props: IconProps) {
  return <Icon name="info" {...props} />;
}

export function WarningIcon(props: IconProps) {
  return <Icon name="warning" {...props} />;
}

export function NoteIcon(props: IconProps) {
  return <Icon name="note" {...props} />;
}

export function SpeakerIcon(props: IconProps) {
  return <Icon name="speaker" {...props} />;
}
