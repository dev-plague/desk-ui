import { describe, expect, it } from "vitest";

import { createBlankDocument, createBlock } from "./model";
import {
  BUILDER_STORAGE_KEY,
  clearBuilderDocument,
  loadBuilderDocument,
  saveBuilderDocument,
} from "./storage";
import { parseDragPayload } from "./types";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
    removeItem(key: string) {
      values.delete(key);
    },
    has(key: string) {
      return values.has(key);
    },
  };
}

describe("persistencia del Page Builder", () => {
  it("guarda y recupera el documento", () => {
    const storage = memoryStorage();
    const document = {
      ...createBlankDocument(),
      title: "Mi página",
      blocks: [createBlock("heading", { text: "Hola" })],
    };

    expect(saveBuilderDocument(document, storage)).toBe(true);
    expect(storage.has(BUILDER_STORAGE_KEY)).toBe(true);

    const loaded = loadBuilderDocument(storage);
    expect(loaded?.title).toBe("Mi página");
    expect(loaded?.blocks[0]?.props.text).toBe("Hola");
  });

  it("descarta JSON corrupto o incompatible sin bloquear el editor", () => {
    const corrupt = memoryStorage();
    corrupt.setItem(BUILDER_STORAGE_KEY, "{ no es json");
    expect(loadBuilderDocument(corrupt)).toBeNull();

    const incompatible = memoryStorage();
    incompatible.setItem(
      BUILDER_STORAGE_KEY,
      JSON.stringify({ version: 99, blocks: [] }),
    );
    expect(loadBuilderDocument(incompatible)).toBeNull();
  });

  it("limpia el documento guardado", () => {
    const storage = memoryStorage();
    saveBuilderDocument(createBlankDocument(), storage);
    expect(clearBuilderDocument(storage)).toBe(true);
    expect(loadBuilderDocument(storage)).toBeNull();
  });

  it("devuelve false cuando el almacenamiento no está disponible", () => {
    expect(saveBuilderDocument(createBlankDocument(), null)).toBe(false);
    expect(clearBuilderDocument(null)).toBe(false);
    expect(loadBuilderDocument(null)).toBeNull();
  });

  it("no propaga errores de almacenamiento bloqueado", () => {
    const blocked = {
      getItem() {
        throw new Error("bloqueado");
      },
      setItem() {
        throw new Error("bloqueado");
      },
      removeItem() {
        throw new Error("bloqueado");
      },
    };

    expect(loadBuilderDocument(blocked)).toBeNull();
    expect(saveBuilderDocument(createBlankDocument(), blocked)).toBe(false);
    expect(clearBuilderDocument(blocked)).toBe(false);
  });
});

describe("payload de arrastrar y soltar", () => {
  it("interpreta bloques nuevos y movimientos", () => {
    expect(
      parseDragPayload(JSON.stringify({ kind: "new", type: "heading" })),
    ).toEqual({ kind: "new", type: "heading" });
    expect(
      parseDragPayload(JSON.stringify({ kind: "move", id: "block-1" })),
    ).toEqual({ kind: "move", id: "block-1" });
  });

  it("rechaza payloads inválidos", () => {
    expect(parseDragPayload("no-es-json")).toBeNull();
    expect(parseDragPayload(JSON.stringify({ kind: "otro" }))).toBeNull();
    expect(parseDragPayload(JSON.stringify({ kind: "move" }))).toBeNull();
  });
});
