import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ComponentsConfig } from "../types";

export type WriteStatus = "created" | "updated" | "unchanged";

export function toPosix(value: string) {
  return value.split(path.sep).join("/");
}

export function displayPath(cwd: string, filePath: string) {
  const relative = path.relative(cwd, filePath);
  return toPosix(relative || ".");
}

export async function writeFileSafe(
  filePath: string,
  content: string,
  options: { overwrite?: boolean } = {},
): Promise<WriteStatus> {
  if (existsSync(filePath)) {
    const current = await readFile(filePath, "utf8");
    if (current === content) {
      return "unchanged";
    }

    if (!options.overwrite) {
      throw new Error(
        `El archivo ya existe y tiene contenido distinto: ${filePath}. Usa --overwrite para reemplazarlo.`,
      );
    }

    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, content, "utf8");
    return "updated";
  }

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
  return "created";
}

export async function writeJsonSafe(
  filePath: string,
  value: unknown,
  options: { overwrite?: boolean } = {},
) {
  return writeFileSafe(
    filePath,
    `${JSON.stringify(value, null, 2)}\n`,
    options,
  );
}

export async function copyDirSafe(
  sourceDir: string,
  targetDir: string,
  options: { overwrite?: boolean } = {},
) {
  await mkdir(targetDir, { recursive: true });
  const entries = await readdir(sourceDir, { withFileTypes: true });
  let created = 0;
  let skipped = 0;

  for (const entry of entries) {
    const source = path.join(sourceDir, entry.name);
    const target = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      const nested = await copyDirSafe(source, target, options);
      created += nested.created;
      skipped += nested.skipped;
      continue;
    }

    if (existsSync(target) && !options.overwrite) {
      skipped += 1;
      continue;
    }

    await copyFile(source, target);
    created += 1;
  }

  return { created, skipped };
}

export function assertInside(cwd: string, target: string) {
  const root = path.resolve(cwd);
  const resolved = path.resolve(target);
  const relative = path.relative(root, resolved);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(
      `El registry intentó escribir fuera del proyecto: ${target}`,
    );
  }
}

export function resolveSrcRoot(cwd: string, config: ComponentsConfig) {
  return config.srcDir ? path.join(cwd, "src") : cwd;
}

export function resolveTargetPath(
  cwd: string,
  config: ComponentsConfig,
  target: string,
) {
  if (target.startsWith("src/")) {
    return path.join(cwd, target);
  }

  return path.join(resolveSrcRoot(cwd, config), target);
}
