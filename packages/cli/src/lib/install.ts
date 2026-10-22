import { spawnSync } from "node:child_process";

import { detectPackageManager } from "./config";

export function installPackages(
  cwd: string,
  packages: string[],
  manager = detectPackageManager(cwd),
) {
  const unique = [...new Set(packages)];

  if (unique.length === 0) {
    return manager;
  }

  const args =
    manager === "npm" ? ["install", ...unique] : ["add", ...unique];

  const result = spawnSync(manager, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `La instalación con ${manager} falló (código ${result.status ?? "desconocido"}).`,
    );
  }

  return manager;
}
