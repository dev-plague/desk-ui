import {
  BUILDER_ICON_NAMES,
  propBoolean,
  propNumber,
  propString,
} from "./catalog";
import { serializeBuilderDocument } from "./model";
import type {
  BuilderBlock,
  BuilderBlockType,
  BuilderDocument,
} from "./types";

interface ImportSpec {
  from: string;
  names: readonly string[];
}

const IMPORT_SPECS: Record<BuilderBlockType, readonly ImportSpec[]> = {
  heading: [],
  text: [],
  list: [],
  badge: [{ from: "badge", names: ["Badge"] }],
  button: [{ from: "button", names: ["Button"] }],
  image: [{ from: "icon", names: ["Icon"] }],
  divider: [{ from: "separator", names: ["Separator"] }],
  spacer: [],
  input: [
    { from: "input", names: ["Input"] },
    { from: "label", names: ["Label"] },
  ],
  textarea: [
    { from: "label", names: ["Label"] },
    { from: "textarea", names: ["Textarea"] },
  ],
  checkbox: [{ from: "checkbox", names: ["Checkbox"] }],
  progress: [{ from: "progress-bar", names: ["ProgressBar"] }],
  alert: [
    {
      from: "alert",
      names: ["Alert", "AlertDescription", "AlertTitle"],
    },
  ],
  card: [{ from: "card", names: ["Card", "CardContent"] }],
  panel: [{ from: "panel", names: ["Panel", "PanelBody"] }],
  window: [{ from: "window", names: ["Window"] }],
  "group-box": [{ from: "group-box", names: ["GroupBox"] }],
  columns: [],
  hero: [{ from: "button", names: ["Button"] }],
  "status-bar": [
    { from: "status-bar", names: ["StatusBar", "StatusBarField"] },
  ],
};

const REGISTRY_ITEMS: Record<BuilderBlockType, readonly string[]> = {
  heading: [],
  text: [],
  list: [],
  badge: ["badge"],
  button: ["button"],
  image: ["icon"],
  divider: ["separator"],
  spacer: [],
  input: ["input", "label"],
  textarea: ["label", "textarea"],
  checkbox: ["checkbox"],
  progress: ["progress-bar"],
  alert: ["alert"],
  card: ["card"],
  panel: ["panel"],
  window: ["window"],
  "group-box": ["group-box"],
  columns: [],
  hero: ["button"],
  "status-bar": ["status-bar"],
};

const ALIGN_TEXT: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const ALIGN_FLEX: Record<string, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

function walk(blocks: readonly BuilderBlock[], visit: (block: BuilderBlock) => void) {
  for (const block of blocks) {
    visit(block);
    walk(block.children ?? [], visit);
  }
}

export function collectRegistryItems(
  blocks: readonly BuilderBlock[],
): string[] {
  const items = new Set<string>();
  walk(blocks, (block) => {
    for (const item of REGISTRY_ITEMS[block.type]) {
      items.add(item);
    }
  });
  return [...items].sort((a, b) => a.localeCompare(b, "en"));
}

export function generateAddCommands(document: BuilderDocument): string {
  const items = collectRegistryItems(document.blocks);
  const lines = ["npx @deskui/cli init"];
  if (items.length > 0) {
    lines.push(`npx @deskui/cli add ${items.join(" ")}`);
  }
  return lines.join("\n");
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;");
}

