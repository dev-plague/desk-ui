import { describe, expect, it } from "vitest";

import {
  countBlocks,
  createBlankDocument,
  createBlock,
  duplicateBlock,
  findBlock,
  getBlockPath,
  insertBlock,
  moveBlock,
  moveBlockToRootEnd,
  moveBlockWithinParent,
  normalizeDocument,
  parseBuilderDocument,
  removeBlock,
  updateBlockProps,
} from "./model";

function heading(text: string) {
  return createBlock("heading", { text });
}

describe("modelo del Page Builder", () => {
  it("crea bloques con los valores por defecto y contenedores con hijos", () => {
    const card = createBlock("card", { title: "Proyectos" });
    expect(card.type).toBe("card");
    expect(card.props.title).toBe("Proyectos");
    expect(card.children).toEqual([]);

    const text = heading("Hola");
    expect(text.children).toBeUndefined();
    expect(text.props.level).toBe("h2");
  });

  it("inserta bloques antes, después y dentro de un contenedor", () => {
    const first = heading("Primero");
    const second = heading("Segundo");
    const card = createBlock("card", { title: "Tarjeta" });
    const child = heading("Hijo");

    let blocks = insertBlock([], first, null, "after");
    blocks = insertBlock(blocks, card, first.id, "after");
    blocks = insertBlock(blocks, second, first.id, "before");
    blocks = insertBlock(blocks, child, card.id, "inside");

    expect(blocks.map((block) => block.id)).toEqual([
      second.id,
      first.id,
      card.id,
    ]);
    expect(blocks[2]?.children?.map((block) => block.id)).toEqual([child.id]);
    expect(countBlocks(blocks)).toBe(4);
  });

  it("encuentra la ruta y el padre de un bloque anidado", () => {
    const card = createBlock("card", { title: "Tarjeta" });
    const child = heading("Hijo");
    const blocks = insertBlock([card], child, card.id, "inside");

    expect(findBlock(blocks, child.id)?.parent?.id).toBe(card.id);
    expect(getBlockPath(blocks, child.id).map((block) => block.id)).toEqual([
      card.id,
      child.id,
    ]);
    expect(findBlock(blocks, "no-existe")).toBeNull();
  });

  it("reordena hermanos con las direcciones y al final de la raíz", () => {
    const a = heading("A");
    const b = heading("B");
    const c = heading("C");
    const blocks = [a, b, c];

    expect(
      moveBlockWithinParent(blocks, b.id, -1).map((block) => block.id),
    ).toEqual([b.id, a.id, c.id]);
    expect(
      moveBlockWithinParent(blocks, b.id, 1).map((block) => block.id),
    ).toEqual([a.id, c.id, b.id]);
    expect(
      moveBlockWithinParent(blocks, a.id, -1).map((block) => block.id),
    ).toEqual([a.id, b.id, c.id]);
    expect(
      moveBlockToRootEnd(blocks, a.id).map((block) => block.id),
    ).toEqual([b.id, c.id, a.id]);
  });

  it("mueve bloques entre contenedores y rechaza ciclos", () => {
    const card = createBlock("card", { title: "Tarjeta" });
    const child = heading("Hijo");
    const external = heading("Externo");
    const blocks = insertBlock(
      insertBlock([card], child, card.id, "inside"),
      external,
      null,
      "after",
    );

    const moved = moveBlock(blocks, external.id, card.id, "inside");
    expect(moved[0]?.children?.map((block) => block.id)).toEqual([
      child.id,
      external.id,
    ]);

    const cyclic = moveBlock(moved, card.id, external.id, "inside");
    expect(cyclic[0]?.id).toBe(card.id);
    expect(cyclic[0]?.children?.[1]?.id).toBe(external.id);
  });

  it("duplica bloques con identificadores nuevos y conserva el original", () => {
    const card = createBlock("card", { title: "Tarjeta" });
    const child = heading("Hijo");
    const blocks = insertBlock([card], child, card.id, "inside");

    const result = duplicateBlock(blocks, card.id);
    expect(result).not.toBeNull();
    if (!result) {
      return;
    }

    expect(result.blocks).toHaveLength(2);
    const clone = result.blocks[1];
    expect(clone?.id).toBe(result.newId);
    expect(clone?.id).not.toBe(card.id);
    expect(clone?.children?.[0]?.id).not.toBe(child.id);
    expect(blocks[0]?.children?.[0]?.id).toBe(child.id);
  });

  it("elimina bloques anidados sin tocar el resto del árbol", () => {
    const card = createBlock("card", { title: "Tarjeta" });
    const child = heading("Hijo");
    const external = heading("Externo");
    const blocks = insertBlock(
      insertBlock([card], child, card.id, "inside"),
      external,
      null,
      "after",
    );

    const result = removeBlock(blocks, child.id);
    expect(result[0]?.children).toEqual([]);
    expect(result[1]?.id).toBe(external.id);
  });

  it("sanea propiedades desconocidas y valores de select inválidos", () => {
    const block = heading("Hola");
    const updated = updateBlockProps([block], block.id, {
      level: "h6",
      evil: "payload",
      align: "center",
    });

    expect(updated[0]?.props.level).toBe("h2");
    expect(updated[0]?.props.align).toBe("center");
    expect(updated[0]?.props).not.toHaveProperty("evil");
  });

  it("normaliza documentos importados y genera ids únicos", () => {
    const parsed = parseBuilderDocument(
      JSON.stringify({
        version: 1,
        title: "  Mi página  ",
        theme: "desert",
        background: "desktop",
        blocks: [
          {
            id: "same",
            type: "heading",
            props: { text: "Hola", level: "h1", evil: true },
          },
          { id: "same", type: "text", props: { text: "Mundo" } },
        ],
      }),
    );

    expect(parsed.title).toBe("Mi página");
    expect(parsed.theme).toBe("desert");
    expect(parsed.background).toBe("desktop");
    expect(parsed.blocks[0]?.props.level).toBe("h1");
    expect(parsed.blocks[0]?.props).not.toHaveProperty("evil");
    expect(parsed.blocks[0]?.id).not.toBe(parsed.blocks[1]?.id);
  });

  it("acepta valores numéricos en selects y los normaliza a string", () => {
    const parsed = normalizeDocument({
      version: 1,
      blocks: [
        { type: "columns", props: { columns: 3 } },
        { type: "image", props: { size: 16 } },
      ],
    });

    expect(parsed.blocks[0]?.props.columns).toBe("3");
    expect(parsed.blocks[1]?.props.size).toBe("16");
  });

  it("sanea los ids importados para que sean válidos en HTML", () => {
    const parsed = normalizeDocument({
      version: 1,
      blocks: [{ id: "  mi bloque <x> ", type: "heading" }],
    });
    expect(parsed.blocks[0]?.id).toBe("mi-bloque-x");
  });

  it("rechaza JSON inválido, versiones y tipos desconocidos", () => {
    expect(() => parseBuilderDocument("{ no es json")).toThrow(/JSON/);
    expect(() =>
      normalizeDocument({ version: 2, blocks: [] }),
    ).toThrow(/versión/);
    expect(() =>
      normalizeDocument({
        version: 1,
        blocks: [{ type: "bloque-inventado", props: {} }],
      }),
    ).toThrow(/tipo de bloque desconocido/);
    expect(() =>
      normalizeDocument({ version: 1, blocks: "no-es-una-lista" }),
    ).toThrow(/lista de bloques/);
  });

  it("usa valores por defecto cuando faltan metadatos", () => {
    const parsed = normalizeDocument({ version: 1, blocks: [] });
    expect(parsed.title).toBe("Página sin título");
    expect(parsed.theme).toBe("classic");
    expect(parsed.background).toBe("surface");
    expect(createBlankDocument().blocks).toEqual([]);
  });
});
