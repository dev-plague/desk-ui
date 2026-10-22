import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { readConfig, rewriteAlias } from "../lib/config";
import {
  assertInside,
  displayPath,
  resolveTargetPath,
  writeFileSafe,
} from "../lib/files";
import { installPackages } from "../lib/install";
import { resolveItems, resolveRegistryBase } from "../lib/registry";

export type AddStatus = "created" | "updated" | "unchanged" | "skipped";

export interface AddAction {
  item: string;
  file: string;
  status: AddStatus;
  explicit: boolean;
}

export interface AddOptions {
  cwd: string;
  registry?: string;
  overwrite?: boolean;
  dryRun?: boolean;
  install?: boolean;
}

export interface AddResult {
  actions: AddAction[];
  dependencies: string[];
  installed: string[];
  registry: string;
  dryRun: boolean;
}

export async function addComponents(
  names: string[],
  options: AddOptions,
): Promise<AddResult> {
  const cwd = path.resolve(options.cwd);

  if (names.length === 0) {
    throw new Error("Indica al menos un componente: deskui add button");
  }

  const config = await readConfig(cwd);
  const registry = resolveRegistryBase(cwd, config, options.registry);
  const resolved = await resolveItems(registry, names, cwd);
  const actions: AddAction[] = [];

  for (const { item, explicit } of resolved) {
    if (!item.files || item.files.length === 0) {
      throw new Error(`El componente "${item.name}" no contiene archivos.`);
    }

    for (const file of item.files) {
      const target = file.target ?? file.path;
      const destination = resolveTargetPath(cwd, config, target);
      assertInside(cwd, destination);
      const content = rewriteAlias(file.content, config);

      if (existsSync(destination)) {
        const current = await readFile(destination, "utf8");

        if (current === content) {
          actions.push({
            item: item.name,
            file: displayPath(cwd, destination),
            status: "unchanged",
            explicit,
          });
          continue;
        }

        if (!options.overwrite) {
          if (explicit) {
            throw new Error(
              `El archivo ${displayPath(cwd, destination)} ya existe con otro contenido. Usa --overwrite para reemplazarlo.`,
            );
          }

          actions.push({
            item: item.name,
            file: displayPath(cwd, destination),
            status: "skipped",
            explicit,
          });
          continue;
        }

        if (!options.dryRun) {
          await writeFileSafe(destination, content, { overwrite: true });
        }
        actions.push({
          item: item.name,
          file: displayPath(cwd, destination),
          status: "updated",
          explicit,
        });
        continue;
      }

      if (!options.dryRun) {
        await writeFileSafe(destination, content);
      }
      actions.push({
        item: item.name,
        file: displayPath(cwd, destination),
        status: "created",
        explicit,
      });
    }
  }

  const dependencies = [
    ...new Set(resolved.flatMap(({ item }) => item.dependencies ?? [])),
  ];

  let installed: string[] = [];
  if (
    !options.dryRun &&
    options.install !== false &&
    dependencies.length > 0
  ) {
    installPackages(cwd, dependencies);
    installed = dependencies;
  }

  return {
    actions,
    dependencies,
    installed,
    registry,
    dryRun: Boolean(options.dryRun),
  };
}
