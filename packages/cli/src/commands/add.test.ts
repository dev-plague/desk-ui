import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { addComponents } from "./add";
import { listComponents } from "./list";
import {
  makeRegistry,
  makeTempProject,
  readProjectFile,
  writeConsumerConfig,
} from "../test/helpers";

describe("add", () => {
  it("resolves registry dependencies before the requested component", async () => {
    const cwd = await makeTempProject();
    const registry = await makeRegistry();
    await writeConsumerConfig(cwd);

    const result = await addComponents(["button"], {
      cwd,
      registry,
      install: false,
    });

    expect(result.actions.map((action) => action.file)).toEqual([
      "src/lib/utils.ts",
      "src/components/ui/button.tsx",
    ]);

    const button = await readProjectFile(cwd, "src/components/ui/button.tsx");
    expect(button).toContain('from "@/lib/utils"');
    expect(existsSync(path.join(cwd, "src/lib/utils.ts"))).toBe(true);
  });

  it("rewrites imports to the configured alias", async () => {
    const cwd = await makeTempProject();
    const registry = await makeRegistry();
    await writeConsumerConfig(cwd, {
      aliases: {
        components: "~/components",
        utils: "~/lib/utils",
        ui: "~/components/ui",
        lib: "~/lib",
      },
    });

    await addComponents(["button"], { cwd, registry, install: false });

    const button = await readProjectFile(cwd, "src/components/ui/button.tsx");
    expect(button).toContain('from "~/lib/utils"');
  });

  it("refuses to overwrite a requested file unless --overwrite is set", async () => {
    const cwd = await makeTempProject();
    const registry = await makeRegistry();
    await writeConsumerConfig(cwd);

    await addComponents(["button"], { cwd, registry, install: false });
    const buttonPath = path.join(cwd, "src/components/ui/button.tsx");
    await writeFile(buttonPath, `${await readFile(buttonPath, "utf8")}// local\n`);

    await expect(
      addComponents(["button"], { cwd, registry, install: false }),
    ).rejects.toThrow("--overwrite");

    const result = await addComponents(["button"], {
      cwd,
      registry,
      install: false,
      overwrite: true,
    });

    expect(result.actions.at(-1)?.status).toBe("updated");
    expect(await readFile(buttonPath, "utf8")).not.toContain("// local");
  });

  it("does not write files in dry-run mode", async () => {
    const cwd = await makeTempProject();
    const registry = await makeRegistry();
    await writeConsumerConfig(cwd);

    const result = await addComponents(["button"], {
      cwd,
      registry,
      install: false,
      dryRun: true,
    });

    expect(result.actions.every((action) => action.status === "created")).toBe(
      true,
    );
    expect(
      existsSync(path.join(cwd, "src/components/ui/button.tsx")),
    ).toBe(false);
  });

  it("rejects targets outside the project", async () => {
    const cwd = await makeTempProject();
    const registry = await makeRegistry();
    await writeConsumerConfig(cwd);
    await writeFile(
      path.join(registry, "evil.json"),
      `${JSON.stringify(
        {
          name: "evil",
          type: "registry:ui",
          files: [
            {
              path: "../../evil.ts",
              target: "../../evil.ts",
              type: "registry:ui",
              content: "export const evil = true;\n",
            },
          ],
        },
        null,
        2,
      )}\n`,
    );

    await expect(
      addComponents(["evil"], { cwd, registry, install: false }),
    ).rejects.toThrow("fuera del proyecto");
  });
});

describe("list", () => {
  it("reads the registry index", async () => {
    const cwd = await makeTempProject();
    const registry = await makeRegistry();
    await writeConsumerConfig(cwd);

    const result = await listComponents({ cwd, registry });

    expect(result.items.map((item) => item.name)).toEqual(["utils", "button"]);
  });
});
