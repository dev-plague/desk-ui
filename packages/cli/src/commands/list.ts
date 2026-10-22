import { readConfig } from "../lib/config";
import { loadRegistryIndex, resolveRegistryBase } from "../lib/registry";
import type { ComponentsConfig, RegistryItem } from "../types";

export interface ListResult {
  registry: string;
  items: RegistryItem[];
}

export async function listComponents(options: {
  cwd: string;
  registry?: string;
}): Promise<ListResult> {
  let config: ComponentsConfig = {};

  try {
    config = await readConfig(options.cwd);
  } catch {
    // `list` también funciona antes de ejecutar init.
  }

  const registry = resolveRegistryBase(options.cwd, config, options.registry);
  const index = await loadRegistryIndex(registry, options.cwd);

  return {
    registry,
    items: index.items ?? [],
  };
}
