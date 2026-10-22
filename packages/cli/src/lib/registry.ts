import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  ComponentsConfig,
  RegistryIndex,
  RegistryItem,
  ResolvedItem,
} from "../types";
import { cliRoot } from "./paths";

const DEFAULT_REGISTRY = "https://deskui.codehive.com.co/r";

function normalizeBase(base: string, cwd: string) {
  if (/^https?:\/\//.test(base)) {
    return base.replace(/\/+$/, "");
  }

  if (base.startsWith("file://")) {
    return fileURLToPath(base).replace(/\/+$/, "");
  }

  return path.resolve(cwd, base).replace(/\/+$/, "");
}

function isRemote(base: string) {
  return /^https?:\/\//.test(base);
}

/**
 * Prioridad: flag > env > components.json > registry local del monorepo >
 * registry remoto por defecto.
 */
export function resolveRegistryBase(
  cwd: string,
  config: ComponentsConfig,
  flag?: string,
) {
  const explicit =
    flag ?? process.env.DESKUI_REGISTRY ?? config.registry;

  if (explicit) {
    return normalizeBase(explicit, cwd);
  }

  const localRegistry = path.resolve(cliRoot, "../ui/dist/registry");
  if (existsSync(path.join(localRegistry, "registry.json"))) {
    return localRegistry;
  }

  const bundledRegistry = path.join(cliRoot, "registry");
  if (existsSync(path.join(bundledRegistry, "registry.json"))) {
    return bundledRegistry;
  }

  return DEFAULT_REGISTRY;
}

async function readJson(base: string, fileName: string, cwd: string) {
  if (isRemote(base)) {
    const url = `${base}/${fileName}`;
    const response = await fetch(url, {
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `No se pudo descargar ${url} (HTTP ${response.status}).`,
      );
    }

    return JSON.parse(await response.text()) as unknown;
  }

  const localBase = base.startsWith("file://")
    ? fileURLToPath(base)
    : base;

  const file = path.join(
    path.isAbsolute(localBase) ? localBase : path.resolve(cwd, localBase),
    fileName,
  );

  if (!existsSync(file)) {
    throw new Error(`No se encontró el archivo del registry: ${file}`);
  }

  return JSON.parse(await readFile(file, "utf8")) as unknown;
}

export async function loadRegistryItem(
  base: string,
  name: string,
  cwd: string,
): Promise<RegistryItem> {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    throw new Error(`Nombre de componente inválido: ${name}`);
  }

  const item = (await readJson(base, `${name}.json`, cwd)) as RegistryItem;

  if (!item || item.name !== name || !Array.isArray(item.files)) {
    throw new Error(`El item "${name}" del registry no es válido.`);
  }

  return item;
}

export async function loadRegistryIndex(
  base: string,
  cwd: string,
): Promise<RegistryIndex> {
  const index = (await readJson(base, "registry.json", cwd)) as RegistryIndex;

  if (!index || !Array.isArray(index.items)) {
    throw new Error("El índice del registry no es válido.");
  }

  return index;
}

/** Resuelve dependencias en profundidad y las devuelve antes que sus padres. */
export async function resolveItems(
  base: string,
  names: string[],
  cwd: string,
): Promise<ResolvedItem[]> {
  const resolved = new Map<string, ResolvedItem>();
  const visiting = new Set<string>();

  async function visit(name: string, explicit: boolean): Promise<void> {
    if (visiting.has(name)) {
      return;
    }

    if (resolved.has(name)) {
      if (explicit) {
        const current = resolved.get(name);
        if (current) {
          current.explicit = true;
        }
      }
      return;
    }

    visiting.add(name);
    const item = await loadRegistryItem(base, name, cwd);

    for (const dependency of item.registryDependencies ?? []) {
      await visit(dependency, false);
    }

    visiting.delete(name);

    const alreadyResolved = resolved.get(name);
    if (alreadyResolved) {
      if (explicit) {
        alreadyResolved.explicit = true;
      }
      return;
    }

    resolved.set(name, { item, explicit });
  }

  for (const name of names) {
    await visit(name, true);
  }

  return [...resolved.values()];
}
