import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = fileURLToPath(new URL(".", import.meta.url));

function findUp(start: string, fileName: string, maxDepth = 5) {
  let current = start;

  for (let index = 0; index < maxDepth; index += 1) {
    if (existsSync(path.join(current, fileName))) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  return start;
}

/** Raíz del paquete CLI, tanto en `src/` como en el bundle de `dist/`. */
export const cliRoot = findUp(moduleDir, "package.json");
