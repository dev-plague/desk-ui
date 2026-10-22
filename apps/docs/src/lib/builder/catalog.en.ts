import type { BuilderBlockType, BuilderProps } from "./types";

function text(props: BuilderProps, key: string, fallback = ""): string {
  const value = props[key];
  return typeof value === "string" ? value : fallback;
}

function number(props: BuilderProps, key: string, fallback: number): number {
  const value = props[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

interface FieldTranslation {
  label?: string;
  placeholder?: string;
  help?: string;
  options?: Record<string, string>;
}

export interface BlockTranslation {
  label: string;
  description: string;
  defaults?: Partial<BuilderProps>;
  fields?: Record<string, FieldTranslation>;
  summary?: (props: BuilderProps) => string;
}

/**
 * Traducciones inglesas de las definiciones del Page Builder. La estructura y
 * los valores técnicos viven en `catalog.ts`; aquí solo cambia el texto.
 */
export const BLOCK_TRANSLATIONS_EN: Record<BuilderBlockType, BlockTranslation> = {
  heading: {
    label: "Heading",
    description: "Section heading with level and alignment.",
    defaults: { text: "Write a title" },
    fields: {
      text: { label: "Text" },
      level: {
        label: "Level",
        options: {
          h1: "H1 — main",
          h2: "H2 — section",
          h3: "H3 — subsection",
        },
      },
      align: {
        label: "Alignment",
        options: { left: "Left", center: "Center", right: "Right" },
      },
    },
  },
  text: {
    label: "Paragraph",
    description: "Body text with an option to mute it.",
    defaults: {
      text: "Write a paragraph to introduce the page content.",
    },
    fields: {
      text: { label: "Text" },
      align: {
        label: "Alignment",
        options: { left: "Left", center: "Center", right: "Right" },
      },
      muted: { label: "Secondary text" },
    },
  },
  list: {
    label: "List",
    description: "Bulleted or numbered list; one item per line.",
    summary: (props) => {
      const count = text(props, "items")
        .split("\n")
        .filter((item) => item.trim().length > 0).length;
      return `${count} item${count === 1 ? "" : "s"}`;
    },
    defaults: {
      items: "First item\nSecond item\nThird item",
    },
    fields: {
      items: { label: "Items", help: "One item per line." },
      style: {
        label: "Style",
        options: { bulleted: "Bulleted", numbered: "Numbered" },
      },
    },
  },
  badge: {
    label: "Badge",
    description: "Compact badge with a semantic status dot.",
    defaults: { text: "New" },
    fields: {
      text: { label: "Text" },
      variant: {
        label: "Variant",
        options: {
          default: "Normal",
          info: "Information",
          success: "Success",
          warning: "Warning",
          danger: "Danger",
        },
      },
    },
  },
  button: {
    label: "Button",
    description: "Classic default or primary action.",
    defaults: { label: "OK" },
    fields: {
      label: { label: "Text" },
      variant: {
        label: "Variant",
        options: { default: "Normal", primary: "Default" },
      },
      align: {
        label: "Alignment",
        options: { left: "Left", center: "Center", right: "Right" },
      },
    },
  },
  image: {
    label: "Illustration",
    description: "Framed pixel-art icon with a caption.",
    defaults: { caption: "Illustration" },
    fields: {
      name: {
        label: "Icon",
        options: {
          window: "Window",
          folder: "Folder",
          palette: "Palette",
          info: "Information",
          warning: "Warning",
          note: "Note",
          speaker: "Speaker",
        },
      },
      caption: { label: "Caption" },
      size: {
        label: "Size",
        options: { "16": "16 px", "32": "32 px" },
      },
    },
  },
  divider: {
    label: "Divider",
    description: "Classic horizontal groove between sections.",
    summary: () => "Divider",
  },
  spacer: {
    label: "Spacer",
    description: "Vertical spacing with no visible content.",
    summary: (props) => `Space ${text(props, "size", "md")}`,
    fields: {
      size: {
        label: "Height",
        options: { sm: "Small", md: "Medium", lg: "Large" },
      },
    },
  },
  input: {
    label: "Text field",
    description: "Input with label, type and placeholder.",
    defaults: { label: "Name", placeholder: "Type here" },
    fields: {
      label: { label: "Label" },
      placeholder: { label: "Placeholder" },
      inputType: {
        label: "Type",
        options: {
          text: "Text",
          email: "Email",
          password: "Password",
          number: "Number",
        },
      },
      required: { label: "Required" },
    },
  },
  textarea: {
    label: "Text area",
    description: "Textarea with label and number of rows.",
    defaults: { label: "Comments", placeholder: "Write a comment..." },
    fields: {
      label: { label: "Label" },
      placeholder: { label: "Placeholder" },
      rows: { label: "Rows" },
    },
  },
  checkbox: {
    label: "Checkbox",
    description: "Native checkbox with label and initial state.",
    defaults: { label: "Remember password" },
    fields: {
      label: { label: "Label" },
      checked: { label: "Checked by default" },
    },
  },
  progress: {
    label: "Progress",
    description: "Segmented bar with label and value.",
    defaults: { label: "Progress" },
    fields: {
      label: { label: "Label" },
      value: { label: "Value (0–100)" },
    },
  },
  alert: {
    label: "Alert",
    description: "Message with semantic stripe, title and description.",
    defaults: {
      title: "Alert",
      description: "Write the alert details here.",
    },
    fields: {
      variant: {
        label: "Variant",
        options: {
          default: "Normal",
          info: "Information",
          success: "Success",
          warning: "Warning",
          danger: "Danger",
        },
      },
      title: { label: "Title" },
      description: { label: "Description" },
    },
  },
  card: {
    label: "Card",
    description: "Container with header, description and content.",
    defaults: {
      title: "Card title",
      description: "A short description of the content.",
    },
    fields: {
      title: { label: "Title" },
      description: { label: "Description" },
    },
  },
  panel: {
    label: "Panel",
    description: "Container with configurable bevel and optional header.",
    fields: {
      title: { label: "Title" },
      variant: {
        label: "Bevel",
        options: {
          raised: "Raised",
          sunken: "Sunken",
          window: "Window",
          flat: "Flat",
        },
      },
    },
  },
  window: {
    label: "Window",
    description: "Full window with title bar, body and status.",
    defaults: { title: "Untitled" },
    fields: {
      title: { label: "Title" },
      status: { label: "Status bar" },
      active: { label: "Active window" },
    },
  },
  "group-box": {
    label: "Group box",
    description: "Classic fieldset with the legend on the border.",
    defaults: { legend: "Group" },
    fields: {
      legend: { label: "Legend" },
    },
  },
  columns: {
    label: "Columns",
    description: "Distributes child blocks into two or three columns.",
    summary: (props) => `${number(props, "columns", 2)} columns`,
    fields: {
      columns: {
        label: "Columns",
        options: { "2": "Two columns", "3": "Three columns" },
      },
    },
  },
  hero: {
    label: "Hero",
    description: "Page header with eyebrow, title, text and button.",
    defaults: {
      eyebrow: "Featured section",
      title: "A title that introduces the page",
      description:
        "Explain in one or two sentences what visitors will find on this page.",
      buttonLabel: "Get started",
    },
    fields: {
      eyebrow: { label: "Eyebrow" },
      title: { label: "Title" },
      description: { label: "Description" },
      buttonLabel: { label: "Button" },
      buttonVariant: {
        label: "Button variant",
        options: { default: "Normal", primary: "Default" },
      },
      align: {
        label: "Alignment",
        options: { left: "Left", center: "Center", right: "Right" },
      },
    },
  },
  "status-bar": {
    label: "Status bar",
    description: "Segmented bar with two text fields.",
    defaults: { left: "Ready." },
    fields: {
      left: { label: "Left field" },
      right: { label: "Right field" },
    },
  },
};
