import { cp, mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Copia el registry compilado a `apps/docs/public/r` para que el propio sitio
 * lo sirva en `https://<dominio>/r`, la URL por defecto del CLI.
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "packages", "ui", "dist", "registry");
const target = path.join(root, "apps", "docs", "public", "r");

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });

const index = JSON.parse(
  await readFile(path.join(target, "registry.json"), "utf8"),
);

if (!Array.isArray(index.items) || index.items.length === 0) {
  throw new Error(
    "El registry copiado no contiene items. Ejecuta `pnpm registry:build` antes.",
  );
}

const missing = index.items.filter(
  (item) => !item.name || !Array.isArray(item.files) || item.files.length === 0,
);
if (missing.length > 0) {
  throw new Error(`Items sin nombre o archivos: ${missing.length}`);
}

console.log(
  `Registry publicado en apps/docs/public/r (${index.items.length} items).`,
);
