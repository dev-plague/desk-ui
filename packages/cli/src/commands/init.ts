import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ComponentsConfig } from "../types";
import {
  addStyleImport,
  detectAlias,
  findCssFile,
  hasTsconfigAlias,
  normalizeAlias,
  packageDependencies,
  readPackageJson,
  tailwindMajor,
  toImportSpecifier,
} from "../lib/config";
import {
  copyDirSafe,
  displayPath,
  writeFileSafe,
  writeJsonSafe,
} from "../lib/files";
import { installPackages } from "../lib/install";
import { getTemplatePaths } from "../lib/templates";

export interface InitOptions {
  cwd: string;
  alias?: string;
  css?: string;
  srcDir?: boolean;
  registry?: string;
  overwrite?: boolean;
  force?: boolean;
  install?: boolean;
  /** Copia las skills de DeskUI y añade la sección a AGENTS.md. */
  agents?: boolean;
}

const AGENTS_START = "<!-- deskui:start -->";
const AGENTS_END = "<!-- deskui:end -->";

function agentsSection() {
  return `${AGENTS_START}
## DeskUI

Este proyecto usa DeskUI con distribución copy & own. Los componentes viven en
\`src/components/ui\` (o la raíz configurada) y \`cn\` en \`src/lib/utils.ts\`.

Antes de añadir interfaz:

- Lee \`.agents/skills/deskui/SKILL.md\` (o
  \`.opencode/skills/deskui/SKILL.md\`).
- Para layout, densidad y accesibilidad visual, lee
  \`.agents/skills/deskui-composition/SKILL.md\`.
- Para textos internos y español/inglés, lee
  \`.agents/skills/deskui-i18n/SKILL.md\`.

Reglas:

- Una sola ventana principal por pantalla; diálogos solo para bloqueos.
- Un solo \`Button variant="primary"\` por formulario.
- Tokens semánticos; sin radios, blur ni sombras difusas.
- Densidad 21–23 px en escritorio y 24 px de área táctil en móvil.
- Todo control necesita nombre accesible y foco visible.

CLI: \`npx deskui list\` y \`npx deskui add <componente>\`.
${AGENTS_END}`;
}

async function writeAgentsFile(filePath: string) {
  const section = agentsSection();

  if (!existsSync(filePath)) {
    return writeFileSafe(filePath, `# Project agents\n\n${section}\n`);
  }

  const current = await readFile(filePath, "utf8");
  const pattern = /<!-- deskui:start -->[\s\S]*?<!-- deskui:end -->/;
  const next = pattern.test(current)
    ? current.replace(pattern, section)
    : `${current.trimEnd()}\n\n${section}\n`;

  return writeFileSafe(filePath, next, { overwrite: true });
}

export interface InitResult {
  cwd: string;
  configPath: string;
  stylePath: string;
  utilsPath: string;
  cssFile: string | null;
  cssModified: boolean;
  created: string[];
  unchanged: string[];
  warnings: string[];
  installed: string[];
}

