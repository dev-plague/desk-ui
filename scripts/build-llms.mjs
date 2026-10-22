import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(root, "apps", "docs", "public");
const skillsDir = path.join(root, "skills");

const SITE_ROUTES = [
  ["Inicio", "/#/"],
  ["Instalación", "/#/instalacion"],
  ["Componentes", "/#/componentes"],
  ["Theming", "/#/temas"],
  ["Guía de composición", "/#/guia"],
  ["Page Builder", "/#/constructor"],
  ["Changelog", "/#/cambios"],
  ["Migración", "/#/migracion"],
  ["Contribuir", "/#/contribuir"],
  ["Acerca de", "/#/acerca"],
];

const SKILLS = [
  {
    id: "deskui",
    title: "DeskUI — uso general",
    description:
      "Instalación, catálogo, API, patrones, i18n, CLI y checklist.",
  },
  {
    id: "deskui-composition",
    title: "DeskUI — composición visual",
    description:
      "Jerarquía, densidad, formularios, toolbars, color y accesibilidad.",
  },
  {
    id: "deskui-page-builder",
    title: "DeskUI — Page Builder",
    description:
      "Modelo JSON, bloques, plantillas, capas y exportación JSX/JSON.",
  },
  {
    id: "deskui-i18n",
    title: "DeskUI — i18n",
    description:
      "DeskUILocaleProvider, diccionarios es/en y textos internos.",
  },
];

const REFERENCES = [
  "components.md",
  "composition.md",
  "patterns.md",
  "i18n.md",
  "cli.md",
  "checklist.md",
  "design-tokens.md",
  "page-builder.md",
];

function stripFrontmatter(content) {
  return content.replace(/^---\n[\s\S]*?\n---\n+/, "");
}

async function readSkill(id) {
  const file = path.join(skillsDir, id, "SKILL.md");
  return stripFrontmatter(await readFile(file, "utf8")).trim();
}

async function buildIndex() {
  const lines = [
    "# DeskUI",
    "",
    "> DeskUI es una librería de componentes React con estética de escritorio",
    "> clásico, tokens, accesibilidad y distribución copy & own mediante CLI.",
    "> Esta documentación está en español e inglés; el código y las APIs en inglés.",
    "",
    "## Skills para agentes",
    "",
  ];

  for (const skill of SKILLS) {
    lines.push(`- **${skill.title}**: ${skill.description}`);
  }

  lines.push("", "## Documentación del sitio", "");
  for (const [label, href] of SITE_ROUTES) {
    lines.push(`- [${label}](${href})`);
  }

  lines.push(
    "",
    "Las cuatro skills se incluyen completas en `llms-full.txt` y viven en",
    "`skills/` del repositorio.",
    "",
    "## Referencias completas",
    "",
    "- [llms-full.txt](./llms-full.txt): skill principal y referencias consolidadas.",
    "- [API de componentes](./#/componentes): props, variantes y notas de a11y.",
    "- [Guía de composición](./#/guia): cómo combinar ventanas, paneles y formularios.",
    "- [Page Builder](./#/constructor): modelo, bloques y exportación.",
    "",
    "## Instalación rápida",
    "",
    "```bash",
    "npx deskui init",
    "npx deskui add button input label group-box checkbox textarea",
    "npx deskui list",
    "```",
    "",
    "En un consumidor, los componentes viven en `@/components/ui/<nombre>` y",
    "`cn` en `@/lib/utils`. En el monorepo, la fuente es `@deskui/ui`.",
    "",
    "## Reglas de composición",
    "",
    "- Una sola ventana principal por pantalla; diálogos solo para bloqueos.",
    "- Un solo `Button variant=\"primary\"` por formulario.",
    "- Tokens semánticos; sin radios, blur ni sombras difusas.",
    "- Densidad 21–23 px en escritorio y 24 px de área táctil en móvil.",
    "- Teclado, foco visible y nombres accesibles en todo control.",
    "",
  );

  return lines.join("\n");
}

async function buildFull() {
  const parts = [
    "# DeskUI — referencia consolidada para agentes",
    "",
    "> Generado desde `skills/` por `pnpm llms:build`. No editar a mano.",
    "",
  ];

  for (const skill of SKILLS) {
    parts.push(`# ${skill.title}`, "", await readSkill(skill.id), "");
  }

  parts.push("# Referencias", "");
  for (const reference of REFERENCES) {
    const file = path.join(skillsDir, "deskui", "references", reference);
    const content = await readFile(file, "utf8");
    parts.push(`## ${reference}`, "", content.trim(), "");
  }

  return parts.join("\n");
}

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "llms.txt"), await buildIndex(), "utf8");
await writeFile(
  path.join(outputDir, "llms-full.txt"),
  await buildFull(),
  "utf8",
);
console.log("llms.txt y llms-full.txt generados en apps/docs/public.");
