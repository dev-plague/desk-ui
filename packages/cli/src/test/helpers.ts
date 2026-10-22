import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach } from "vitest";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })),
  );
});

export async function makeTempProject(options: {
  withSrc?: boolean;
  withCss?: boolean;
} = {}) {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "deskui-"));
  tempDirs.push(cwd);

  await writeFile(
    path.join(cwd, "package.json"),
    `${JSON.stringify(
      {
        name: "consumer",
        private: true,
        dependencies: {
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          tailwindcss: "^4.0.0",
        },
      },
      null,
      2,
    )}\n`,
  );

  await writeFile(
    path.join(cwd, "tsconfig.json"),
    `${JSON.stringify(
      {
        compilerOptions: {
          baseUrl: ".",
          paths: { "@/*": ["./src/*"] },
        },
      },
      null,
      2,
    )}\n`,
  );

  if (options.withSrc !== false) {
    await mkdir(path.join(cwd, "src"), { recursive: true });
  }

  if (options.withCss !== false) {
    await mkdir(path.join(cwd, "src"), { recursive: true });
    await writeFile(
      path.join(cwd, "src", "index.css"),
      '@import "tailwindcss";\n\nbody {\n  margin: 0;\n}\n',
    );
  }

  return cwd;
}

export async function makeRegistry() {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "deskui-registry-"));
  tempDirs.push(cwd);

  await writeFile(
    path.join(cwd, "registry.json"),
    `${JSON.stringify(
      {
        name: "test-registry",
        items: [
          { name: "utils", title: "Utilidades" },
          { name: "button", title: "Button" },
        ],
      },
      null,
      2,
    )}\n`,
  );

  await writeFile(
    path.join(cwd, "utils.json"),
    `${JSON.stringify(
      {
        name: "utils",
        type: "registry:lib",
        dependencies: ["clsx", "tailwind-merge"],
        files: [
          {
            path: "lib/utils.ts",
            target: "lib/utils.ts",
            type: "registry:lib",
            content: 'import { clsx } from "clsx";\nexport const cn = clsx;\n',
          },
        ],
      },
      null,
      2,
    )}\n`,
  );

  await writeFile(
    path.join(cwd, "button.json"),
    `${JSON.stringify(
      {
        name: "button",
        type: "registry:ui",
        dependencies: ["class-variance-authority"],
        registryDependencies: ["utils"],
        files: [
          {
            path: "components/ui/button.tsx",
            target: "components/ui/button.tsx",
            type: "registry:ui",
            content:
              'import { cn } from "@/lib/utils";\nexport function Button() {\n  return <button className={cn("button")} />;\n}\n',
          },
        ],
      },
      null,
      2,
    )}\n`,
  );

  return cwd;
}

export async function writeConsumerConfig(
  cwd: string,
  overrides: Record<string, unknown> = {},
) {
  await writeFile(
    path.join(cwd, "components.json"),
    `${JSON.stringify(
      {
        style: "classic",
        tsx: true,
        srcDir: true,
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
          ui: "@/components/ui",
          lib: "@/lib",
        },
        ...overrides,
      },
      null,
      2,
    )}\n`,
  );
}

export async function readProjectFile(cwd: string, relative: string) {
  return readFile(path.join(cwd, relative), "utf8");
}
