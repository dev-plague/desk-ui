import { existsSync } from "node:fs";
import path from "node:path";

import { cliRoot } from "./paths";

export interface TemplatePaths {
  cssPath: string;
  fontsDir: string;
  utilsPath: string;
  skillsDir: string;
}

/**
 * Prefer the templates baked into the published CLI. When running from the
 * monorepo (before a build), fall back to the source files in packages/ui.
 */
export function getTemplatePaths(): TemplatePaths {
  const candidates = [
    {
      cssPath: path.join(cliRoot, "../ui/src/styles/tokens.css"),
      fontsDir: path.join(cliRoot, "../ui/src/styles/fonts"),
      utilsPath: path.join(cliRoot, "../ui/src/lib/utils.ts"),
      skillsDir: path.join(cliRoot, "../../skills"),
    },
    {
      cssPath: path.join(cliRoot, "templates", "deskui.css"),
      fontsDir: path.join(cliRoot, "templates", "fonts"),
      utilsPath: path.join(cliRoot, "templates", "utils.ts"),
      skillsDir: path.join(cliRoot, "templates", "skills"),
    },
  ];

  const found = candidates.find(
    (candidate) =>
      existsSync(candidate.cssPath) &&
      existsSync(candidate.fontsDir) &&
      existsSync(candidate.utilsPath) &&
      existsSync(candidate.skillsDir),
  );

  if (!found) {
    throw new Error(
      "No se encontraron los templates de estilos. Ejecuta `pnpm build` en el paquete CLI.",
    );
  }

  return found;
}
