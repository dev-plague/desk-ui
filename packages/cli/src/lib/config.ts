import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ComponentsConfig } from "../types";
import { toPosix } from "./files";

export interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

const CSS_CANDIDATES = [
  "src/index.css",
  "src/app/globals.css",
  "app/globals.css",
  "src/globals.css",
  "src/styles.css",
  "src/App.css",
  "index.css",
];

export async function readPackageJson(cwd: string): Promise<PackageJson> {
  const file = path.join(cwd, "package.json");

  if (!existsSync(file)) {
    throw new Error(
      "No se encontró package.json. Ejecuta el CLI desde la raíz de un proyecto Node.",
    );
  }

  return JSON.parse(await readFile(file, "utf8")) as PackageJson;
}

export async function readConfig(cwd: string): Promise<ComponentsConfig> {
  const file = path.join(cwd, "components.json");

  if (!existsSync(file)) {
    throw new Error(
      "No se encontró components.json. Ejecuta primero `npx @deskui/cli init`.",
    );
  }

  return JSON.parse(await readFile(file, "utf8")) as ComponentsConfig;
}

export async function hasTsconfigAlias(cwd: string, alias: string) {
  const candidates = ["tsconfig.json", "tsconfig.app.json", "jsconfig.json"];

  for (const candidate of candidates) {
    const file = path.join(cwd, candidate);
    if (!existsSync(file)) {
      continue;
    }

    try {
      const raw = await readFile(file, "utf8");
      const parsed = JSON.parse(stripJsonComments(raw)) as {
        compilerOptions?: { paths?: Record<string, unknown> };
      };
      const paths = parsed.compilerOptions?.paths;

      if (paths) {
        const configured = Object.keys(paths).some(
          (key) => key.startsWith(alias) && key.endsWith("*"),
        );
        if (configured) {
          return true;
        }
      }
    } catch {
      // Ignora tsconfig no estándar.
    }
  }

  return false;
}

export function normalizeAlias(alias: string) {
  const trimmed = alias.trim();
  if (!trimmed) {
    return "@/";
  }

  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

function stripJsonComments(input: string) {
  let output = "";
  let inString = false;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (inLineComment) {
      if (char === "\n") {
        inLineComment = false;
        output += char;
      }
      continue;
    }

    if (inBlockComment) {
      if (char === "*" && next === "/") {
        inBlockComment = false;
        index += 1;
      }
      continue;
    }

    if (inString) {
      output += char;
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      output += char;
      continue;
    }

    if (char === "/" && next === "/") {
      inLineComment = true;
      index += 1;
      continue;
    }

    if (char === "/" && next === "*") {
      inBlockComment = true;
      index += 1;
      continue;
    }

    output += char;
  }

  return output.replace(/,\s*([}\]])/g, "$1");
}

/** Detecta el alias de imports (`@/`, `~/`, etc.) desde tsconfig/jsconfig. */
export async function detectAlias(cwd: string) {
  const candidates = ["tsconfig.json", "tsconfig.app.json", "jsconfig.json"];

  for (const candidate of candidates) {
    const file = path.join(cwd, candidate);
    if (!existsSync(file)) {
      continue;
    }

    try {
      const raw = await readFile(file, "utf8");
      const parsed = JSON.parse(stripJsonComments(raw)) as {
        compilerOptions?: { paths?: Record<string, unknown> };
      };
      const paths = parsed.compilerOptions?.paths;

      if (paths) {
        const keys = Object.keys(paths);
        const preferred =
          keys.find((key) => key === "@/*") ??
          keys.find((key) => key.endsWith("/*"));

        if (preferred) {
          return normalizeAlias(preferred.slice(0, -1));
        }
      }
    } catch {
      // Un tsconfig con sintaxis no estándar no debe bloquear el init.
    }
  }

  return "@/";
}

function aliasPrefix(config: ComponentsConfig) {
  const utilsAlias = config.aliases?.utils ?? "@/lib/utils";
  const suffix = "lib/utils";
  const index = utilsAlias.indexOf(suffix);
  return index >= 0 ? utilsAlias.slice(0, index) : "@/";
}

/** Reescribe `@/...` al alias configurado por el proyecto. */
export function rewriteAlias(content: string, config: ComponentsConfig) {
  const prefix = aliasPrefix(config);
  return prefix === "@/"
    ? content
    : content.replaceAll("@/", prefix);
}

export function findCssFile(cwd: string, explicit?: string) {
  const candidates = explicit ? [explicit] : CSS_CANDIDATES;

  for (const candidate of candidates) {
    if (existsSync(path.join(cwd, candidate))) {
      return toPosix(candidate);
    }
  }

  return null;
}

export function toImportSpecifier(fromFile: string, toFile: string) {
  let relative = toPosix(path.relative(path.dirname(fromFile), toFile));
  if (!relative.startsWith(".")) {
    relative = `./${relative}`;
  }
  return relative;
}

/**
 * Inserta el import de tokens justo después de la directiva de Tailwind.
 * Los `@import` deben preceder al resto de reglas CSS.
 */
export function addStyleImport(content: string, specifier: string) {
  if (content.includes("deskui.css")) {
    return content;
  }

  const importLine = `@import "${specifier}";`;
  if (content.includes(importLine)) {
    return content;
  }

  const newline = content.includes("\r\n") ? "\r\n" : "\n";
  const lines = content.split(/\r?\n/);

  const tailwindImport = lines.findIndex((line) =>
    /^\s*@import\s+["']tailwindcss["'];?\s*$/.test(line),
  );
  if (tailwindImport >= 0) {
    lines.splice(tailwindImport + 1, 0, "", importLine);
    return lines.join(newline);
  }

  const tailwindBase = lines.findIndex((line) =>
    /^\s*@tailwind\s+base;/.test(line),
  );
  if (tailwindBase >= 0) {
    lines.splice(tailwindBase + 1, 0, "", importLine);
    return lines.join(newline);
  }

  return `${importLine}${newline}${content}`;
}

export function packageDependencies(pkg: PackageJson) {
  return {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
  };
}

export function tailwindMajor(version?: string) {
  if (!version) {
    return null;
  }

  const match = version.match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

export function detectPackageManager(cwd: string) {
  if (
    existsSync(path.join(cwd, "bun.lockb")) ||
    existsSync(path.join(cwd, "bun.lock"))
  ) {
    return "bun" as const;
  }
  if (existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm" as const;
  }
  if (existsSync(path.join(cwd, "yarn.lock"))) {
    return "yarn" as const;
  }
  return "npm" as const;
}