function escapeAttribute(value: string): string {
  return escapeText(value).replace(/"/g, "&quot;");
}

function fieldId(block: BuilderBlock, suffix: string): string {
  return `${suffix}-${block.id}`;
}

function valueOr(value: string, fallback: string): string {
  return value.trim().length > 0 ? value : fallback;
}

function indent(level: number): string {
  return "  ".repeat(level);
}

function pushLines(target: string[], level: number, lines: readonly string[]) {
  for (const line of lines) {
    target.push(`${indent(level)}${line}`);
  }
}

function renderChildren(
  block: BuilderBlock,
  level: number,
  target: string[],
) {
  for (const child of block.children ?? []) {
    renderBlock(child, level, target);
  }
}

function renderBlock(block: BuilderBlock, level: number, target: string[]) {
  const props = block.props;

  switch (block.type) {
    case "heading": {
      const tag = valueOr(propString(props, "level", "h2"), "h2");
      const size =
        tag === "h1"
          ? "text-[18px] leading-[22px]"
          : tag === "h3"
            ? "text-[13px] leading-[16px]"
            : "text-[15px] leading-[19px]";
      const align = ALIGN_TEXT[propString(props, "align", "left")] ?? "text-left";
      pushLines(target, level, [
        `<${tag} className="${size} font-bold ${align}">${escapeText(
          propString(props, "text", "Título"),
        )}</${tag}>`,
      ]);
      return;
    }

    case "text": {
      const align = ALIGN_TEXT[propString(props, "align", "left")] ?? "text-left";
      const muted = propBoolean(props, "muted") ? " text-ink-muted" : "";
      pushLines(target, level, [
        `<p className="whitespace-pre-line text-[12px] leading-[16px]${muted} ${align}">${escapeText(
          propString(props, "text"),
        )}</p>`,
      ]);
      return;
    }

    case "list": {
      const numbered = propString(props, "style") === "numbered";
      const tag = numbered ? "ol" : "ul";
      const items = propString(props, "items")
        .split("\n")
        .filter((item) => item.trim().length > 0);
      pushLines(target, level, [
        `<${tag} className="grid gap-1 pl-4 text-[11px] leading-[15px] ${
          numbered ? "list-decimal" : "list-disc"
        }">`,
      ]);
      for (const item of items) {
        pushLines(target, level + 1, [`<li>${escapeText(item)}</li>`]);
      }
      pushLines(target, level, [`</${tag}>`]);
      return;
    }

    case "badge": {
      const variant = propString(props, "variant", "default");
      pushLines(target, level, [
        `<Badge variant="${escapeAttribute(variant)}">${escapeText(
          propString(props, "text", "Etiqueta"),
        )}</Badge>`,
      ]);
      return;
    }

    case "button": {
      const variant = propString(props, "variant", "default");
      const align = ALIGN_FLEX[propString(props, "align", "left")] ?? "justify-start";
      pushLines(target, level, [
        `<div className="flex ${align}">`,
        `  <Button variant="${escapeAttribute(variant)}">${escapeText(
          propString(props, "label", "Aceptar"),
        )}</Button>`,
        `</div>`,
      ]);
      return;
    }

    case "image": {
      const name = propString(props, "name", "folder");
      const safeName = BUILDER_ICON_NAMES.includes(name) ? name : "folder";
      const size = propNumber(props, "size", 32) === 16 ? 16 : 32;
      pushLines(target, level, [
        `<figure className="flex flex-col items-center gap-1">`,
        `  <div className="bevel-sunken bg-surface p-2">`,
        `    <Icon name="${safeName}" size={${size}} />`,
        `  </div>`,
        `  <figcaption className="text-[11px] leading-[13px] text-ink-muted">${escapeText(
          propString(props, "caption", "Ilustración"),
        )}</figcaption>`,
        `</figure>`,
      ]);
      return;
    }

    case "divider":
      pushLines(target, level, ["<Separator />"]);
      return;

    case "spacer": {
      const size = propString(props, "size", "md");
      const height = size === "sm" ? "h-2" : size === "lg" ? "h-8" : "h-4";
      pushLines(target, level, [
        `<div aria-hidden="true" className="${height}" />`,
      ]);
      return;
    }

    case "input": {
      const id = fieldId(block, "campo");
      const type = propString(props, "inputType", "text");
      const required = propBoolean(props, "required") ? " required" : "";
      pushLines(target, level, [
        `<div className="grid gap-1">`,
        `  <Label htmlFor="${id}">${escapeText(
          propString(props, "label", "Nombre"),
        )}</Label>`,
        `  <Input id="${id}" type="${escapeAttribute(type)}" placeholder="${escapeAttribute(
          propString(props, "placeholder"),
        )}"${required} />`,
        `</div>`,
      ]);
      return;
    }

    case "textarea": {
      const id = fieldId(block, "campo");
      const rows = Math.max(1, Math.min(20, Math.round(propNumber(props, "rows", 3))));
      pushLines(target, level, [
        `<div className="grid gap-1">`,
        `  <Label htmlFor="${id}">${escapeText(
          propString(props, "label", "Comentarios"),
        )}</Label>`,
        `  <Textarea id="${id}" rows={${rows}} placeholder="${escapeAttribute(
          propString(props, "placeholder"),
        )}" />`,
        `</div>`,
      ]);
      return;
    }

    case "checkbox": {
      const checked = propBoolean(props, "checked") ? " defaultChecked" : "";
      pushLines(target, level, [
        `<Checkbox${checked}>${escapeText(
          propString(props, "label", "Casilla"),
        )}</Checkbox>`,
      ]);
      return;
    }

    case "progress": {
      const label = propString(props, "label", "Progreso");
      const value = Math.max(
        0,
        Math.min(100, Math.round(propNumber(props, "value", 0))),
      );
      pushLines(target, level, [
        `<div className="grid gap-1">`,
        `  <span className="text-[11px] leading-[13px]">${escapeText(
          label,
        )}</span>`,
        `  <ProgressBar aria-label="${escapeAttribute(label)}" value={${value}} />`,
        `</div>`,
      ]);
      return;
    }

    case "alert": {
      const variant = propString(props, "variant", "info");
      pushLines(target, level, [
        `<Alert variant="${escapeAttribute(variant)}">`,
        `  <AlertTitle>${escapeText(
          propString(props, "title", "Aviso"),
        )}</AlertTitle>`,
        `  <AlertDescription className="whitespace-pre-line">${escapeText(
          propString(props, "description"),
        )}</AlertDescription>`,
        `</Alert>`,
      ]);
      return;
    }

    case "card": {
      const title = propString(props, "title");
      const description = propString(props, "description");
      pushLines(target, level, ["<Card>"]);
      if (title || description) {
        pushLines(target, level + 1, ["<CardHeader>"]);
        if (title) {
          pushLines(target, level + 2, [
            `<CardTitle>${escapeText(title)}</CardTitle>`,
          ]);
        }
        if (description) {
          pushLines(target, level + 2, [
            `<CardDescription>${escapeText(description)}</CardDescription>`,
          ]);
        }
        pushLines(target, level + 1, ["</CardHeader>"]);
      }
      pushLines(target, level + 1, ['<CardContent className="grid gap-2">']);
      renderChildren(block, level + 2, target);
      pushLines(target, level + 1, ["</CardContent>"]);
      pushLines(target, level, ["</Card>"]);
      return;
    }

    case "panel": {
      const title = propString(props, "title");
      const variant = propString(props, "variant", "raised");
      pushLines(target, level, [
        `<Panel variant="${escapeAttribute(variant)}">`,
      ]);
      if (title) {
        pushLines(target, level + 1, [
          "<PanelHeader>",
          `  <PanelTitle>${escapeText(title)}</PanelTitle>`,
          "</PanelHeader>",
        ]);
      }
      pushLines(target, level + 1, ['<PanelBody className="grid gap-2">']);
      renderChildren(block, level + 2, target);
      pushLines(target, level + 1, ["</PanelBody>"]);
      pushLines(target, level, ["</Panel>"]);
      return;
    }

    case "window": {
      const title = propString(props, "title", "Sin título");
      const status = propString(props, "status");
      const active = propBoolean(props, "active", true);
      pushLines(target, level, [
        `<Window${active ? "" : " active={false}"}>`,
        `  <Window.TitleBar title="${escapeAttribute(title)}" />`,
        `  <Window.Body className="grid gap-2">`,
      ]);
      renderChildren(block, level + 2, target);
      pushLines(target, level + 1, ["</Window.Body>"]);
      if (status) {
        pushLines(target, level + 1, [
          "<Window.StatusBar>",
          `  <Window.StatusField>${escapeText(status)}</Window.StatusField>`,
          "</Window.StatusBar>",
        ]);
      }
      pushLines(target, level, ["</Window>"]);
      return;
    }

    case "group-box": {
      pushLines(target, level, [
        `<GroupBox legend="${escapeAttribute(
          propString(props, "legend", "Grupo"),
        )}">`,
        '  <div className="grid gap-2">',
      ]);
      renderChildren(block, level + 2, target);
      pushLines(target, level + 1, ["</div>"]);
      pushLines(target, level, ["</GroupBox>"]);
      return;
    }

    case "columns": {
      const columns = propNumber(props, "columns", 2) === 3 ? 3 : 2;
      pushLines(target, level, [
        `<div className="grid gap-3 sm:grid-cols-${columns}">`,
      ]);
      renderChildren(block, level + 1, target);
      pushLines(target, level, ["</div>"]);
      return;
    }

    case "hero": {
      const align = ALIGN_TEXT[propString(props, "align", "left")] ?? "text-left";
      const justify =
        ALIGN_FLEX[propString(props, "align", "left")] ?? "justify-start";
      const variant = propString(props, "buttonVariant", "primary");
      pushLines(target, level, [
        `<section className="bevel-window bg-surface p-4 ${align}">`,
        `  <p className="text-[11px] leading-[13px] text-ink-muted">${escapeText(
          propString(props, "eyebrow"),
        )}</p>`,
        `  <h1 className="mt-1 text-[20px] font-bold leading-[24px]">${escapeText(
          propString(props, "title", "Título"),
        )}</h1>`,
        `  <p className="mt-2 max-w-2xl whitespace-pre-line text-[12px] leading-[16px]">${escapeText(
          propString(props, "description"),
        )}</p>`,
        `  <div className="mt-3 flex ${justify}">`,
        `    <Button variant="${escapeAttribute(variant)}">${escapeText(
          propString(props, "buttonLabel", "Empezar"),
        )}</Button>`,
        `  </div>`,
        `</section>`,
      ]);
      return;
    }

    case "status-bar": {
      pushLines(target, level, [
        "<StatusBar>",
        `  <StatusBarField>${escapeText(
          propString(props, "left", "Listo."),
        )}</StatusBarField>`,
        `  <StatusBarField>${escapeText(
          propString(props, "right", "DeskUI"),
        )}</StatusBarField>`,
        "</StatusBar>",
      ]);
      return;
    }
  }
}

function collectImports(blocks: readonly BuilderBlock[]): ImportSpec[] {
  const modules = new Map<string, Set<string>>();

  function add(spec: ImportSpec) {
    const names = modules.get(spec.from) ?? new Set<string>();
    for (const name of spec.names) {
      names.add(name);
    }
    modules.set(spec.from, names);
  }

  walk(blocks, (block) => {
    for (const spec of IMPORT_SPECS[block.type]) {
      add(spec);
    }

    if (block.type === "card") {
      const title = propString(block.props, "title");
      const description = propString(block.props, "description");
      if (title || description) {
        add({ from: "card", names: ["CardHeader"] });
      }
      if (title) {
        add({ from: "card", names: ["CardTitle"] });
      }
      if (description) {
        add({ from: "card", names: ["CardDescription"] });
      }
    }

    if (block.type === "panel" && propString(block.props, "title")) {
      add({ from: "panel", names: ["PanelHeader", "PanelTitle"] });
    }
  });

  return [...modules.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "en"))
    .map(([from, names]) => ({
      from,
      names: [...names].sort((a, b) => a.localeCompare(b, "en")),
    }));
}