export async function initProject(options: InitOptions): Promise<InitResult> {
  const cwd = path.resolve(options.cwd);
  const pkg = await readPackageJson(cwd);
  const dependencies = packageDependencies(pkg);
  const warnings: string[] = [];
  const created: string[] = [];
  const unchanged: string[] = [];

  const tailwindVersion = tailwindMajor(dependencies.tailwindcss);
  if (!dependencies.react) {
    warnings.push(
      "No detecté React en package.json. Instálalo antes de usar los componentes.",
    );
  }
  if (tailwindVersion === null) {
    warnings.push(
      "No detecté tailwindcss en package.json. La librería requiere Tailwind 4.",
    );
  } else if (tailwindVersion < 4) {
    warnings.push(
      `Detecté Tailwind ${tailwindVersion}. Los tokens usan @theme y @utility de Tailwind 4; actualiza antes de continuar.`,
    );
  }

  const srcDir = options.srcDir ?? existsSync(path.join(cwd, "src"));
  const srcRoot = srcDir ? path.join(cwd, "src") : cwd;
  const alias = normalizeAlias(options.alias ?? (await detectAlias(cwd)));
  const aliasConfigured = await hasTsconfigAlias(cwd, alias);
  if (!aliasConfigured) {
    warnings.push(
      `No detecté el alias ${alias} en tsconfig/jsconfig. Configúralo en el tsconfig y en el bundler, o usa --alias con un alias existente.`,
    );
  }
  const templates = getTemplatePaths();
  const overwrite = Boolean(options.overwrite || options.force);

  const stylesDir = path.join(srcRoot, "styles");
  const stylePath = path.join(stylesDir, "deskui.css");
  const utilsPath = path.join(srcRoot, "lib", "utils.ts");

  function track(status: "created" | "updated" | "unchanged", file: string) {
    const display = displayPath(cwd, file);
    if (status === "unchanged") {
      unchanged.push(display);
    } else {
      created.push(display);
    }
  }

  track(
    await writeFileSafe(stylePath, await readFile(templates.cssPath, "utf8"), {
      overwrite,
    }),
    stylePath,
  );

  const fonts = await copyDirSafe(
    templates.fontsDir,
    path.join(stylesDir, "fonts"),
    { overwrite },
  );
  if (fonts.created > 0) {
    created.push(`${displayPath(cwd, path.join(stylesDir, "fonts"))}/`);
  }

  track(
    await writeFileSafe(utilsPath, await readFile(templates.utilsPath, "utf8"), {
      overwrite,
    }),
    utilsPath,
  );

  if (options.agents !== false) {
    for (const target of [".agents/skills", ".opencode/skills"]) {
      const skills = await copyDirSafe(
        templates.skillsDir,
        path.join(cwd, target),
        { overwrite },
      );
      if (skills.created > 0) {
        created.push(`${target}/`);
      } else if (skills.skipped > 0) {
        unchanged.push(`${target}/`);
      }
    }

    const agentsPath = path.join(cwd, "AGENTS.md");
    track(await writeAgentsFile(agentsPath), agentsPath);
  }

  let cssFile: string | null = null;
  let cssModified = false;
  const cssRelative = findCssFile(cwd, options.css);

  if (cssRelative) {
    const cssAbsolute = path.join(cwd, cssRelative);
    const current = await readFile(cssAbsolute, "utf8");
    const specifier = toImportSpecifier(cssAbsolute, stylePath);
    const next = addStyleImport(current, specifier);

    if (next !== current) {
      await writeFile(cssAbsolute, next, "utf8");
      cssModified = true;
    }

    cssFile = cssRelative;
  } else {
    warnings.push(
      "No encontré un CSS de entrada. Añade manualmente `@import \"./styles/deskui.css\";` después de `@import \"tailwindcss\";`.",
    );
  }

  const config: ComponentsConfig = {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "classic",
    rsc: false,
    tsx: true,
    tailwind: {
      config: "",
      css: cssRelative ?? "",
      baseColor: "neutral",
      cssVariables: true,
      prefix: "",
    },
    iconLibrary: "deskui",
    aliases: {
      components: `${alias}components`,
      utils: `${alias}lib/utils`,
      ui: `${alias}components/ui`,
      lib: `${alias}lib`,
      hooks: `${alias}hooks`,
    },
    srcDir,
    ...(options.registry ? { registry: options.registry } : {}),
  };

  const configPath = path.join(cwd, "components.json");
  track(
    await writeJsonSafe(configPath, config, { overwrite }),
    configPath,
  );

  const baseDependencies = ["clsx", "tailwind-merge"].filter(
    (dependency) => !dependencies[dependency],
  );
  let installed: string[] = [];

  if (options.install !== false && baseDependencies.length > 0) {
    installPackages(cwd, baseDependencies);
    installed = baseDependencies;
  }

  return {
    cwd,
    configPath,
    stylePath,
    utilsPath,
    cssFile,
    cssModified,
    created,
    unchanged,
    warnings,
    installed,
  };
}
