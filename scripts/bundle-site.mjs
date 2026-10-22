import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Empaqueta el sitio compilado (incluido `r/`) para subirlo al VPC y escribe
 * el SHA-256 junto al tarball.
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "apps", "docs", "dist");
const artifacts = path.join(root, "artifacts");

if (!existsSync(path.join(dist, "index.html"))) {
  throw new Error("No existe apps/docs/dist/index.html. Ejecuta `pnpm build`.");
}
if (!existsSync(path.join(dist, "r", "registry.json"))) {
  throw new Error(
    "No existe apps/docs/dist/r/registry.json. Ejecuta `pnpm registry:site` antes del build.",
  );
}

const { version } = JSON.parse(
  await readFile(path.join(root, "package.json"), "utf8"),
);

await mkdir(artifacts, { recursive: true });

const fileName = `deskui-site-${version}.tar.gz`;
const target = path.join(artifacts, fileName);

const result = spawnSync("tar", ["-czf", target, "-C", dist, "."], {
  stdio: "inherit",
});

if (result.status !== 0) {
  throw new Error("tar falló al empaquetar el sitio.");
}

const hash = createHash("sha256")
  .update(await readFile(target))
  .digest("hex");

await writeFile(
  path.join(artifacts, `${fileName}.sha256`),
  `${hash}  artifacts/${fileName}\n`,
);

console.log(`Sitio empaquetado: artifacts/${fileName}`);
console.log(`SHA-256: ${hash}`);
