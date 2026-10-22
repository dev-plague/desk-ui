import { existsSync } from "node:fs";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const cliRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const uiRoot = path.resolve(cliRoot, "../ui");
const templatesDir = path.join(cliRoot, "templates");

await rm(templatesDir, { recursive: true, force: true });
await mkdir(templatesDir, { recursive: true });

await writeFile(
  path.join(templatesDir, "deskui.css"),
  await readFile(path.join(uiRoot, "src/styles/tokens.css"), "utf8"),
);

await cp(
  path.join(uiRoot, "src/styles/fonts"),
  path.join(templatesDir, "fonts"),
  { recursive: true },
);

await writeFile(
  path.join(templatesDir, "utils.ts"),
  await readFile(path.join(uiRoot, "src/lib/utils.ts"), "utf8"),
);

const repoRoot = path.resolve(cliRoot, "../..");
await cp(path.join(repoRoot, "skills"), path.join(templatesDir, "skills"), {
  recursive: true,
});

const registrySource = path.join(uiRoot, "dist/registry");
const registryTarget = path.join(cliRoot, "registry");

if (existsSync(registrySource)) {
  await rm(registryTarget, { recursive: true, force: true });
  await cp(registrySource, registryTarget, { recursive: true });
  console.log("Registry sincronizado desde packages/ui/dist/registry.");
} else {
  console.log(
    "Aviso: no hay registry compilado. Ejecuta `pnpm registry:build` antes de empaquetar el CLI.",
  );
}

console.log("Templates sincronizados desde packages/ui.");
