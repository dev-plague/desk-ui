import type { Locale } from "../../i18n/messages";
import {
  getBlockDefinition,
  isBuilderBlockType,
  propString,
} from "./catalog";
import {
  BUILDER_THEMES,
  type BuilderBackground,
  type BuilderBlock,
  type BuilderBlockType,
  type BuilderDocument,
  type BuilderDropPosition,
  type BuilderProps,
  type BuilderTheme,
} from "./types";

const MAX_BLOCKS = 200;
const MAX_DEPTH = 8;
const MAX_TEXT = 10_000;

let idCounter = 0;

function observeId(id: string) {
  const match = /^block-(\d+)$/.exec(id);
  if (!match) {
    return;
  }
  const value = Number(match[1]);
  if (Number.isFinite(value) && value > idCounter) {
    idCounter = value;
  }
}

export function createBlockId(): string {
  idCounter += 1;
  return `block-${idCounter}`;
}

function clampText(value: string, max = MAX_TEXT): string {
  return value.length > max ? value.slice(0, max) : value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isContainerBlock(block: BuilderBlock): boolean {
  return Boolean(getBlockDefinition(block.type).container);
}

/**
 * Copia solo las props conocidas del tipo. Evita que un JSON importado
 * introduzca claves arbitrarias en el modelo o en el JSX exportado.
 */
export function sanitizeBlockProps(
  type: BuilderBlockType,
  raw: Record<string, unknown>,
): BuilderProps {
  const definition = getBlockDefinition(type);
  const props: BuilderProps = { ...definition.defaults };

  for (const field of definition.fields) {
    if (!(field.key in raw)) {
      continue;
    }

    const value = raw[field.key];

    if (field.type === "checkbox") {
      if (typeof value === "boolean") {
        props[field.key] = value;
      }
      continue;
    }

    if (field.type === "number") {
      const parsed =
        typeof value === "number"
          ? value
          : typeof value === "string"
            ? Number(value)
            : Number.NaN;
      if (Number.isFinite(parsed)) {
        props[field.key] = Math.max(-1_000_000, Math.min(1_000_000, parsed));
      }
      continue;
    }

    if (field.type === "select") {
      const candidate =
        typeof value === "string"
          ? value
          : typeof value === "number"
            ? String(value)
            : null;
      if (
        candidate !== null &&
        field.options.some((option) => option.value === candidate)
      ) {
        props[field.key] = candidate;
      }
      continue;
    }

    if (typeof value === "string") {
      props[field.key] = clampText(value);
    } else if (typeof value === "number") {
      props[field.key] = clampText(String(value));
    }
  }

  return props;
}

export function createBlock(
  type: BuilderBlockType,
  props: Record<string, unknown> = {},
  children: BuilderBlock[] = [],
  locale: Locale = "es",
): BuilderBlock {
  const definition = getBlockDefinition(type, locale);
  const block: BuilderBlock = {
    id: createBlockId(),
    type,
    props: sanitizeBlockProps(type, { ...definition.defaults, ...props }),
  };

  if (definition.container) {
    block.children = children;
  }

  return block;
}

export function createBlankDocument(locale: Locale = "es"): BuilderDocument {
  return {
    version: 1,
    title: locale === "en" ? "Untitled page" : "Página sin título",
    theme: "classic",
    background: "surface",
    blocks: [],
  };
}

export function countBlocks(blocks: readonly BuilderBlock[]): number {
  return blocks.reduce(
    (total, block) => total + 1 + countBlocks(block.children ?? []),
    0,
  );
}

export function flattenBlocks(blocks: readonly BuilderBlock[]): BuilderBlock[] {
  return blocks.flatMap((block) => [block, ...flattenBlocks(block.children ?? [])]);
}

export interface BuilderBlockLocation {
  block: BuilderBlock;
  parent: BuilderBlock | null;
  siblings: BuilderBlock[];
  index: number;
}

export function findBlock(
  blocks: readonly BuilderBlock[],
  id: string,
  parent: BuilderBlock | null = null,
): BuilderBlockLocation | null {
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (!block) {
      continue;
    }
    if (block.id === id) {
      return { block, parent, siblings: [...blocks], index };
    }
    const nested = findBlock(block.children ?? [], id, block);
    if (nested) {
      return nested;
    }
  }
  return null;
}

