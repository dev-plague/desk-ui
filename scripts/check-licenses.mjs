import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Auditoría rápida de licencias de las dependencias que se distribuyen o se
 * usan para construir el sitio. Falla con licencias copyleft fuertes o
 * desconocidas.
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ALLOWED = new Set([
  "0BSD",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "BlueOak-1.0.0",
  "CC0-1.0",
  "ISC",
  "MIT",
  "OFL-1.1",
  "Unlicense",
]);

const targets = [
  {
    label: "packages/ui",
    dir: path.join(root, "packages", "ui"),
    runtime: true,
  },
  {
    label: "packages/cli",
    dir: path.join(root, "packages", "cli"),
    runtime: true,
  },
  {
    label: "apps/docs",
    dir: path.join(root, "apps", "docs"),
    runtime: false,
  },
];

function resolveManifest(fromDir, name) {
  const require = createRequire(path.join(fromDir, "package.json"));
  const candidates = [];

  try {
    candidates.push(require.resolve(`${name}/package.json`));
  } catch {
    // Algunos paquetes bloquean package.json en sus exports.
  }

  candidates.push(
    path.join(fromDir, "node_modules", name, "package.json"),
    path.join(root, "node_modules", name, "package.json"),
  );

  return candidates.find((candidate) => existsSync(candidate));
}

function readLicense(manifest) {
  if (typeof manifest.license === "string") {
    return manifest.license;
  }
  if (manifest.license?.type) {
    return manifest.license.type;
  }
  if (Array.isArray(manifest.licenses)) {
    return manifest.licenses
      .map((entry) => (typeof entry === "string" ? entry : entry.type))
      .filter(Boolean)
      .join(" OR ");
  }
  return "UNKNOWN";
}

const rows = [];
const problems = [];

for (const target of targets) {
  const manifest = JSON.parse(
    await readFile(path.join(target.dir, "package.json"), "utf8"),
  );
  const deps = Object.keys(manifest.dependencies ?? {});
  const peers = target.runtime ? Object.keys(manifest.peerDependencies ?? {}) : [];

  for (const name of [...new Set([...deps, ...peers])].sort()) {
    const file = resolveManifest(target.dir, name);

    if (!file) {
      problems.push(`${target.label}: no se pudo resolver "${name}".`);
      continue;
    }

    const dep = JSON.parse(await readFile(file, "utf8"));
    const license = readLicense(dep);
    rows.push({
      name,
      version: dep.version ?? "?",
      license,
      scope: target.label,
    });

    if (!ALLOWED.has(license)) {
      problems.push(
        `${target.label}: ${name}@${dep.version} usa "${license}", fuera de la lista permitida.`,
      );
    }
  }
}

for (const row of rows.sort((a, b) => a.name.localeCompare(b.name))) {
  console.log(
    `${row.name.padEnd(32)} ${row.version.padEnd(10)} ${row.license.padEnd(14)} ${row.scope}`,
  );
}

const assets = [
  ["LICENSE", path.join(root, "LICENSE")],
  [
    "W95FA OFL",
    path.join(root, "packages", "ui", "src", "styles", "fonts", "W95FA-OFL.txt"),
  ],
  [
    "W95FA OFL (CLI)",
    path.join(root, "packages", "cli", "templates", "fonts", "W95FA-OFL.txt"),
  ],
];

for (const [label, file] of assets) {
  if (!existsSync(file)) {
    problems.push(`Falta el archivo de licencia: ${label} (${path.relative(root, file)}).`);
  }
}

if (problems.length > 0) {
  console.error(`Licencias: ${problems.length} problema(s).`);
  for (const problem of problems) {
    console.error(`  ✗ ${problem}`);
  }
  process.exit(1);
}

console.log(`Licencias: ${rows.length} dependencias revisadas, todas permitidas.`);
