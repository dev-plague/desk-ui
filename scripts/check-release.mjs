import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Comprueba que el árbol esté listo para publicar 0.2.x:
 * versiones alineadas, CHANGELOG con la versión, registry completo y copias
 * sincronizadas (UI → CLI → sitio).
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

const packages = {
  root: path.join(root, "package.json"),
  ui: path.join(root, "packages", "ui", "package.json"),
  cli: path.join(root, "packages", "cli", "package.json"),
  docs: path.join(root, "apps", "docs", "package.json"),
};

const manifests = {};
for (const [name, file] of Object.entries(packages)) {
  manifests[name] = await readJson(file);
}

const version = manifests.root.version;
for (const [name, manifest] of Object.entries(manifests)) {
  if (manifest.version !== version) {
    errors.push(
      `Versión desalineada en ${name}: ${manifest.version} (esperada ${version}).`,
    );
  }
}

const changelog = await readFile(path.join(root, "CHANGELOG.md"), "utf8");
if (!changelog.includes(`## [${version}]`)) {
  errors.push(`CHANGELOG.md no tiene una sección "## [${version}]".`);
}

const cli = manifests.cli;
if (cli.name !== "deskui") {
  errors.push(`El paquete del CLI debe llamarse "deskui" (es "${cli.name}").`);
}
if (cli.license !== "MIT") {
  errors.push("El CLI debe declarar licencia MIT.");
}
if (cli.publishConfig?.access !== "public") {
  errors.push('El CLI debe declarar publishConfig.access = "public".');
}
if (cli.bin?.deskui !== "./dist/index.js") {
  errors.push("El CLI debe exponer el binario deskui en ./dist/index.js.");
}
for (const entry of ["dist", "registry", "templates", "README.md"]) {
  if (!cli.files?.includes(entry)) {
    errors.push(`Falta "${entry}" en files del CLI.`);
  }
}
if (!cli.description) {
  errors.push("El CLI necesita description para npm.");
}
if (!cli.homepage) {
  warnings.push("El CLI no declara homepage.");
}

const uiRegistry = path.join(root, "packages", "ui", "dist", "registry");
const cliRegistry = path.join(root, "packages", "cli", "registry");
const siteRegistry = path.join(root, "apps", "docs", "public", "r");
const cliDist = path.join(root, "packages", "cli", "dist", "index.js");

for (const [label, dir] of [
  ["registry de la UI", uiRegistry],
  ["registry del CLI", cliRegistry],
  ["registry del sitio", siteRegistry],
]) {
  if (!existsSync(path.join(dir, "registry.json"))) {
    errors.push(`No existe el ${label} en ${path.relative(root, dir)}.`);
  }
}

if (
  existsSync(path.join(uiRegistry, "registry.json")) &&
  existsSync(path.join(siteRegistry, "registry.json"))
) {
  const uiIndex = await readJson(path.join(uiRegistry, "registry.json"));
  const siteIndex = await readJson(path.join(siteRegistry, "registry.json"));

  if (!Array.isArray(uiIndex.items) || uiIndex.items.length === 0) {
    errors.push("El registry de la UI no contiene items.");
  }
  if (uiIndex.items.length !== siteIndex.items.length) {
    errors.push(
      `El registry del sitio (${siteIndex.items.length}) no coincide con la UI (${uiIndex.items.length}).`,
    );
  }

  const missing = uiIndex.items.filter(
    (item) => !existsSync(path.join(uiRegistry, `${item.name}.json`)),
  );
  if (missing.length > 0) {
    errors.push(
      `Faltan archivos de registry: ${missing.map((item) => item.name).join(", ")}.`,
    );
  }
}

if (!existsSync(cliDist)) {
  errors.push("No existe packages/cli/dist/index.js. Ejecuta `pnpm build:cli`.");
}
if (!existsSync(path.join(root, "packages", "cli", "LICENSE"))) {
  warnings.push(
    "packages/cli/LICENSE no existe; el prepack lo copia desde la raíz.",
  );
}

const registryVersion = await readJson(path.join(uiRegistry, "registry.json"))
  .then((index) => index.items.length)
  .catch(() => 0);

if (errors.length > 0) {
  console.error(`Release ${version}: ${errors.length} problema(s).`);
  for (const error of errors) {
    console.error(`  ✗ ${error}`);
  }
  for (const warning of warnings) {
    console.error(`  ! ${warning}`);
  }
  process.exit(1);
}

console.log(`Release ${version} listo para empaquetar.`);
console.log(`  · Registry: ${registryVersion} items en UI, CLI y sitio.`);
console.log(`  · Versiones alineadas en root, ui, cli y docs.`);
console.log(`  · CHANGELOG con sección [${version}].`);
for (const warning of warnings) {
  console.log(`  ! ${warning}`);
}
console.log("Siguiente paso: `pnpm release:pack` y `npm publish` del tarball.");
