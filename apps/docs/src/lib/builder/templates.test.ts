import { describe, expect, it } from "vitest";

import { countBlocks, flattenBlocks, parseBuilderDocument } from "./model";
import {
  BUILDER_TEMPLATES,
  findBuilderTemplate,
} from "./templates";

describe("plantillas del Page Builder", () => {
  it("incluye las cinco plantillas del MVP y una página en blanco", () => {
    const ids = BUILDER_TEMPLATES.map((template) => template.id);
    expect(ids).toEqual([
      "blank",
      "escritorio",
      "formulario",
      "tienda",
      "red-social",
      "pagina-personal",
    ]);
    expect(findBuilderTemplate("tienda")?.label).toBe("Tienda");
    expect(findBuilderTemplate("no-existe")).toBeUndefined();
  });

  it.each(BUILDER_TEMPLATES)(
    "la plantilla $label sobrevive a la serialización y validación",
    (template) => {
      const document = template.create();
      const parsed = parseBuilderDocument(JSON.stringify(document));

      expect(parsed.title).toBe(document.title);
      expect(parsed.theme).toBe(document.theme);
      expect(parsed.background).toBe(document.background);
      expect(countBlocks(parsed.blocks)).toBe(countBlocks(document.blocks));

      const ids = flattenBlocks(parsed.blocks).map((block) => block.id);
      expect(new Set(ids).size).toBe(ids.length);
    },
  );

  it("traduce el contenido de las plantillas al inglés", () => {
    const template = findBuilderTemplate("tienda", "en");
    const document = template?.create();

    expect(template?.label).toBe("Store");
    expect(document?.title).toBe("Retro store");
    expect(document?.blocks[0]?.props.eyebrow).toBe("Weekly deals");
  });

  it("las plantillas con contenido tienen varios bloques y contenedores", () => {
    for (const template of BUILDER_TEMPLATES) {
      const document = template.create();
      if (template.id === "blank") {
        expect(document.blocks).toEqual([]);
        continue;
      }

      expect(countBlocks(document.blocks)).toBeGreaterThan(4);
      expect(
        flattenBlocks(document.blocks).some((block) => block.children?.length),
      ).toBe(true);
    }
  });
});
