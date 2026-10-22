import { cp, mkdir, readFile, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "skills");
const targets = [
  path.join(root, ".opencode", "skills"),
  path.join(root, ".agents", "skills"),
];
const checkOnly = process.argv.includes("--check");

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

async function listFiles(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolute, base)));
    } else {
      files.push(path.relative(base, absolute));
    }
  }
  return files.sort();
}

async function skillDirs() {
  const entries = await readdir(source, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

async function compare(target) {
  const drift = [];
  for (const skill of await skillDirs()) {
    const sourceDir = path.join(source, skill);
    const targetDir = path.join(target, skill);
    if (!(await exists(targetDir))) {
      drift.push(`${skill}: falta la copia`);
      continue;
    }

    const sourceFiles = await listFiles(sourceDir);
    const targetFiles = await listFiles(targetDir);
    if (sourceFiles.join("|") !== targetFiles.join("|")) {
      drift.push(`${skill}: distinta lista de archivos`);
      continue;
    }

    for (const file of sourceFiles) {
      const left = await readFile(path.join(sourceDir, file), "utf8");
      const right = await readFile(path.join(targetDir, file), "utf8");
      if (left !== right) {
        drift.push(`${skill}/${file}: contenido desincronizado`);
      }
    }
  }
  return drift;
}

if (checkOnly) {
  let failed = false;
  for (const target of targets) {
    const drift = await compare(target);
    if (drift.length > 0) {
      failed = true;
      console.error(`\n${path.relative(root, target)}:`);
      for (const item of drift) {
        console.error(`  - ${item}`);
      }
    }
  }

  if (failed) {
    console.error(
      "\nEjecuta `pnpm skills:sync` y vuelve a comprobar.\n",
    );
    process.exitCode = 1;
  } else {
    console.log("Skills sincronizadas.");
  }
} else {
  const skills = await skillDirs();
  for (const target of targets) {
    await mkdir(target, { recursive: true });
    for (const skill of skills) {
      const destination = path.join(target, skill);
      await rm(destination, { recursive: true, force: true });
      await cp(path.join(source, skill), destination, { recursive: true });
    }
    console.log(
      `${path.relative(root, target)}: ${skills.length} skills sincronizadas.`,
    );
  }
}