const BACKGROUND_CLASS: Record<BuilderDocument["background"], string> = {
  surface: "bg-surface",
  sunken: "bg-surface-sunken",
  desktop: "bg-desktop",
};

export function generateJsx(
  document: BuilderDocument,
  locale: "es" | "en" = "es",
): string {
  const imports = collectImports(document.blocks);
  const lines: string[] = [];

  lines.push(
    locale === "en"
      ? "// Generated by the DeskUI Page Builder."
      : "// Generado por el Page Builder de DeskUI.",
  );
  lines.push(
    locale === "en"
      ? "// Copy this file and add the components with the CLI."
      : "// Copia este archivo y añade los componentes con el CLI.",
  );
  lines.push("");
  for (const spec of imports) {
    lines.push(
      `import { ${spec.names.join(", ")} } from "@/components/ui/${spec.from}";`,
    );
  }
  if (imports.length > 0) {
    lines.push("");
  }
  lines.push(
    locale === "en"
      ? "export function GeneratedPage() {"
      : "export function PaginaGenerada() {",
  );
  lines.push("  return (");
  lines.push(
    `    <main data-theme="${escapeAttribute(
      document.theme,
    )}" className="w95-ui min-h-dvh ${BACKGROUND_CLASS[document.background]} p-4 text-ink sm:p-6">`,
  );
  lines.push(
    '      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">',
  );

  const body: string[] = [];
  for (const block of document.blocks) {
    renderBlock(block, 0, body);
  }
  pushLines(lines, 4, body);

  lines.push("      </div>");
  lines.push("    </main>");
  lines.push("  );");
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

export function generateJson(document: BuilderDocument): string {
  return serializeBuilderDocument(document, true);
}

export function generateExportBundle(
  document: BuilderDocument,
  locale: "es" | "en" = "es",
) {
  return {
    jsx: generateJsx(document, locale),
    json: generateJson(document),
    commands: generateAddCommands(document),
  };
}
