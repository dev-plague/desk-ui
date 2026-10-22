import type { IconName } from "@deskui/ui";

import type { ThemeId } from "../theme";

/**
 * Modelo de datos del Page Builder. Es JSON puro: no contiene referencias al
 * DOM ni a React, de modo que se puede guardar, compartir, importar y exportar.
 */

export type BuilderBlockType =
  | "heading"
  | "text"
  | "list"
  | "badge"
  | "button"
  | "image"
  | "divider"
  | "spacer"
  | "input"
  | "textarea"
  | "checkbox"
  | "progress"
  | "alert"
  | "card"
  | "panel"
  | "window"
  | "group-box"
  | "columns"
  | "hero"
  | "status-bar";

export type BuilderCategory =
  | "texto"
  | "formularios"
  | "contenedores"
  | "feedback"
  | "composicion";

export type BuilderPropValue = string | number | boolean;

export type BuilderProps = Record<string, BuilderPropValue>;

export type BuilderBackground = "surface" | "sunken" | "desktop";

export type BuilderTheme = ThemeId;

export const BUILDER_THEMES: readonly ThemeId[] = [
  "classic",
  "gradient",
  "high-contrast",
  "desert",
  "rose",
  "storm",
];

export interface BuilderBlock {
  id: string;
  type: BuilderBlockType;
  props: BuilderProps;
  children?: BuilderBlock[];
}

export interface BuilderDocument {
  version: 1;
  title: string;
  theme: BuilderTheme;
  background: BuilderBackground;
  blocks: BuilderBlock[];
}

export interface BuilderSelectOption {
  value: string;
  label: string;
}

export type BuilderField =
  | {
      key: string;
      label: string;
      type: "text" | "textarea" | "number";
      placeholder?: string;
      help?: string;
    }
  | {
      key: string;
      label: string;
      type: "select";
      options: readonly BuilderSelectOption[];
      help?: string;
    }
  | {
      key: string;
      label: string;
      type: "checkbox";
      help?: string;
    };

export interface BuilderBlockDefinition {
  type: BuilderBlockType;
  label: string;
  description: string;
  category: BuilderCategory;
  icon: IconName;
  /** Un contenedor acepta bloques hijos y se puede usar como destino de drop. */
  container?: boolean;
  defaults: BuilderProps;
  fields: readonly BuilderField[];
  /** Texto corto para el árbol de capas y las etiquetas accesibles. */
  summary: (props: BuilderProps) => string;
}

export type BuilderDropPosition = "before" | "after" | "inside";

export const BUILDER_DND_MIME = "application/x-deskui-builder";

export type BuilderDragPayload =
  | { kind: "new"; type: BuilderBlockType }
  | { kind: "move"; id: string };

export function parseDragPayload(raw: string): BuilderDragPayload | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }
    const record = parsed as Record<string, unknown>;
    if (record.kind === "new" && typeof record.type === "string") {
      return { kind: "new", type: record.type as BuilderBlockType };
    }
    if (record.kind === "move" && typeof record.id === "string") {
      return { kind: "move", id: record.id };
    }
    return null;
  } catch {
    return null;
  }
}

export type BuilderDevice = "mobile" | "tablet" | "desktop";

export interface BuilderTemplate {
  id: string;
  label: string;
  description: string;
  /** Se muestra en el diálogo de plantillas. */
  highlights: readonly string[];
  create: () => BuilderDocument;
}

export const BUILDER_CATEGORY_LABELS: Record<BuilderCategory, string> = {
  texto: "Texto y medios",
  formularios: "Formularios",
  contenedores: "Contenedores",
  feedback: "Feedback",
  composicion: "Composición",
};

export const BUILDER_BACKGROUNDS: ReadonlyArray<{
  value: BuilderBackground;
  label: string;
}> = [
  { value: "surface", label: "Gris clásico" },
  { value: "sunken", label: "Blanco" },
  { value: "desktop", label: "Escritorio (teal)" },
];

export const BUILDER_DEVICES: ReadonlyArray<{
  value: BuilderDevice;
  label: string;
  width: number | null;
}> = [
  { value: "mobile", label: "Móvil", width: 390 },
  { value: "tablet", label: "Tablet", width: 768 },
  { value: "desktop", label: "Escritorio", width: null },
];