export function getBlockPath(
  blocks: readonly BuilderBlock[],
  id: string,
): BuilderBlock[] {
  for (const block of blocks) {
    if (block.id === id) {
      return [block];
    }
    const nested = getBlockPath(block.children ?? [], id);
    if (nested.length > 0) {
      return [block, ...nested];
    }
  }
  return [];
}

export function getParentId(
  blocks: readonly BuilderBlock[],
  id: string,
): string | null {
  return findBlock(blocks, id)?.parent?.id ?? null;
}

export function containsBlock(block: BuilderBlock, id: string): boolean {
  return (block.children ?? []).some(
    (child) => child.id === id || containsBlock(child, id),
  );
}

function insertInto(
  nodes: readonly BuilderBlock[],
  targetId: string | null,
  position: BuilderDropPosition,
  block: BuilderBlock,
): BuilderBlock[] | null {
  if (targetId === null) {
    return [...nodes, block];
  }

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (!node) {
      continue;
    }

    if (node.id === targetId) {
      const copy = [...nodes];
      if (position === "inside" && isContainerBlock(node)) {
        copy[index] = {
          ...node,
          children: [...(node.children ?? []), block],
        };
      } else if (position === "before") {
        copy.splice(index, 0, block);
      } else {
        copy.splice(index + 1, 0, block);
      }
      return copy;
    }

    if (node.children && node.children.length > 0) {
      const children = insertInto(node.children, targetId, position, block);
      if (children) {
        const copy = [...nodes];
        copy[index] = { ...node, children };
        return copy;
      }
    }
  }

  return null;
}

/** Inserta un bloque nuevo antes, después o dentro del bloque objetivo. */
export function insertBlock(
  blocks: readonly BuilderBlock[],
  block: BuilderBlock,
  targetId: string | null,
  position: BuilderDropPosition = "after",
): BuilderBlock[] {
  return insertInto(blocks, targetId, position, block) ?? [...blocks];
}

export function removeBlock(
  blocks: readonly BuilderBlock[],
  id: string,
): BuilderBlock[] {
  return blocks
    .filter((block) => block.id !== id)
    .map((block) =>
      block.children && block.children.length > 0
        ? { ...block, children: removeBlock(block.children, id) }
        : block,
    );
}

export function updateBlockProps(
  blocks: readonly BuilderBlock[],
  id: string,
  props: Record<string, unknown>,
): BuilderBlock[] {
  return blocks.map((block) => {
    if (block.id === id) {
      return {
        ...block,
        props: sanitizeBlockProps(block.type, {
          ...block.props,
          ...props,
        }),
      };
    }
    if (block.children && block.children.length > 0) {
      return {
        ...block,
        children: updateBlockProps(block.children, id, props),
      };
    }
    return block;
  });
}

function cloneBlockWithNewIds(block: BuilderBlock): BuilderBlock {
  return {
    id: createBlockId(),
    type: block.type,
    props: { ...block.props },
    ...(isContainerBlock(block)
      ? { children: (block.children ?? []).map(cloneBlockWithNewIds) }
      : {}),
  };
}

function duplicateInto(
  nodes: readonly BuilderBlock[],
  id: string,
): { blocks: BuilderBlock[]; newId: string } | null {
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (!node) {
      continue;
    }

    if (node.id === id) {
      const clone = cloneBlockWithNewIds(node);
      const copy = [...nodes];
      copy.splice(index + 1, 0, clone);
      return { blocks: copy, newId: clone.id };
    }

    if (node.children && node.children.length > 0) {
      const nested = duplicateInto(node.children, id);
      if (nested) {
        const copy = [...nodes];
        copy[index] = { ...node, children: nested.blocks };
        return { blocks: copy, newId: nested.newId };
      }
    }
  }

  return null;
}

export function duplicateBlock(
  blocks: readonly BuilderBlock[],
  id: string,
): { blocks: BuilderBlock[]; newId: string } | null {
  return duplicateInto(blocks, id);
}

/**
 * Mueve un bloque existente. Rechaza moverlo dentro de sí mismo o de uno de
 * sus descendientes, y no permite usar como destino `inside` un bloque que no
 * sea contenedor.
 */
