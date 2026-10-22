import type { Locale } from "../../i18n/messages";
import { BLOCK_TRANSLATIONS_EN } from "./catalog.en";
import type {
  BuilderBlockDefinition,
  BuilderBlockType,
  BuilderCategory,
  BuilderProps,
} from "./types";

export function propString(
  props: BuilderProps,
  key: string,
  fallback = "",
): string {
  const value = props[key];
  return typeof value === "string" ? value : fallback;
}

export function propNumber(
  props: BuilderProps,
  key: string,
  fallback = 0,
): number {
  const value = props[key];
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

export function propBoolean(
  props: BuilderProps,
  key: string,
  fallback = false,
): boolean {
  const value = props[key];
  return typeof value === "boolean" ? value : fallback;
}

function summarize(value: string, max = 60): string {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

const ALIGN_OPTIONS = [
  { value: "left", label: "Izquierda" },
  { value: "center", label: "Centro" },
  { value: "right", label: "Derecha" },
] as const;

const VARIANT_OPTIONS = [
  { value: "default", label: "Normal" },
  { value: "info", label: "Información" },
  { value: "success", label: "Éxito" },
  { value: "warning", label: "Aviso" },
  { value: "danger", label: "Peligro" },
] as const;

const ICON_OPTIONS = [
  { value: "window", label: "Ventana" },
  { value: "folder", label: "Carpeta" },
  { value: "palette", label: "Paleta" },
  { value: "info", label: "Información" },
  { value: "warning", label: "Aviso" },
  { value: "note", label: "Nota" },
  { value: "speaker", label: "Altavoz" },
] as const;

export const BUILDER_ICON_NAMES: readonly string[] = ICON_OPTIONS.map(
  (option) => option.value,
);

const definitions = {
  heading: {
    type: "heading",
    label: "Título",
    description: "Encabezado de sección con nivel y alineación.",
    category: "texto",
    icon: "note",
    defaults: {
      text: "Escribe un título",
      level: "h2",
      align: "left",
    },
    fields: [
      { key: "text", label: "Texto", type: "text" },
      {
        key: "level",
        label: "Nivel",
        type: "select",
        options: [
          { value: "h1", label: "H1 — principal" },
          { value: "h2", label: "H2 — sección" },
          { value: "h3", label: "H3 — apartado" },
        ],
      },
      { key: "align", label: "Alineación", type: "select", options: ALIGN_OPTIONS },
    ],
    summary: (props) => propString(props, "text", "Título"),
  },
  text: {
    type: "text",
    label: "Párrafo",
    description: "Texto corrido con opción de atenuarlo.",
    category: "texto",
    icon: "note",
    defaults: {
      text: "Escribe un párrafo para presentar el contenido de la página.",
      align: "left",
      muted: false,
    },
    fields: [
      { key: "text", label: "Texto", type: "textarea" },
      { key: "align", label: "Alineación", type: "select", options: ALIGN_OPTIONS },
      { key: "muted", label: "Texto secundario", type: "checkbox" },
    ],
    summary: (props) => summarize(propString(props, "text", "Párrafo")),
  },
  list: {
    type: "list",
    label: "Lista",
    description: "Lista con viñetas o numerada; un elemento por línea.",
    category: "texto",
    icon: "folder",
    defaults: {
      items: "Primer elemento\nSegundo elemento\nTercer elemento",
      style: "bulleted",
    },
    fields: [
      {
        key: "items",
        label: "Elementos",
        type: "textarea",
        help: "Un elemento por línea.",
      },
      {
        key: "style",
        label: "Estilo",
        type: "select",
        options: [
          { value: "bulleted", label: "Con viñetas" },
          { value: "numbered", label: "Numerada" },
        ],
      },
    ],
    summary: (props) => {
      const items = propString(props, "items")
        .split("\n")
        .filter((item) => item.trim().length > 0);
      return `${items.length} elemento${items.length === 1 ? "" : "s"}`;
    },
  },
  badge: {
    type: "badge",
    label: "Etiqueta",
    description: "Badge compacto con un punto de estado semántico.",
    category: "texto",
    icon: "info",
    defaults: { text: "Nuevo", variant: "info" },
    fields: [
      { key: "text", label: "Texto", type: "text" },
      { key: "variant", label: "Variante", type: "select", options: VARIANT_OPTIONS },
    ],
    summary: (props) => propString(props, "text", "Etiqueta"),
  },
  button: {
    type: "button",
    label: "Botón",
    description: "Acción clásica normal o predeterminada.",
    category: "texto",
    icon: "window",
    defaults: {
      label: "Aceptar",
      variant: "primary",
      align: "left",
    },
    fields: [
      { key: "label", label: "Texto", type: "text" },
      {
        key: "variant",
        label: "Variante",
        type: "select",
        options: [
          { value: "default", label: "Normal" },
          { value: "primary", label: "Predeterminado" },
        ],
      },
      { key: "align", label: "Alineación", type: "select", options: ALIGN_OPTIONS },
    ],
    summary: (props) => propString(props, "label", "Botón"),
  },
  image: {
    type: "image",
    label: "Ilustración",
    description: "Icono pixel-art enmarcado con pie de foto.",
    category: "texto",
    icon: "palette",
    defaults: { name: "folder", caption: "Ilustración", size: 32 },
    fields: [
      { key: "name", label: "Icono", type: "select", options: ICON_OPTIONS },
      { key: "caption", label: "Pie de foto", type: "text" },
      {
        key: "size",
        label: "Tamaño",
        type: "select",
        options: [
          { value: "16", label: "16 px" },
          { value: "32", label: "32 px" },
        ],
      },
    ],
    summary: (props) => propString(props, "caption", "Ilustración"),
  },
  divider: {
    type: "divider",
    label: "Separador",
    description: "Ranura horizontal clásica entre secciones.",
    category: "texto",
    icon: "note",
    defaults: {},
    fields: [],
    summary: () => "Separador",
  },
  spacer: {
    type: "spacer",
    label: "Espaciador",
    description: "Separación vertical sin contenido visible.",
    category: "texto",
    icon: "note",
    defaults: { size: "md" },
    fields: [
      {
        key: "size",
        label: "Altura",
        type: "select",
        options: [
          { value: "sm", label: "Pequeña" },
          { value: "md", label: "Media" },
          { value: "lg", label: "Grande" },
        ],
      },
    ],
    summary: (props) => `Espacio ${propString(props, "size", "md")}`,
  },
  input: {
    type: "input",
    label: "Campo de texto",
    description: "Input con etiqueta, tipo y placeholder.",
    category: "formularios",
    icon: "note",
    defaults: {
      label: "Nombre",
      placeholder: "Escribe aquí",
      inputType: "text",
      required: false,
    },
    fields: [
      { key: "label", label: "Etiqueta", type: "text" },
      { key: "placeholder", label: "Placeholder", type: "text" },
      {
        key: "inputType",
        label: "Tipo",
        type: "select",
        options: [
          { value: "text", label: "Texto" },
          { value: "email", label: "Correo" },
          { value: "password", label: "Contraseña" },
          { value: "number", label: "Número" },
        ],
      },
      { key: "required", label: "Obligatorio", type: "checkbox" },
    ],
    summary: (props) => propString(props, "label", "Campo"),
  },
  textarea: {
    type: "textarea",
    label: "Área de texto",
    description: "Textarea con etiqueta y número de filas.",
    category: "formularios",
    icon: "note",
    defaults: {
      label: "Comentarios",
      placeholder: "Escribe un comentario...",
      rows: 3,
    },
    fields: [
      { key: "label", label: "Etiqueta", type: "text" },
      { key: "placeholder", label: "Placeholder", type: "text" },
      { key: "rows", label: "Filas", type: "number" },
    ],
    summary: (props) => propString(props, "label", "Área de texto"),
  },
  checkbox: {
    type: "checkbox",
    label: "Casilla",
    description: "Checkbox nativo con etiqueta y estado inicial.",
    category: "formularios",
    icon: "note",
    defaults: { label: "Recordar contraseña", checked: false },
    fields: [
      { key: "label", label: "Etiqueta", type: "text" },
      { key: "checked", label: "Marcada por defecto", type: "checkbox" },
    ],
    summary: (props) => propString(props, "label", "Casilla"),
  },
  progress: {
    type: "progress",
    label: "Progreso",
    description: "Barra segmentada con etiqueta y valor.",
    category: "formularios",
    icon: "window",
    defaults: { label: "Progreso", value: 60 },
    fields: [
      { key: "label", label: "Etiqueta", type: "text" },
      { key: "value", label: "Valor (0–100)", type: "number" },
    ],
    summary: (props) => propString(props, "label", "Progreso"),
  },
  alert: {
    type: "alert",
    label: "Aviso",
    description: "Mensaje con franja semántica, título y descripción.",
    category: "feedback",
    icon: "warning",
    defaults: {
      variant: "info",
      title: "Aviso",
      description: "Escribe aquí el detalle del aviso.",
    },
    fields: [
      { key: "variant", label: "Variante", type: "select", options: VARIANT_OPTIONS },
      { key: "title", label: "Título", type: "text" },
      { key: "description", label: "Descripción", type: "textarea" },
    ],
    summary: (props) => propString(props, "title", "Aviso"),
  },
  card: {
    type: "card",
    label: "Tarjeta",
    description: "Contenedor con cabecera, descripción y contenido.",
    category: "contenedores",
    icon: "folder",
    container: true,
    defaults: {
      title: "Título de la tarjeta",
      description: "Una descripción breve del contenido.",
    },
    fields: [
      { key: "title", label: "Título", type: "text" },
      { key: "description", label: "Descripción", type: "textarea" },
    ],
    summary: (props) => propString(props, "title", "Tarjeta"),
  },
  panel: {
    type: "panel",
    label: "Panel",
    description: "Contenedor con bisel configurable y cabecera opcional.",
    category: "contenedores",
    icon: "window",
    container: true,
    defaults: { title: "Panel", variant: "raised" },
    fields: [
      { key: "title", label: "Título", type: "text" },
      {
        key: "variant",
        label: "Bisel",
        type: "select",
        options: [
          { value: "raised", label: "Elevado" },
          { value: "sunken", label: "Hundido" },
          { value: "window", label: "Ventana" },
          { value: "flat", label: "Plano" },
        ],
      },
    ],
    summary: (props) => propString(props, "title", "Panel"),
  },
  window: {
    type: "window",
    label: "Ventana",
    description: "Ventana completa con barra de título, cuerpo y estado.",
    category: "contenedores",
    icon: "window",
    container: true,
    defaults: { title: "Sin título", status: "", active: true },
    fields: [
      { key: "title", label: "Título", type: "text" },
      { key: "status", label: "Barra de estado", type: "text" },
      { key: "active", label: "Ventana activa", type: "checkbox" },
    ],
    summary: (props) => propString(props, "title", "Ventana"),
  },
  "group-box": {
    type: "group-box",
    label: "Group box",
    description: "Fieldset clásico con la leyenda sobre el borde.",
    category: "contenedores",
    icon: "note",
    container: true,
    defaults: { legend: "Grupo" },
    fields: [{ key: "legend", label: "Leyenda", type: "text" }],
    summary: (props) => propString(props, "legend", "Grupo"),
  },
  columns: {
    type: "columns",
    label: "Columnas",
    description: "Distribuye los bloques hijos en dos o tres columnas.",
    category: "contenedores",
    icon: "window",
    container: true,
    defaults: { columns: 2 },
    fields: [
      {
        key: "columns",
        label: "Columnas",
        type: "select",
        options: [
          { value: "2", label: "Dos columnas" },
          { value: "3", label: "Tres columnas" },
        ],
      },
    ],
    summary: (props) => `${propNumber(props, "columns", 2)} columnas`,
  },
  hero: {
    type: "hero",
    label: "Hero",
    description: "Cabecera de página con antetítulo, título, texto y botón.",
    category: "composicion",
    icon: "palette",
    defaults: {
      eyebrow: "Sección destacada",
      title: "Un título que presenta la página",
      description:
        "Explica en una o dos frases qué encontrará la persona que visite esta página.",
      buttonLabel: "Empezar",
      buttonVariant: "primary",
      align: "left",
    },
    fields: [
      { key: "eyebrow", label: "Antetítulo", type: "text" },
      { key: "title", label: "Título", type: "text" },
      { key: "description", label: "Descripción", type: "textarea" },
      { key: "buttonLabel", label: "Botón", type: "text" },
      {
        key: "buttonVariant",
        label: "Variante del botón",
        type: "select",
        options: [
          { value: "default", label: "Normal" },
          { value: "primary", label: "Predeterminado" },
        ],
      },
      { key: "align", label: "Alineación", type: "select", options: ALIGN_OPTIONS },
    ],
    summary: (props) => propString(props, "title", "Hero"),
  },
  "status-bar": {
    type: "status-bar",
    label: "Barra de estado",
    description: "Barra segmentada con dos campos de texto.",
    category: "composicion",
    icon: "info",
    defaults: { left: "Listo.", right: "DeskUI" },
    fields: [
      { key: "left", label: "Campo izquierdo", type: "text" },
      { key: "right", label: "Campo derecho", type: "text" },
    ],
    summary: (props) => propString(props, "left", "Barra de estado"),
  },
} satisfies Record<BuilderBlockType, BuilderBlockDefinition>;

export const BLOCK_DEFINITIONS: readonly BuilderBlockDefinition[] =
  Object.values(definitions);

export const BLOCK_DEFINITION_BY_TYPE = definitions;

function localizeDefinition(
  definition: BuilderBlockDefinition,
  locale: Locale,
): BuilderBlockDefinition {
  if (locale === "es") {
    return definition;
  }

  const translation = BLOCK_TRANSLATIONS_EN[definition.type];
  if (!translation) {
    return definition;
  }

  return {
    ...definition,
    label: translation.label,
    description: translation.description,
    defaults: { ...definition.defaults, ...translation.defaults } as BuilderProps,
    summary: translation.summary ?? definition.summary,
    fields: definition.fields.map((field) => {
      const fieldTranslation = translation.fields?.[field.key];
      if (!fieldTranslation) {
        return field;
      }

      if (field.type === "select") {
        return {
          ...field,
          label: fieldTranslation.label ?? field.label,
          help: fieldTranslation.help ?? field.help,
          options: field.options.map((option) => ({
            ...option,
            label:
              fieldTranslation.options?.[option.value] ?? option.label,
          })),
        };
      }

      return {
        ...field,
        label: fieldTranslation.label ?? field.label,
        placeholder:
          fieldTranslation.placeholder ??
          ("placeholder" in field ? field.placeholder : undefined),
        help: fieldTranslation.help ?? field.help,
      };
    }),
  };
}

export function getBlockDefinition(
  type: BuilderBlockType,
  locale: Locale = "es",
): BuilderBlockDefinition {
  return localizeDefinition(definitions[type], locale);
}

export function getBlockDefinitions(
  locale: Locale = "es",
): readonly BuilderBlockDefinition[] {
  return BLOCK_DEFINITIONS.map((definition) =>
    localizeDefinition(definition, locale),
  );
}

export const BUILDER_CATEGORIES: readonly BuilderCategory[] = [
  "texto",
  "formularios",
  "contenedores",
  "feedback",
  "composicion",
];

export function isBuilderBlockType(value: unknown): value is BuilderBlockType {
  return typeof value === "string" && value in definitions;
}
