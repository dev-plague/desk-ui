import { parseBuilderDocument, serializeBuilderDocument } from "./model";
import type { BuilderDocument } from "./types";

export const BUILDER_STORAGE_KEY = "deskui-builder-document-v1";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function safeStorage(): StorageLike | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Carga el último documento guardado. Un JSON corrupto o incompatible no
 * bloquea el constructor: se descarta y se empieza de cero.
 */
export function loadBuilderDocument(
  storage: StorageLike | null = safeStorage(),
): BuilderDocument | null {
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(BUILDER_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return parseBuilderDocument(raw);
  } catch {
    return null;
  }
}

export function saveBuilderDocument(
  document: BuilderDocument,
  storage: StorageLike | null = safeStorage(),
): boolean {
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(
      BUILDER_STORAGE_KEY,
      serializeBuilderDocument(document, false),
    );
    return true;
  } catch {
    return false;
  }
}

export function clearBuilderDocument(
  storage: StorageLike | null = safeStorage(),
): boolean {
  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(BUILDER_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