export function moveBlock(
  blocks: readonly BuilderBlock[],
  id: string,
  targetId: string | null,
  position: BuilderDropPosition,
): BuilderBlock[] {
  if (id === targetId) {
    return [...blocks];
  }

  const location = findBlock(blocks, id);
  if (!location) {
    return [...blocks];
  }

  if (targetId !== null) {
    const target = findBlock(blocks, targetId);
    if (!target) {
      return [...blocks];
    }
    if (containsBlock(location.block, targetId)) {
      return [...blocks];
    }
    if (position === "inside" && !isContainerBlock(target.block)) {
      return [...blocks];
    }
  }

  const without = removeBlock(blocks, id);
  return insertInto(without, targetId, position, location.block) ?? [...blocks];
}

export function moveBlockWithinParent(
  blocks: readonly BuilderBlock[],
  id: string,
  direction: -1 | 1,
): BuilderBlock[] {
  const location = findBlock(blocks, id);
  if (!location) {
    return [...blocks];
  }

  const target = location.siblings[location.index + direction];
  if (!target) {
    return [...blocks];
  }

  return moveBlock(
    blocks,
    id,
    target.id,
    direction === -1 ? "before" : "after",
  );
}

export function moveBlockToRootEnd(
  blocks: readonly BuilderBlock[],
  id: string,
): BuilderBlock[] {
  return moveBlock(blocks, id, null, "after");
}

function normalizeId(rawId: string): string {
  const safe = rawId
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  return safe.length > 0 ? safe : createBlockId();
}

function normalizeBlock(
  raw: unknown,
  depth: number,
  state: { count: number; ids: Set<string> },
): BuilderBlock {
  if (!isRecord(raw)) {
    throw new Error("Cada bloque debe ser un objeto JSON.");
  }
  if (depth > MAX_DEPTH) {
    throw new Error(`La página supera la profundidad máxima de ${MAX_DEPTH} niveles.`);
  }
  if (typeof raw.type !== "string" || !isBuilderBlockType(raw.type)) {
    throw new Error("La página contiene un tipo de bloque desconocido.");
  }

  state.count += 1;
  if (state.count > MAX_BLOCKS) {
    throw new Error(`La página supera el límite de ${MAX_BLOCKS} bloques.`);
  }

  const definition = getBlockDefinition(raw.type);
  const rawProps = isRecord(raw.props) ? raw.props : {};
  const props = sanitizeBlockProps(raw.type, rawProps);

  let id =
    typeof raw.id === "string" && raw.id.trim().length > 0
      ? normalizeId(raw.id)
      : createBlockId();
  if (state.ids.has(id)) {
    id = createBlockId();
  }
  state.ids.add(id);
  observeId(id);

  const block: BuilderBlock = {
    id,
    type: raw.type,
    props,
  };

  if (definition.container) {
    const rawChildren = Array.isArray(raw.children) ? raw.children : [];
    block.children = rawChildren.map((child) =>
      normalizeBlock(child, depth + 1, state),
    );
  }

  return block;
}

export function normalizeDocument(input: unknown): BuilderDocument {
  if (!isRecord(input)) {
    throw new Error("El documento debe ser un objeto JSON.");
  }
  if (input.version !== 1) {
    throw new Error(
      "La versión del documento no es compatible. Se esperaba la versión 1.",
    );
  }
  if (!Array.isArray(input.blocks)) {
    throw new Error("El documento no contiene una lista de bloques.");
  }

  const state = { count: 0, ids: new Set<string>() };
  const blocks = input.blocks.map((block) => normalizeBlock(block, 1, state));

  const theme = BUILDER_THEMES.includes(input.theme as BuilderTheme)
    ? (input.theme as BuilderTheme)
    : "classic";
  const background: BuilderBackground = ["surface", "sunken", "desktop"].includes(
    String(input.background),
  )
    ? (input.background as BuilderBackground)
    : "surface";
  const title =
    typeof input.title === "string" && input.title.trim().length > 0
      ? clampText(input.title.trim(), 120)
      : "Página sin título";

  return {
    version: 1,
    title,
    theme,
    background,
    blocks,
  };
}

export function parseBuilderDocument(raw: string): BuilderDocument {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("El JSON no es válido: revisa comas, comillas y llaves.");
  }
  return normalizeDocument(parsed);
}

export function serializeBuilderDocument(
  document: BuilderDocument,
  pretty = true,
): string {
  return JSON.stringify(document, null, pretty ? 2 : 0);
}

export function documentSummary(document: BuilderDocument): string {
  const total = countBlocks(document.blocks);
  const first = document.blocks[0];
  const name = first ? propString(first.props, "title", first.type) : "vacía";
  return `${total} bloque${total === 1 ? "" : "s"} · ${name}`;
}
