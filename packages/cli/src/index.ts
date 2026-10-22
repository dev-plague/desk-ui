#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

import { addComponents } from "./commands/add";
import { initProject } from "./commands/init";
import { listComponents } from "./commands/list";
import { color, line } from "./lib/terminal";

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { version: string };

const HELP = `
${color.bold("deskui")} — componentes DeskUI que se copian a tu proyecto.

${color.bold("Uso")}
  deskui init [opciones]
  deskui add <componente...> [opciones]
  deskui list [opciones]

${color.bold("Opciones")}
  --cwd <dir>            Directorio del proyecto (por defecto: cwd)
  --registry <url|ruta>  Registry alternativo
  --overwrite            Reemplaza archivos existentes con otro contenido
  --force                Igual que --overwrite, también para components.json
  --no-install           No ejecuta el gestor de paquetes
  --no-agents            init: no copia skills ni modifica AGENTS.md
  --dry-run              Muestra lo que haría 'add' sin escribir
  --alias <prefijo>      Alias de imports (por defecto: @/)
  --css <archivo>        CSS de entrada para init
  --src-dir              Fuerza el uso de src/ como raíz
  --no-src-dir           Fuerza la raíz del proyecto sin src/
  -h, --help             Muestra esta ayuda
  -v, --version          Muestra la versión

${color.bold("Ejemplos")}
  npx deskui init
  npx deskui add button input label group-box tabs
  npx deskui add dialog --dry-run
  npx deskui list
`;

function stringValue(value: string | boolean | undefined) {
  return typeof value === "string" ? value : undefined;
}

function printFiles(
  files: string[],
  marker: string,
  paint: (text: string) => string,
) {
  for (const file of files) {
    line(`  ${paint(marker)} ${file}`);
  }
}

async function run() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    options: {
      cwd: { type: "string" },
      registry: { type: "string" },
      alias: { type: "string" },
      css: { type: "string" },
      "src-dir": { type: "boolean" },
      "no-src-dir": { type: "boolean" },
      "no-install": { type: "boolean" },
      "no-agents": { type: "boolean" },
      overwrite: { type: "boolean" },
      force: { type: "boolean" },
      "dry-run": { type: "boolean" },
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
    },
  });

  if (values.version) {
    line(pkg.version);
    return;
  }

  const command = positionals[0];
  const names = positionals.slice(1);
  const cwd = path.resolve(stringValue(values.cwd) ?? process.cwd());

  if (!command || values.help) {
    line(HELP);
    return;
  }

  if (command === "init") {
    if (values["src-dir"] && values["no-src-dir"]) {
      throw new Error("Usa --src-dir o --no-src-dir, no ambos.");
    }

    const result = await initProject({
      cwd,
      alias: stringValue(values.alias),
      css: stringValue(values.css),
      registry: stringValue(values.registry),
      srcDir:
        values["src-dir"] === true
          ? true
          : values["no-src-dir"] === true
            ? false
            : undefined,
      overwrite: values.overwrite === true,
      force: values.force === true,
      install: values["no-install"] !== true,
      agents: values["no-agents"] !== true,
    });

    line(color.bold("\nDeskUI — init"));
    line(`Proyecto: ${cwd}`);

    if (result.created.length > 0) {
      line(color.green("\nArchivos creados o actualizados:"));
      printFiles(result.created, "+", color.green);
    }

    if (result.unchanged.length > 0) {
      line(color.dim("\nSin cambios:"));
      printFiles(result.unchanged, "=", color.dim);
    }

    if (result.cssFile) {
      line(
        result.cssModified
          ? color.green(`\nCSS actualizado: ${result.cssFile}`)
          : color.dim(`\nCSS ya configurado: ${result.cssFile}`),
      );
    }

    if (result.installed.length > 0) {
      line(color.green(`\nDependencias instaladas: ${result.installed.join(", ")}`));
    }

    for (const warning of result.warnings) {
      line(color.yellow(`\nAviso: ${warning}`));
    }

    line(color.dim("\nSiguiente paso:"));
    line(
      "  npx deskui add button input label group-box checkbox textarea radio-group select switch slider form tabs scroll-area window dialog",
    );
    return;
  }

  if (command === "add") {
    const result = await addComponents(names, {
      cwd,
      registry: stringValue(values.registry),
      overwrite: values.overwrite === true || values.force === true,
      dryRun: values["dry-run"] === true,
      install: values["no-install"] !== true,
    });

    line(
      color.bold(`\nDeskUI — add ${names.join(" ")}${result.dryRun ? " (dry run)" : ""}`),
    );
    line(color.dim(`Registry: ${result.registry}`));

    for (const action of result.actions) {
      const paint =
        action.status === "created"
          ? color.green
          : action.status === "updated"
            ? color.cyan
            : action.status === "skipped"
              ? color.yellow
              : color.dim;
      const marker =
        action.status === "created"
          ? "+"
          : action.status === "updated"
            ? "~"
            : action.status === "skipped"
              ? "!"
              : "=";
      line(`  ${paint(marker)} ${action.file} ${color.dim(`(${action.item})`)}`);
    }

    if (result.installed.length > 0) {
      line(color.green(`\nDependencias instaladas: ${result.installed.join(", ")}`));
    } else if (result.dependencies.length > 0) {
      line(
        color.yellow(
          `\nDependencias requeridas: ${result.dependencies.join(", ")}`,
        ),
      );
    }

    if (result.dryRun) {
      line(color.yellow("\nDry run: no se escribió ningún archivo."));
    }

    return;
  }

  if (command === "list") {
    const result = await listComponents({
      cwd,
      registry: stringValue(values.registry),
    });

    line(color.bold("\nComponentes disponibles"));
    line(color.dim(`Registry: ${result.registry}\n`));

    const items = [...result.items].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    for (const item of items) {
      line(
        `  ${color.cyan(item.name.padEnd(14))} ${item.title ?? ""} ${color.dim(item.description ?? "")}`,
      );
    }

    return;
  }

  throw new Error(`Comando desconocido: ${command}. Usa --help.`);
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${color.red("Error:")} ${message}`);
  process.exitCode = 1;
});
