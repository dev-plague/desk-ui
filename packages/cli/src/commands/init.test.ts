import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { initProject } from "./init";
import { makeTempProject } from "../test/helpers";

describe("init", () => {
  it("copies tokens, fonts, utils and wires a Tailwind 4 entrypoint", async () => {
    const cwd = await makeTempProject();
    const result = await initProject({ cwd, install: false });

    expect(result.warnings).toEqual([]);
    expect(result.cssFile).toBe("src/index.css");
    expect(result.cssModified).toBe(true);

    const css = await readFile(path.join(cwd, "src/styles/deskui.css"), "utf8");
    expect(css).toContain("--w95-surface");
    expect(css).toContain("@theme inline");

    const utils = await readFile(path.join(cwd, "src/lib/utils.ts"), "utf8");
    expect(utils).toContain("export function cn");

    expect(
      existsSync(path.join(cwd, "src/styles/fonts/w95fa.woff2")),
    ).toBe(true);
    expect(
      existsSync(path.join(cwd, "src/styles/fonts/W95FA-OFL.txt")),
    ).toBe(true);

    const entry = await readFile(path.join(cwd, "src/index.css"), "utf8");
    expect(entry).toContain('@import "./styles/deskui.css";');

    const config = JSON.parse(
      await readFile(path.join(cwd, "components.json"), "utf8"),
    ) as {
      srcDir: boolean;
      aliases: { utils: string };
      tailwind: { css: string };
    };

    expect(config.srcDir).toBe(true);
    expect(config.aliases.utils).toBe("@/lib/utils");
    expect(config.tailwind.css).toBe("src/index.css");

    expect(
      existsSync(path.join(cwd, ".agents/skills/deskui/SKILL.md")),
    ).toBe(true);
    expect(
      existsSync(path.join(cwd, ".opencode/skills/deskui/SKILL.md")),
    ).toBe(true);
    const agents = await readFile(path.join(cwd, "AGENTS.md"), "utf8");
    expect(agents).toContain("<!-- deskui:start -->");
    expect(agents).toContain(".agents/skills/deskui/SKILL.md");
  });

  it("is idempotent when the same configuration is applied twice", async () => {
    const cwd = await makeTempProject();

    await initProject({ cwd, install: false });
    const second = await initProject({ cwd, install: false });

    expect(second.created).toEqual([]);
    expect(second.cssModified).toBe(false);
    expect(second.unchanged).toContain("components.json");
    expect(second.unchanged).toContain("AGENTS.md");

    const agents = await readFile(path.join(cwd, "AGENTS.md"), "utf8");
    expect(agents.match(/<!-- deskui:start -->/g)).toHaveLength(1);
  });

  it("omits agent files with --no-agents", async () => {
    const cwd = await makeTempProject();

    await initProject({ cwd, install: false, agents: false });

    expect(existsSync(path.join(cwd, ".agents/skills"))).toBe(false);
    expect(existsSync(path.join(cwd, ".opencode/skills"))).toBe(false);
    expect(existsSync(path.join(cwd, "AGENTS.md"))).toBe(false);
  });

  it("preserves an existing AGENTS.md and appends the DeskUI section", async () => {
    const cwd = await makeTempProject();
    await writeFile(path.join(cwd, "AGENTS.md"), "# Mi proyecto\n\nReglas.\n");

    await initProject({ cwd, install: false });

    const agents = await readFile(path.join(cwd, "AGENTS.md"), "utf8");
    expect(agents).toContain("# Mi proyecto");
    expect(agents).toContain("<!-- deskui:start -->");
    expect(agents.match(/<!-- deskui:start -->/g)).toHaveLength(1);
  });

  it("detects the import alias from tsconfig comments", async () => {
    const cwd = await makeTempProject();
    await writeFile(
      path.join(cwd, "tsconfig.json"),
      `{
        // alias del proyecto
        "compilerOptions": {
          "baseUrl": ".",
          "paths": { "~/*": ["./src/*"] }
        }
      }\n`,
    );

    await initProject({ cwd, install: false });

    const config = JSON.parse(
      await readFile(path.join(cwd, "components.json"), "utf8"),
    ) as { aliases: { utils: string } };

    expect(config.aliases.utils).toBe("~/lib/utils");
  });

  it("works without src/ and warns when no CSS entrypoint exists", async () => {
    const cwd = await makeTempProject({ withSrc: false, withCss: false });
    const result = await initProject({ cwd, install: false });

    expect(
      existsSync(path.join(cwd, "styles/deskui.css")),
    ).toBe(true);
    expect(result.warnings.join(" ")).toContain("CSS de entrada");

    const config = JSON.parse(
      await readFile(path.join(cwd, "components.json"), "utf8"),
    ) as { srcDir: boolean };

    expect(config.srcDir).toBe(false);
  });
});
