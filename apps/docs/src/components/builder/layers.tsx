import { useState, type DragEvent, type KeyboardEvent } from "react";

import { Icon, cn } from "@deskui/ui";

import { useI18n } from "../../i18n/provider";
import { getBlockDefinition } from "../../lib/builder/catalog";
import {
  BUILDER_DND_MIME,
  parseDragPayload,
  type BuilderBlock,
  type BuilderDragPayload,
  type BuilderDropPosition,
} from "../../lib/builder/types";

interface DropHint {
  id: string;
  position: BuilderDropPosition;
}

function positionFor(
  event: DragEvent<HTMLElement>,
  block: BuilderBlock,
): BuilderDropPosition {
  const rect = event.currentTarget.getBoundingClientRect();
  const ratio = (event.clientY - rect.top) / Math.max(rect.height, 1);
  if (getBlockDefinition(block.type).container && ratio > 0.25 && ratio < 0.75) {
    return "inside";
  }
  return ratio < 0.5 ? "before" : "after";
}

function Twisty({
  open,
  hasChildren,
  onToggle,
}: {
  open: boolean;
  hasChildren: boolean;
  onToggle: () => void;
}) {
  if (!hasChildren) {
    return <span aria-hidden="true" className="h-4 w-4 shrink-0" />;
  }

  return (
    <button
      type="button"
      aria-label={open ? "Contraer capa" : "Expandir capa"}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      className={cn(
        "grid h-4 w-4 shrink-0 place-items-center",
        "text-[10px] leading-none text-ink",
        "focus-visible:focus-dotted focus-visible:outline-offset-[-1px]",
      )}
    >
      {open ? "−" : "+"}
    </button>
  );
}

function LayerRows({
  blocks,
  level,
  selectedId,
  collapsed,
  dropHint,
  firstId,
  onSelect,
  onToggle,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  blocks: readonly BuilderBlock[];
  level: number;
  selectedId: string | null;
  collapsed: Set<string>;
  dropHint: DropHint | null;
  firstId: string | undefined;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onDragStart: (event: DragEvent<HTMLElement>, block: BuilderBlock) => void;
  onDragOver: (
    event: DragEvent<HTMLElement>,
    block: BuilderBlock,
  ) => BuilderDropPosition;
  onDragLeave: () => void;
  onDrop: (
    event: DragEvent<HTMLElement>,
    block: BuilderBlock,
    position: BuilderDropPosition,
  ) => void;
}) {
  const { locale } = useI18n();
  return (
    <>
      {blocks.map((block) => {
        const definition = getBlockDefinition(block.type, locale);
        const hasChildren = (block.children?.length ?? 0) > 0;
        const open = hasChildren && !collapsed.has(block.id);
        const selected = selectedId === block.id;
        const hint = dropHint?.id === block.id ? dropHint.position : null;

        return (
          <li role="none" key={block.id}>
            <div
              role="treeitem"
              data-layer-id={block.id}
              aria-level={level}
              aria-selected={selected}
              aria-expanded={hasChildren ? open : undefined}
              tabIndex={selected || (!selectedId && block.id === firstId) ? 0 : -1}
              draggable
              onClick={() => onSelect(block.id)}
              onFocus={() => onSelect(block.id)}
              onDragStart={(event) => onDragStart(event, block)}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                onDragOver(event, block);
              }}
              onDragLeave={onDragLeave}
              onDrop={(event) => {
                event.preventDefault();
                const position = positionFor(event, block);
                onDrop(event, block, position);
              }}
              className={cn(
                "relative flex h-[21px] select-none items-center gap-1 px-1",
                "text-[11px] leading-[13px]",
                selected
                  ? "bg-accent text-ink-inverse"
                  : "text-ink hover:bg-surface-pressed",
                "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
                hint === "inside" &&
                  "outline outline-2 -outline-offset-2 outline-accent",
              )}
            >
              <Twisty
                open={open}
                hasChildren={hasChildren}
                onToggle={() => onToggle(block.id)}
              />
              <Icon name={definition.icon} />
              <span className="truncate">{definition.label}</span>
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  selected ? "text-ink-inverse/80" : "text-ink-muted",
                )}
              >
                {definition.summary(block.props)}
              </span>
              {hint === "before" ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -top-[1px] h-[2px] bg-accent"
                />
              ) : null}
              {hint === "after" ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -bottom-[1px] h-[2px] bg-accent"
                />
              ) : null}
            </div>

            {open ? (
              <ul
                role="group"
                className="ml-3 border-l border-dotted border-bevel-shadow pl-1"
              >
                <LayerRows
                  blocks={block.children ?? []}
                  level={level + 1}
                  selectedId={selectedId}
                  collapsed={collapsed}
                  dropHint={dropHint}
                  firstId={firstId}
                  onSelect={onSelect}
                  onToggle={onToggle}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                />
              </ul>
            ) : null}
          </li>
        );
      })}
    </>
  );
}

export function LayerTree({
  blocks,
  selectedId,
  onSelect,
  onDropBlock,
}: {
  blocks: readonly BuilderBlock[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDropBlock: (
    payload: BuilderDragPayload,
    targetId: string | null,
    position: BuilderDropPosition,
  ) => void;
}) {
  const { messages } = useI18n();
  const copy = messages.builder.layerTree;
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const [dropHint, setDropHint] = useState<DropHint | null>(null);

  function toggle(id: string) {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function readPayload(event: DragEvent<HTMLElement>): BuilderDragPayload | null {
    return parseDragPayload(event.dataTransfer.getData(BUILDER_DND_MIME));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const target = event.target as HTMLElement;
    const row = target.closest<HTMLElement>("[data-layer-id]");
    if (!row) {
      return;
    }
    const id = row.dataset.layerId;
    if (!id) {
      return;
    }

    const rows = [
      ...event.currentTarget.querySelectorAll<HTMLElement>("[data-layer-id]"),
    ];
    const index = rows.indexOf(row);
    const level = Number(row.getAttribute("aria-level") ?? "1");
    const expanded = row.getAttribute("aria-expanded") === "true";

    if (event.key === "ArrowDown") {
      event.preventDefault();
      rows[Math.min(index + 1, rows.length - 1)]?.focus();
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      rows[Math.max(index - 1, 0)]?.focus();
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      rows[0]?.focus();
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      rows[rows.length - 1]?.focus();
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      if (expanded) {
        const next = rows[index + 1];
        if (next && Number(next.getAttribute("aria-level") ?? "0") > level) {
          next.focus();
        }
      } else if (row.getAttribute("aria-expanded") !== null) {
        toggle(id);
      }
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (expanded) {
        toggle(id);
        return;
      }
      for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
        const candidate = rows[cursor];
        if (candidate && Number(candidate.getAttribute("aria-level") ?? "0") < level) {
          candidate.focus();
          return;
        }
      }
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(id);
    }
  }

  return (
    <div className="grid gap-1">
      {blocks.length > 0 ? (
        <ul
          role="tree"
          aria-label={copy.aria}
          onKeyDown={handleKeyDown}
          className="bevel-field bg-surface-sunken p-1"
        >
          <LayerRows
            blocks={blocks}
            level={1}
            selectedId={selectedId}
            collapsed={collapsed}
            dropHint={dropHint}
            firstId={blocks[0]?.id}
            onSelect={onSelect}
            onToggle={toggle}
            onDragStart={(event, block) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData(
                BUILDER_DND_MIME,
                JSON.stringify({ kind: "move", id: block.id }),
              );
            }}
            onDragOver={(event, block) => {
              const position = positionFor(event, block);
              setDropHint({ id: block.id, position });
              return position;
            }}
            onDragLeave={() => setDropHint(null)}
            onDrop={(event, block, position) => {
              const payload = readPayload(event);
              setDropHint(null);
              if (payload) {
                onDropBlock(payload, block.id, position);
              }
            }}
          />
        </ul>
      ) : (
        <p className="bevel-field bg-surface-sunken px-1 py-2 text-[10px] leading-[13px] text-ink-muted">
          {copy.empty}
        </p>
      )}

      <div
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
        }}
        onDrop={(event) => {
          event.preventDefault();
          const payload = readPayload(event);
          if (payload) {
            onDropBlock(payload, null, "after");
          }
        }}
        className={cn(
          "border border-dashed border-bevel-shadow p-1 text-center",
          "text-[10px] leading-[13px] text-ink-muted",
        )}
      >
        {copy.hint}
      </div>
    </div>
  );
}
